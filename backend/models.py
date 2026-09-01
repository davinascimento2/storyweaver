"""Database models for StoryWeaver."""

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from .database import Base


class UserRole(str, enum.Enum):
    OWNER = "owner"
    COLLABORATOR = "collaborator"


class Story(Base):
    __tablename__ = "stories"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    prompt = Column(Text, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    owner = relationship("User", back_populates="owned_stories")
    chapters = relationship("Chapter", back_populates="story", cascade="all, delete-orphan")
    collaborations = relationship("Collaboration", back_populates="story", cascade="all, delete-orphan")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    owned_stories = relationship("Story", back_populates="owner")
    authored_chapters = relationship("Chapter", back_populates="author")
    collaborations = relationship("Collaboration", back_populates="user")


class Chapter(Base):
    __tablename__ = "chapters"

    id = Column(Integer, primary_key=True, index=True)
    story_id = Column(Integer, ForeignKey("stories.id"), nullable=False)
    content = Column(Text, nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    sequence_number = Column(Integer, nullable=False)
    is_ai_generated = Column(String(10), default="false")  # Store as string for SQLite compatibility
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    story = relationship("Story", back_populates="chapters")
    author = relationship("User", back_populates="authored_chapters")


class Collaboration(Base):
    __tablename__ = "collaborations"

    id = Column(Integer, primary_key=True, index=True)
    story_id = Column(Integer, ForeignKey("stories.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())
    role = Column(Enum(UserRole), default=UserRole.COLLABORATOR)

    # Relationships
    story = relationship("Story", back_populates="collaborations")
    user = relationship("User", back_populates="collaborations")

    # Ensure a user can only collaborate once per story
    __table_args__ = (UniqueConstraint('story_id', 'user_id', name='_story_user_uc'),)