import './resources/css/App.css';
import React, {useState, useEffect} from 'react';
import {SearchBar, SearchButton, ClearSearch} from './Search.js';
import {Track} from './Track.js';
import {PlaylistName, PlaylistSave} from './Playlist.js';

function App() {
  const clientID = 'b2359de28f42496482e8a5a0aaeb483f';
  const clientSecret = '02ad3ab661be483bae9ef48bad4d1b2e';

  const trackList = [];
  const [tracks, setTracks] = useState(trackList);
  const [playlist, setPlaylist] = useState([]);

  const searchForMusic = () => {
    let query = document.getElementById('search-bar').value;
    setTracks([
      {
        title: 'Happy Tuesday!',
        artist: 'Leif Nervick',
        id: 1
      },
      {
        title: 'Where Are My Shoes?',
        artist: 'Thorben Nervick',
        id: 2
      }]
    );
  }

  const clearSearchResults = () => {
    setTracks([]);
  }

  const addTrackToPlaylist = (id) => {

  };
  
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>Jamming!</h1>
        <h2>Spotify Playlist Manager</h2>
      </header>
      <main>
        <section className="search">
          <SearchBar />
          <SearchButton handleClick={searchForMusic} />
          <ClearSearch handleClick={clearSearchResults} />
        </section>
        <section className='tracks'>
          <h3>Search Results</h3>
          <ul className="track-list"> {
            tracks.map(track => (
              <Track track={track} key={track.id} handleAdd={addTrackToPlaylist} />
            ))
          } </ul>
        </section>
        <section className='playlist'>
          <div className='playlist-header'>
            <PlaylistName />
            <PlaylistSave />
          </div>
          <ul className="playlist-list"> {
            playlist.map(track => (
              <Track track={track} key={track.id} />
            ))
          } </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
