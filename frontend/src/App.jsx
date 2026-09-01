import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StoryEditor from './components/StoryEditor';
import StoryBrowser from './components/StoryBrowser';
import CollaborationPanel from './components/CollaborationPanel';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <h1>StoryWeaver</h1>
          <nav>
            <a href="/">Browse Stories</a>
            <a href="/create">Create Story</a>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<StoryBrowser />} />
            <Route path="/create" element={<Navigate replace to="/stories/new" />} />
            <Route path="/stories/new" element={<StoryEditor />} />
            <Route path="/stories/:storyId" element={
              <>
                <StoryEditor />
                <CollaborationPanel />
              </>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;