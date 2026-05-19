from contextlib import asynccontextmanager
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from .database import init_db
from .routers import auth as auth_router
from .routers import chat as chat_router
from .routers import documents as documents_router

load_dotenv()

STATIC_DIR = Path(__file__).parent.parent / "static"


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="Prelegal API", lifespan=lifespan)

app.include_router(auth_router.router)
app.include_router(documents_router.router)
app.include_router(chat_router.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}


# AI: APIルートより後にマウントしないと静的ファイルがAPIを上書きしてしまう
if STATIC_DIR.exists():
    app.mount("/", StaticFiles(directory=str(STATIC_DIR), html=True), name="static")
