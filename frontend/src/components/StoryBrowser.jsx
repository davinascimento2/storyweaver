import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const StoryBrowser = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/stories/');
        setStories(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load stories');
        setLoading(false);
        console.error('Error fetching stories:', err);
      }
    };

    fetchStories();
  }, []);

  const handleCreateStory = () => {
    navigate('/stories/new');
  };

  if (loading) return <div className="story-browser">Loading stories...</div>;
  if (error) return <div className="story-browser error">{error}</div>;

  return (
    <div className="story-browser">
      <h2>Discover Stories</h2>
      <button onClick={handleCreateStory} className="create-btn">
        + Start New Story
      </button>

      {stories.length === 0 ? (
        <p className="empty-state">No stories yet. Be the first to create one!</p>
      ) : (
        <div className="stories-grid">
          {stories.map(story => (
            <div key={story.id} className="story-card">
              <h3>{story.title}</h3>
              <p className="story-prompt">{story.prompt}</p>
              <div className="story-meta">
                <span>By User #{story.owner_id}</span>
                <span>Created: {new Date(story.created_at).toLocaleDateString()}</span>
              </div>
              <Link to={`/stories/${story.id}`} className="read-btn">
                Read Story
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoryBrowser;