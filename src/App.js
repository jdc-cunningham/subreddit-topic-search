import React, { useEffect } from 'react';
import './App.css';
import axios from 'axios';
import SearchInterface from './search-interface/SearchInterface';
import { getDefaultNormalizer } from '@testing-library/react';

const App = () => {
  // const getData = () => {
  //   axios.get('https://www.reddit.com/r/shopify/new/.json')
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

  // useEffect(() => {
  //   getData();
  // }, []);

  return (
    <div className="subreddit-topic-search">
      <SearchInterface />
    </div>
  );
}

export default App;
