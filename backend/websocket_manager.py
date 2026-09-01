from typing import Dict, List
from fastapi import WebSocket
import json

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, story_id: int):
        await websocket.accept()
        if story_id not in self.active_connections:
            self.active_connections[story_id] = []
        self.active_connections[story_id].append(websocket)

    def disconnect(self, websocket: WebSocket, story_id: int):
        if story_id in self.active_connections:
            self.active_connections[story_id].remove(websocket)
            if not self.active_connections[story_id]:
                del self.active_connections[story_id]

    async def broadcast_to_story(self, story_id: int, message: str):
        if story_id in self.active_connections:
            for connection in self.active_connections[story_id]:
                try:
                    await connection.send_text(message)
                except Exception:
                    # Remove broken connections
                    self.active_connections[story_id].remove(connection)

    async def handle_message(self, story_id: int, data: str, websocket: WebSocket):
        # For now, just broadcast the message to all collaborators
        # In a more sophisticated implementation, you might parse the data
        # and perform different actions based on message type
        await self.broadcast_to_story(story_id, json.dumps({
            "type": "message",
            "story_id": story_id,
            "data": data
        }))

manager = ConnectionManager()