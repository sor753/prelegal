import json
import sqlite3
from typing import Annotated, Literal

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from ..auth import get_current_user
from ..database import DB_PATH

router = APIRouter(prefix="/api/documents")

CurrentUser = Annotated[int, Depends(get_current_user)]


class DocumentSaveRequest(BaseModel):
    doc_type: Literal["mnda", "mnda_coverpage", "design_partner", "sla"]
    title: str
    form_data: dict


class DocumentResponse(BaseModel):
    id: int
    doc_type: str
    title: str
    saved_at: str


@router.get("", response_model=list[DocumentResponse])
def list_documents(user_id: CurrentUser) -> list[DocumentResponse]:
    with sqlite3.connect(DB_PATH) as conn:
        rows = conn.execute(
            "SELECT id, doc_type, title, saved_at FROM documents WHERE user_id = ? ORDER BY saved_at DESC",
            (user_id,),
        ).fetchall()
    return [DocumentResponse(id=r[0], doc_type=r[1], title=r[2], saved_at=r[3]) for r in rows]


@router.post("", response_model=DocumentResponse)
def save_document(req: DocumentSaveRequest, user_id: CurrentUser) -> DocumentResponse:
    form_data_json = json.dumps(req.form_data, ensure_ascii=False)
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.execute(
            "INSERT INTO documents (user_id, doc_type, title, form_data) VALUES (?, ?, ?, ?)",
            (user_id, req.doc_type, req.title, form_data_json),
        )
        doc_id = cursor.lastrowid
        if doc_id is None:
            raise HTTPException(status_code=500, detail="文書の保存に失敗しました")
        row = conn.execute(
            "SELECT id, doc_type, title, saved_at FROM documents WHERE id = ?", (doc_id,)
        ).fetchone()
    return DocumentResponse(id=row[0], doc_type=row[1], title=row[2], saved_at=row[3])


@router.delete("/{doc_id}")
def delete_document(doc_id: int, user_id: CurrentUser) -> dict:
    with sqlite3.connect(DB_PATH) as conn:
        result = conn.execute(
            "DELETE FROM documents WHERE id = ? AND user_id = ?", (doc_id, user_id)
        )
        conn.commit()
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="文書が見つかりません")
    return {"ok": True}
