   import React from 'react';
import './App.css';
import { WidgetFeed } from './components/WidgetFeed';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>🎛️ Widget Feed</h1>
        <p>Create and manage your widgets</p>
      </header>
      <main className="app-main">
        <WidgetFeed />
      </main>
    </div>
  );
}

export default App;