import React, { useState, useEffect, useRef } from 'react';
import './SearchInterface.scss';
import sampleData from '../sample-data.json';
import axios from 'axios';
import ChevronDown from '../assets/icons/chevron-down-black.svg';

const SearchInterface = (props) => {
    const [searchUrl, setSearchUrl] = useState('https://www.reddit.com/r/shopify/new/.json');
    const [searchStr, setSearchStr] = useState('');
    const [matchedPosts, setMatchedPosts] = useState({}); // match search terms are keys?
    const [tagOrder, setTagOrder] = useState([ // precedence of tags to search against
        'App Dev',
        'Shopify POS',
        'Theme Help',
        'Discussion',
        'null',
        'Dropshipping',
        'Content Marketing'
    ]);
    const [sortedData, setSortedData] = useState({});
    const [openAccordionRows, setOpenAccordionRows] = useState([]);
    const searchTags = useRef(null);
    const [saveInProgress, setSaveInProgress] = useState(false);
    const baseUrl = window.location.href;
    const rowKeys = [];
    const pushedTitles = [];

    const changeSearchStr = (e) => {
        setSearchStr(e.target.value);
    }

    const changeSearchUrl = (e) => {
        setSearchUrl(e.target.value);
    }

    // adds clicked row to opened rows
    const toggleAccordionRow = (accordionId) => {
        const openAccordionRowsCopy = [...openAccordionRows];
        const accordionIdIndex = openAccordionRowsCopy.indexOf(accordionId);

        if (accordionIdIndex >= 0) {
            openAccordionRowsCopy.splice(accordionIdIndex, 1);
        } else {
            openAccordionRowsCopy.push(accordionId);
        }

        setOpenAccordionRows(openAccordionRowsCopy);
    }

    // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
    const randomStrGenerator = (length) => {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        if (rowKeys.indexOf(result) !== -1) {
            randomStrGenerator(result); // potential infinite loop
        }

        rowKeys.push(result);

        return result;
    }

    const searchResults = () => {
        return <div className="subreddit-topic-search__search-results">
            { !Object.keys(matchedPosts).length
                ? <h2>{ searchStr ? "No results" : `Enter search terms then click "Search"` }</h2>
                : Object.keys(matchedPosts).map((postsTagGroup) => {
                        return !matchedPosts[postsTagGroup] ? null :
                            <>
                                <div className="subreddit-topic-search__search-result-flair">
                                    <span>{ postsTagGroup }</span></div>
                                { matchedPosts[postsTagGroup].map((matchedPost, index) => {
                                    let accordionOpen = (openAccordionRows.indexOf(matchedPost.rowId) !== -1) ? 'open' : "";
                                    return <div
                                        id={ matchedPost.rowId }
                                        className={"subreddit-topic-search__search-result " + accordionOpen}
                                        key={ matchedPost.rowId } /* doesn't check if unique/exists */ >
                                        <div
                                            className="subreddit-topic-search__search-result-header"
                                            onClick={ () => toggleAccordionRow(matchedPost.rowId) }>
                                            <h2>{ matchedPost.title }</h2>
                                            <img alt="expand row" src={ ChevronDown } />
                                        </div>
                                        <div className="subreddit-topic-search__search-result-body">
                                            <a href={ matchedPost.url } target="_blank" rel="noopener noreferrer" >Go to</a>
                                            { matchedPost.body.split("\n").map(line => <p>{line}</p>) }
                                        </div>
                                    </div>
                                }) }
                            </>
                    })
                }
        </div>;
    }

    const parseData = (apiData) => {
        const newPosts = !apiData ? sampleData.data.children : apiData.data.children;
        const flairSort = {};
        let highestScore = 0; // increment then compare against as range

        newPosts.forEach((postObj) => {
            const post = postObj.data;

            highestScore = (post.score > highestScore) ? post.score : highestScore;

            if (!(post.link_flair_text in flairSort)) {
                flairSort[post.link_flair_text] = [];
            }

            flairSort[post.link_flair_text].push({
                title: post.title,
                body: post.selftext,
                url: post.url,
                rowId: randomStrGenerator(24)
            });
        });

        // reorder flairSort
        const flairResort = {};

        tagOrder.forEach(tag => flairResort[tag] = flairSort[tag]);

        setSortedData(flairResort);
    }

    const searchPosts = () => {
        if (searchStr) {
            let searchArr = searchStr.split('');
            if (searchStr.indexOf(',')) {
                searchArr = searchStr.split(',');
            }

            // basic "algorithm" searches in the order of tags, then title, then body
            // ideal could be draggable buttons that are toggleable.

            const searchResults = {};

            searchArr.forEach((searchStr) => {
                Object.keys(sortedData).forEach((tag) => {
                    let tagPosts = sortedData[tag];
                    if (tagPosts && tagPosts.length) {
                        tagPosts.forEach((tagPost) => {
                            if (tagPost.title.indexOf(searchStr) !== -1 || tagPost.body.indexOf(searchStr) !== -1) {
                                if (!(tag in searchResults)) {
                                    searchResults[tag] = [];
                                }
                                if (pushedTitles.indexOf(tagPost.title) === -1) {
                                    searchResults[tag].push(tagPost);
                                    pushedTitles.push(tagPost.title);
                                }
                            }
                        });
                    }
                });
            });

            setMatchedPosts(searchResults);
        }
    }

    const getData = () => {
        axios.get(searchUrl)
            .then((response) => {
                // handle success
                if (response.data && response.data.data) {
                    parseData(response.data);
                }
            })
            .catch((error) => {
                alert('Error fetching live data');
                console.log(error);
            });
    }

    const saveTags = () => {
        setSaveInProgress(true);

        // fake delay
        setTimeout(() => {
            let activeTags = searchTags.current.value;

            if (activeTags) {
                activeTags = activeTags.split(',');
            }

            localStorage.setItem('subreddit-topic-search-tags', JSON.stringify(activeTags));
            setSaveInProgress(false);
        }, 1500);
    }

    const loadLocalSearchTags = () => {
        const localSearchTags = localStorage.getItem('subreddit-topic-search-tags');
        const parsedSavedTags = JSON.parse(localSearchTags);

        if (localSearchTags && Array.isArray(parsedSavedTags)) {
            setSearchStr(parsedSavedTags.join(','));
        }
    }

    const liveUrl = () => {
        return window.location.href.indexOf('?live=true') !== -1;
    }

    useEffect(() => {
        console.log('render');
    });
    
    useEffect(() => {
        if (liveUrl()) {
            getData();
        } else {
            parseData();
        }
    }, []);

    useEffect(() => {
        // update previous tags
        loadLocalSearchTags();
    }, [matchedPosts]);

    return <div className="subreddit-topic-search__search-interface">
        <a className="subreddit-topic-search__search-interface-link-switcher" href={liveUrl() ? window.location.origin + window.location.pathname : `${baseUrl}?live=true`}>Switch to {liveUrl() ? 'mock' : 'live'}</a>
        <input type="text" value={searchUrl} onChange={(e) => changeSearchUrl(e) } />
        <textarea ref={searchTags} value={searchStr} onChange={(e) => changeSearchStr(e)} placeholder='Enter search terms separated by commas' />
        <div className="subreddit-topic-search__search-interface-btns">
            <button id="save-tags" type="button" onClick={() => saveTags()} disabled={saveInProgress ? true : false}>Save Tags</button>
            <button id="search" type="button" onClick={() => searchPosts()}>Search</button>
        </div>
        { searchResults() }
    </div>
}

export default SearchInterface;