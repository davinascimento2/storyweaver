"""StoryWeaver FastAPI application factory."""

from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
import os
from pathlib import Path

from .database import init_db
from .routers import auth, stories, collaborations
from .websocket_manager import manager


def create_app() -> FastAPI:
    """Create the StoryWeaver FastAPI application."""
    app = FastAPI(title="StoryWeaver", version="0.1.0")

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # In production, specify actual origins
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Initialize database
    @app.on_event("startup")
    async def startup_event():
        init_db()

    # Include routers
    app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
    app.include_router(stories.router, prefix="/api/stories", tags=["stories"])
    app.include_router(collaborations.router, prefix="/api/collaborations", tags=["collaborations"])

    # WebSocket endpoint
    @app.websocket("/ws/{story_id}")
    async def websocket_endpoint(websocket, story_id: int):
        await manager.connect(websocket, story_id)
        try:
            while True:
                data = await websocket.receive_text()
                # Handle incoming WebSocket messages
                await manager.handle_message(story_id, data, websocket)
        except Exception:
            await manager.disconnect(websocket, story_id)

    # Serve frontend static files (for production)
    frontend_dist = Path(__file__).parent.parent / "frontend" / "dist"
    if frontend_dist.exists():
        app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")

    @app.get("/health")
    async def health_check():
        return {"status": "healthy", "service": "storyweaver"}

    return app