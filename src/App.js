import React, { useEffect } from 'react';
import './App.css';
import SearchInterface from './search-interface/SearchInterface';

const App = () => {
  return (
    <div className="subreddit-topic-search">
      <SearchInterface />
    </div>
  );
}

export default App;
