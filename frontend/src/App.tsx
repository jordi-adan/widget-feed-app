   import React from 'react';
import './App.css';
import { NewWidgetFeed } from './components/NewWidgetFeed';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>🎛️ Widget Feed</h1>
        <p>PRD-Compliant Single-Screen Widget Application</p>
      </header>
      <main className="app-main">
        <NewWidgetFeed />
      </main>
    </div>
  );
}

export default App;