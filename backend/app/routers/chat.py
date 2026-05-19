import json
import os
from typing import Literal

import litellm
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, ValidationError
from litellm.exceptions import APIError as LiteLLMAPIError

router = APIRouter()

_SUPPORTED_DOCS = """このアプリがサポートする文書は以下の4種類です:
- MNDA（相互秘密保持契約）
- MNDA表紙
- デザインパートナー契約
- SLA（サービスレベル契約）

ユーザーがこれ以外の文書を要求した場合は、その文書には対応していないことを説明し、上記の中で最も近い文書を提案してください。"""

_MNDA_BASE_PROMPT = """\
あなたは{doc_name}の作成アシスタントです。ユーザーと日本語で自然に会話しながら、1つずつ質問してフォームのフィールドを埋めてください。

{supported_docs}

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
{{
  "reply": "ユーザーへのメッセージ（次の質問を含む）",
  "updates": {{
    "purpose": null,
    "effectiveDate": null,
    "mndaTerm": null,
    "confidentialityTerm": null,
    "governingLaw": null,
    "jurisdiction": null,
    "modifications": null,
    "party1": null,
    "party2": null
  }}
}}

mndaTermの形式例: {{"type": "expires", "years": 2}} または {{"type": "until_terminated"}}
confidentialityTermの形式例: {{"type": "years", "years": 3}} または {{"type": "perpetuity"}}
party1/party2の形式例: {{"signatoryName": "山田 太郎", "title": "代表取締役", "company": "株式会社〇〇", "noticeAddress": "example@co.jp", "date": "2026-05-19"}}"""

_SYSTEM_PROMPT_MNDA = _MNDA_BASE_PROMPT.format(
    doc_name="MNDA（相互秘密保持契約）",
    supported_docs=_SUPPORTED_DOCS,
)

_SYSTEM_PROMPT_MNDA_COVERPAGE = _MNDA_BASE_PROMPT.format(
    doc_name="MNDA（相互秘密保持契約）表紙",
    supported_docs=_SUPPORTED_DOCS,
)

_SYSTEM_PROMPT_DESIGN_PARTNER = f"""あなたはデザインパートナー契約の作成アシスタントです。ユーザーと日本語で自然に会話しながら、1つずつ質問してフォームのフィールドを埋めてください。

{_SUPPORTED_DOCS}

収集するフィールド:
- effectiveDate: 発効日（YYYY-MM-DD形式）
- term: 契約期間（例: "6ヶ月", "1年"）
- fees: 料金（例: "なし", "月額50,000円"）
- product: 製品・サービス名
- governingLaw: 準拠法（都道府県または国、例: "東京都", "カリフォルニア州"）
- chosenCourts: 選択裁判所（例: "東京地方裁判所"）
- provider: プロバイダー情報（signatoryName, title, company, noticeAddress）
- partner: パートナー情報（signatoryName, title, company, noticeAddress）

規則:
- 1回の返答では1〜2項目のみ質問する
- ユーザーの回答から該当フィールドの値を抽出してupdatesに設定する
- まだ判明していないフィールドはnullのまま
- 日付はYYYY-MM-DD形式
- すべてのフィールドが揃ったら完了メッセージを返す

必ず以下のJSON形式で返答してください:
{{
  "reply": "ユーザーへのメッセージ（次の質問を含む）",
  "updates": {{
    "effectiveDate": null,
    "term": null,
    "fees": null,
    "product": null,
    "governingLaw": null,
    "chosenCourts": null,
    "provider": null,
    "partner": null
  }}
}}

provider/partnerの形式例: {{"signatoryName": "山田 太郎", "title": "代表取締役", "company": "株式会社〇〇", "noticeAddress": "example@co.jp"}}"""

_SYSTEM_PROMPT_SLA = f"""あなたはサービスレベル契約（SLA）の作成アシスタントです。ユーザーと日本語で自然に会話しながら、1つずつ質問してフォームのフィールドを埋めてください。

{_SUPPORTED_DOCS}

収集するフィールド:
- targetUptime: 目標稼働率（例: "99.9%", "99.5%"）
- subscriptionPeriod: サブスクリプション期間（例: "1年間", "月次"）
- supportChannel: サポートチャンネル（例: "support@example.com", "https://support.example.com"）
- targetResponseTime: 目標応答時間（例: "4時間以内", "1営業日以内"）
- scheduledDowntime: 予定ダウンタイム（例: "毎週日曜日 2:00-4:00 JST", "なし"）
- uptimeCredit: 稼働率クレジット（例: "月額料金の10%", "月額料金の5%"）
- responseTimeCredit: 応答時間クレジット（例: "月額料金の5%", "月額料金の3%"）
- provider: プロバイダー情報（signatoryName, title, company, noticeAddress）
- customer: 顧客情報（signatoryName, title, company, noticeAddress）

規則:
- 1回の返答では1〜2項目のみ質問する
- ユーザーの回答から該当フィールドの値を抽出してupdatesに設定する
- まだ判明していないフィールドはnullのまま
- すべてのフィールドが揃ったら完了メッセージを返す

必ず以下のJSON形式で返答してください:
{{
  "reply": "ユーザーへのメッセージ（次の質問を含む）",
  "updates": {{
    "targetUptime": null,
    "subscriptionPeriod": null,
    "supportChannel": null,
    "targetResponseTime": null,
    "scheduledDowntime": null,
    "uptimeCredit": null,
    "responseTimeCredit": null,
    "provider": null,
    "customer": null
  }}
}}

provider/customerの形式例: {{"signatoryName": "山田 太郎", "title": "代表取締役", "company": "株式会社〇〇", "noticeAddress": "example@co.jp"}}"""


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    current_form: dict
    doc_type: Literal["mnda", "mnda_coverpage", "design_partner", "sla"] = "mnda"


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


class MndaFormUpdates(BaseModel):
    purpose: str | None = None
    effectiveDate: str | None = None
    mndaTerm: MndaTermUpdate | None = None
    confidentialityTerm: ConfidentialityTermUpdate | None = None
    governingLaw: str | None = None
    jurisdiction: str | None = None
    modifications: str | None = None
    party1: PartyUpdate | None = None
    party2: PartyUpdate | None = None


class SignatoryUpdate(BaseModel):
    signatoryName: str | None = None
    title: str | None = None
    company: str | None = None
    noticeAddress: str | None = None


class DpaFormUpdates(BaseModel):
    effectiveDate: str | None = None
    term: str | None = None
    fees: str | None = None
    product: str | None = None
    governingLaw: str | None = None
    chosenCourts: str | None = None
    provider: SignatoryUpdate | None = None
    partner: SignatoryUpdate | None = None


class SlaFormUpdates(BaseModel):
    targetUptime: str | None = None
    subscriptionPeriod: str | None = None
    supportChannel: str | None = None
    targetResponseTime: str | None = None
    scheduledDowntime: str | None = None
    uptimeCredit: str | None = None
    responseTimeCredit: str | None = None
    provider: SignatoryUpdate | None = None
    customer: SignatoryUpdate | None = None


class ChatResponse(BaseModel):
    reply: str
    updates: dict


_PROMPT_MAP = {
    "mnda": _SYSTEM_PROMPT_MNDA,
    "mnda_coverpage": _SYSTEM_PROMPT_MNDA_COVERPAGE,
    "design_partner": _SYSTEM_PROMPT_DESIGN_PARTNER,
    "sla": _SYSTEM_PROMPT_SLA,
}

_MODEL_MAP: dict[str, type] = {
    "mnda": MndaFormUpdates,
    "mnda_coverpage": MndaFormUpdates,
    "design_partner": DpaFormUpdates,
    "sla": SlaFormUpdates,
}


@router.post("/api/chat", response_model=ChatResponse)
async def chat(req: ChatRequest) -> ChatResponse:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENROUTER_API_KEY が設定されていません")

    system_content = (
        _PROMPT_MAP[req.doc_type]
        + f"\n\n現在のフォーム状態:\n{json.dumps(req.current_form, ensure_ascii=False, indent=2)}"
    )

    llm_messages = [{"role": "system", "content": system_content}]
    llm_messages += [{"role": m.role, "content": m.content} for m in req.messages]

    try:
        response = await litellm.acompletion(
            model="openrouter/openai/gpt-oss-120b",
            messages=llm_messages,
            response_format={"type": "json_object"},
            api_key=api_key,
        )
    except LiteLLMAPIError as e:
        raise HTTPException(status_code=502, detail=f"AI APIエラー: {e.message}")

    content = response.choices[0].message.content
    try:
        raw = json.loads(content)
        reply = raw.get("reply", "")
        if not reply:
            raise ValueError("empty reply")
        updates_model = _MODEL_MAP[req.doc_type]
        updates = updates_model.model_validate(raw.get("updates", {}))
        return ChatResponse(reply=reply, updates=updates.model_dump())
    except (json.JSONDecodeError, ValidationError, ValueError):
        raise HTTPException(status_code=500, detail="AI応答の解析に失敗しました")
