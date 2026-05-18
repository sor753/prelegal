import json
import os
from typing import Literal

import litellm
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, ValidationError

router = APIRouter()

_SYSTEM_PROMPT = """あなたはMNDA（相互秘密保持契約）の作成アシスタントです。ユーザーと日本語で自然に会話しながら、1つずつ質問してフォームのフィールドを埋めてください。

収集するフィールド（デフォルト値があるものも必ずユーザーに確認する）:
- purpose: MNDAを締結する目的・機密情報の使用理由
- effectiveDate: 発効日（YYYY-MM-DD形式）
- mndaTerm: MNDA期間（"expires"と年数、または"until_terminated"）
- confidentialityTerm: 機密保持期間（"years"と年数、または"perpetuity"）
- governingLaw: 準拠法（都道府県または州）
- jurisdiction: 管轄裁判所
- party1: 当事者1（signatoryName, title, company, noticeAddress, date）
- party2: 当事者2（同上）
- modifications: 標準条件への変更（任意、最後に確認）

規則:
- 1回の返答では1〜2項目のみ質問する
- フォームにデフォルト値があるフィールドも、ユーザーに確認または変更の機会を与える
- ユーザーの回答から該当フィールドの値を抽出してupdatesに設定する
- まだ判明していないフィールドはnullのまま
- 日付はYYYY-MM-DD形式
- すべてのフィールドが揃ったら完了メッセージを返す

必ず以下のJSON形式で返答してください:
{
  "reply": "ユーザーへのメッセージ（次の質問を含む）",
  "updates": {
    "purpose": null,
    "effectiveDate": null,
    "mndaTerm": null,
    "confidentialityTerm": null,
    "governingLaw": null,
    "jurisdiction": null,
    "modifications": null,
    "party1": null,
    "party2": null
  }
}

mndaTermの形式例: {"type": "expires", "years": 2} または {"type": "until_terminated"}
confidentialityTermの形式例: {"type": "years", "years": 3} または {"type": "perpetuity"}
party1/party2の形式例: {"signatoryName": "山田 太郎", "title": "代表取締役", "company": "株式会社〇〇", "noticeAddress": "example@co.jp", "date": "2026-05-19"}"""


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    current_form: dict


class PartyUpdate(BaseModel):
    signatoryName: str | None = None
    title: str | None = None
    company: str | None = None
    noticeAddress: str | None = None
    date: str | None = None


class MndaTermUpdate(BaseModel):
    type: Literal["expires", "until_terminated"]
    years: int | None = None


class ConfidentialityTermUpdate(BaseModel):
    type: Literal["years", "perpetuity"]
    years: int | None = None


class FormUpdates(BaseModel):
    purpose: str | None = None
    effectiveDate: str | None = None
    mndaTerm: MndaTermUpdate | None = None
    confidentialityTerm: ConfidentialityTermUpdate | None = None
    governingLaw: str | None = None
    jurisdiction: str | None = None
    modifications: str | None = None
    party1: PartyUpdate | None = None
    party2: PartyUpdate | None = None


class ChatResponse(BaseModel):
    reply: str
    updates: FormUpdates


@router.post("/api/chat", response_model=ChatResponse)
async def chat(req: ChatRequest) -> ChatResponse:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENROUTER_API_KEY が設定されていません")

    system_content = (
        _SYSTEM_PROMPT
        + f"\n\n現在のフォーム状態:\n{json.dumps(req.current_form, ensure_ascii=False, indent=2)}"
    )

    llm_messages = [{"role": "system", "content": system_content}]
    llm_messages += [{"role": m.role, "content": m.content} for m in req.messages]

    response = await litellm.acompletion(
        model="openrouter/openai/gpt-oss-120b",
        messages=llm_messages,
        response_format={"type": "json_object"},
        api_key=api_key,
    )

    content = response.choices[0].message.content
    try:
        return ChatResponse.model_validate_json(content)
    except ValidationError:
        raise HTTPException(status_code=500, detail="AI応答の解析に失敗しました")
