import React, { useEffect } from 'react';
import './App.css';
import axios from 'axios';
import SearchInterface from './search-interface/SearchInterface';

const App = () => {
  // const getData = () => {
  //   axios.get(targetUrl)
  //     .then(function (response) {
  //       // handle success
  //       console.log(response);
  //       if (response.data && response.data.data) {
  //         console.log(response.data);
  //       }
  //     })
  //     .catch(function (error) {
  //       // handle error
  //       console.log(error);
  //     })
  //     .then(function () {
  //       // always executed
  //     });
  // }

  return (
    <div className="subreddit-topic-search">
      <SearchInterface />
    </div>
  );
}

export default App;
