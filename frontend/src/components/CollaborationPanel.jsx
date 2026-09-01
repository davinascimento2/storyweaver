import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSocket } from '../hooks/useSocket';

const CollaborationPanel = () => {
  const { storyId } = useParams();
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket, joinStory } = useSocket();

  useEffect(() => {
    const loadCollaborators = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/collaborations/story/${storyId}`);
        setCollaborators(response.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error('Error loading collaborators:', err);
      }
    };

    loadCollaborators();
  }, [storyId]);

  useEffect(() => {
    if (socket && storyId) {
      joinStory(parseInt(storyId));

      socket.on('collaborator_joined', (collaborator) => {
        setCollaborators(prev => [...prev, collaborator]);
      });

      return () => {
        socket.off('collaborator_joined');
      };
    }
  }, [socket, storyId, joinStory]);

  if (loading) return <div className="collab-panel">Loading collaborators...</div>;

  return (
    <div className="collaboration-panel">
      <h3>Collaborators</h3>
      <div className="collaborators-list">
        {collaborators.length === 0 ? (
          <p className="empty">No collaborators yet</p>
        ) : (
          collaborators.map(collab => (
            <div key={collab.id} className="collaborator-item">
              <div className="collaborator-info">
                <span className="user-id">User #{collab.user_id}</span>
                <span className="role">{collab.role}</span>
              </div>
              <div className="joined-at">
                Joined: {new Date(collab.joined_at).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="collab-actions">
        <button className="invite-btn">
          Invite Friends
        </button>
        <button className="leave-btn">
          Leave Story
        </button>
      </div>
    </div>
  );
};

export default CollaborationPanel;