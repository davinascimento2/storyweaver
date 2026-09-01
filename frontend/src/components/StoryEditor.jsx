import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSocket } from '../hooks/useSocket';

const StoryEditor = () => {
  const { storyId } = useParams();
  const [chapters, setChapters] = useState([]);
  const [currentContent, setCurrentContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { socket, joinStory } = useSocket();

  useEffect(() => {
    if (!storyId) return;

    const loadChapters = async () => {
      try {
        const response = await axios.get(`/api/stories/${storyId}/chapters`);
        setChapters(response.data);
      } catch (err) {
        setError('Failed to load chapters');
        console.error('Error loading chapters:', err);
      }
    };

    loadChapters();
  }, [storyId]);

  useEffect(() => {
    if (socket && storyId) {
      joinStory(parseInt(storyId));

      socket.on('new_chapter', () => {
        loadChapters();
      });

      return () => {
        socket.off('new_chapter');
      };
    }
  }, [socket, storyId, joinStory]);

  const handleAddChapter = async () => {
    if (!currentContent.trim()) {
      setError('Chapter content cannot be empty');
      return;
    }

    setError(null);
    try {
      await axios.post(`/api/stories/${storyId}/chapters`, {
        content: currentContent,
        is_ai_generated: false
      });
      setCurrentContent('');
    } catch (err) {
      setError('Failed to add chapter');
      console.error('Error adding chapter:', err);
    }
  };

  const handleGenerateAIChapter = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      await axios.post(`/api/stories/${storyId}/chapters`, {
        content: "",  // Empty content signals AI generation
        is_ai_generated: true
      });
    } catch (err) {
      setError('Failed to generate AI chapter');
      console.error('Error generating AI chapter:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!storyId) {
    return <div>Invalid story ID</div>;
  }

  return (
    <div className="story-editor">
      <h2>Write Your Story</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="chapters-container">
        {chapters.map(chapter => (
          <div key={chapter.id} className={`chapter ${chapter.is_ai_generated ? 'ai-chapter' : ''}`}>
            <div className="chapter-content">
              {chapter.content}
            </div>
            <div className="chapter-meta">
              <span className="chapter-number">Chapter {chapter.sequence_number}</span>
              <span className="chapter-author">
                {chapter.author_id === 0 ? 'AI' : `User #${chapter.author_id}`}
              </span>
              <span className="chapter-type">
                {chapter.is_ai_generated ? '(AI Generated)' : '(User Written)'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="editor-controls">
        <textarea
          value={currentContent}
          onChange={(e) => setCurrentContent(e.target.value)}
          placeholder="Write your chapter here..."
          rows={6}
          maxLength={2000}
        />

        <div className="button-group">
          <button
            onClick={handleAddChapter}
            disabled={!currentContent.trim() || isGenerating}
            className="add-chapter-btn"
          >
            Add Chapter
          </button>

          <button
            onClick={handleGenerateAIChapter}
            disabled={isGenerating}
            className="ai-chapter-btn"
          >
            {isGenerating ? 'Generating...' : 'Generate AI Chapter'}
          </button>
        </div>
      </div>

      <div className="story-actions">
        <button
          onClick={() => navigate(-1)}
          className="back-btn"
        >
          Back to Stories
        </button>
      </div>
    </div>
  );
};

export default StoryEditor;