import React, { useState, useEffect } from 'react';
import './SearchInterface.scss';
import sampleData from '../sample-data.json';

const SearchInterface = (props) => {
    // const { defaultSearchUrl } = props;
    
    const [searchUrl, setSearchUrl] = useState('https://www.reddit.com/r/shopify/new/.json');
    const [searchStr, setSearchStr] = useState('');

    const changeSearchStr = (e) => {
        setSearchStr(e.target.value);
    }

    const changeSearchUrl = (e) => {
        setSearchUrl(e.target.value);
    }

    const searchResults = () => {
        return null;
    }

    const parseSampleData = () => {
        const newPosts = sampleData.data.children;
        const flairSort = {};
        let highestScore = 0; // increment then compare against as range

        console.log(newPosts);

        newPosts.forEach((postObj) => {
            const post = postObj.data;

            highestScore = post.score > highestScore ? post.score : highestScore;

            if (post.link_flair_text in Object.keys(newPosts)) {
                flairSort[post.link_flair_text].push({
                    title: post.title,
                    body: post.selftext
                });

                return;
            }
            
            flairSort[post.link_flair_text] = [];
            flairSort[post.link_flair_text].push({
                title: post.title,
                body: post.selftext
            });
        });

        console.log(flairSort);
        console.log(highestScore);
    }
    
    useEffect(() => {
        parseSampleData(); // response.data
    }, []);

    return <div className="subreddit-topic-search__search-interface">
        <input type="text" value={searchUrl} onChange={(e) => changeSearchUrl(e) } />
        <textarea value={searchStr} onChange={(e) => changeSearchStr(e)} placeholder='Enter search terms separated by commas' />
        { searchResults() }
    </div>
}

export default SearchInterface;