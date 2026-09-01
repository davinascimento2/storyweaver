from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List
from ..database import get_db
from ..models import Collaboration, Story, User
from sqlalchemy.orm import Session

router = APIRouter()

class CollaborationCreate(BaseModel):
    story_id: int

class CollaborationResponse(BaseModel):
    id: int
    story_id: int
    user_id: int
    joined_at: str
    role: str

    class Config:
        from_attributes = True

def get_current_user_id() -> int:
    # In a real app, this would come from JWT token
    # For simplicity in this example, we'll return a fixed user ID
    # In production, replace with proper authentication
    return 1

@router.post("/", response_model=CollaborationResponse)
async def collaborate(collab: CollaborationCreate, db: Session = Depends(get_db)):
    current_user_id = get_current_user_id()

    # Verify story exists
    story = db.query(Story).filter(Story.id == collab.story_id).first()
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")

    # Check if user is the owner (owners don't need to collaborate)
    if story.owner_id == current_user_id:
        raise HTTPException(status_code=400, detail="Story owner cannot collaborate on their own story")

    # Check if already collaborating
    existing_collab = db.query(Collaboration).filter(
        Collaboration.story_id == collab.story_id,
        Collaboration.user_id == current_user_id
    ).first()
    if existing_collab:
        raise HTTPException(status_code=400, detail="Already collaborating on this story")

    # Create collaboration
    db_collab = Collaboration(
        story_id=collab.story_id,
        user_id=current_user_id,
        role="collaborator"
    )
    db.add(db_collab)
    db.commit()
    db.refresh(db_collab)

    # Notify via WebSocket that a new collaborator joined
    from ..websocket_manager import manager
    import json
    await manager.broadcast_to_story(
        collab.story_id,
        json.dumps({
            "type": "collaborator_joined",
            "collaborator_id": db_collab.id,
            "user_id": current_user_id
        })
    )

    return db_collab

@router.get("/story/{story_id}", response_model=List[CollaborationResponse])
async def get_collaborators(story_id: int, db: Session = Depends(get_db)):
    # Verify story exists
    story = db.query(Story).filter(Story.id == story_id).first()
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")

    collaborations = db.query(Collaboration).filter(
        Collaboration.story_id == story_id
    ).all()

    return collaborations

@router.delete("/{collab_id}")
async def leave_collaboration(collab_id: int, db: Session = Depends(get_db)):
    collaboration = db.query(Collaboration).filter(Collaboration.id == collab_id).first()
    if not collaboration:
        raise HTTPException(status_code=404, detail="Collaboration not found")

    current_user_id = get_current_user_id()
    if collaboration.user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to leave this collaboration")

    story_id = collaboration.story_id
    db.delete(collaboration)
    db.commit()

    # Notify via WebSocket that a collaborator left
    from ..websocket_manager import manager
    import json
    await manager.broadcast_to_story(
        story_id,
        json.dumps({
            "type": "collaborator_left",
            "collaborator_id": collab_id,
            "user_id": current_user_id
        })
    )

    return {"message": "Left collaboration successfully"}