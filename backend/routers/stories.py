from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
import uuid
from ..database import get_db
from ..models import Story, User, Chapter
from ..ai_service import AIService
from ..websocket_manager import manager
from sqlalchemy.orm import Session
import json

router = APIRouter()
ai_service = AIService()

class StoryCreate(BaseModel):
    title: str
    prompt: str

class StoryResponse(BaseModel):
    id: int
    title: str
    prompt: str
    owner_id: int
    created_at: str

    class Config:
        from_attributes = True

class ChapterCreate(BaseModel):
    content: str
    is_ai_generated: bool = False

class ChapterResponse(BaseModel):
    id: int
    story_id: int
    content: str
    author_id: int
    sequence_number: int
    is_ai_generated: bool
    created_at: str

    class Config:
        from_attributes = True

def get_current_user_id() -> int:
    # In a real app, this would come from JWT token
    # For simplicity in this example, we'll return a fixed user ID
    # In production, replace with proper authentication
    return 1

@router.post("/", response_model=StoryResponse)
async def create_story(story: StoryCreate, db: Session = Depends(get_db)):
    current_user_id = get_current_user_id()

    db_story = Story(
        title=story.title,
        prompt=story.prompt,
        owner_id=current_user_id
    )
    db.add(db_story)
    db.commit()
    db.refresh(db_story)
    return db_story

@router.get("/", response_model=List[StoryResponse])
async def get_stories(db: Session = Depends(get_db)):
    stories = db.query(Story).all()
    return stories

@router.get("/{story_id}", response_model=StoryResponse)
async def get_story(story_id: int, db: Session = Depends(get_db)):
    story = db.query(Story).filter(Story.id == story_id).first()
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    return story

@router.post("/{story_id}/chapters", response_model=ChapterResponse)
async def add_chapter(
    story_id: int,
    chapter: ChapterCreate,
    db: Session = Depends(get_db)
):
    # Verify story exists
    story = db.query(Story).filter(Story.id == story_id).first()
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")

    current_user_id = get_current_user_id()

    # Get the next sequence number
    last_chapter = db.query(Chapter).filter(
        Chapter.story_id == story_id
    ).order_by(Chapter.sequence_number.desc()).first()

    sequence_number = (last_chapter.sequence_number + 1) if last_chapter else 1

    # Get story context for AI (last few chapters)
    recent_chapters = db.query(Chapter).filter(
        Chapter.story_id == story_id
    ).order_by(Chapter.sequence_number.desc()).limit(3).all()

    story_context = "\n\n".join([ch.content for ch in reversed(recent_chapters)])

    # Create the chapter
    db_chapter = Chapter(
        story_id=story_id,
        content=chapter.content,
        author_id=current_user_id,
        sequence_number=sequence_number,
        is_ai_generated=str(chapter.is_ai_generated).lower()
    )
    db.add(db_chapter)
    db.commit()
    db.refresh(db_chapter)

    # If this is an AI-generated chapter, generate the next one automatically
    if chapter.is_ai_generated:
        try:
            ai_content = ai_service.continue_story(story.prompt, story_context)

            # Create AI chapter
            ai_chapter = Chapter(
                story_id=story_id,
                content=ai_content,
                author_id=0,  # Special ID for AI
                sequence_number=sequence_number + 1,
                is_ai_generated="true"
            )
            db.add(ai_chapter)
            db.commit()
            db.refresh(ai_chapter)

            # Notify via WebSocket
            await manager.broadcast_to_story(
                story_id,
                json.dumps({
                    "type": "new_chapter",
                    "chapter_id": ai_chapter.id
                })
            )

            # Return the AI chapter instead of the user chapter
            return ai_chapter
        except Exception as e:
            # If AI generation fails, still return the user chapter
            print(f"AI generation failed: {e}")
            return db_chapter

    # Notify via WebSocket for user-added chapters
    await manager.broadcast_to_story(
        story_id,
        json.dumps({
            "type": "new_chapter",
            "chapter_id": db_chapter.id
        })
    )

    return db_chapter

@router.get("/{story_id}/chapters", response_model=List[ChapterResponse])
async def get_chapters(story_id: int, db: Session = Depends(get_db)):
    # Verify story exists
    story = db.query(Story).filter(Story.id == story_id).first()
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")

    chapters = db.query(Chapter).filter(
        Chapter.story_id == story_id
    ).order_by(Chapter.sequence_number).all()

    return chapters

@router.delete("/{story_id}")
async def delete_story(story_id: int, db: Session = Depends(get_db)):
    story = db.query(Story).filter(Story.id == story_id).first()
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")

    current_user_id = get_current_user_id()
    if story.owner_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this story")

    db.delete(story)
    db.commit()
    return {"message": "Story deleted successfully"}