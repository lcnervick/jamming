import './resources/css/App.css';
import React, {useState, useEffect} from 'react';
import {SearchBar, SearchButton, ClearSearch} from './Search.js';
import {PlaylistName, PlaylistSave} from './Playlist.js';
import {Track} from './Track.js';

function App() {
  const clientID = 'b2359de28f42496482e8a5a0aaeb483f';
  const clientSecret = '02ad3ab661be483bae9ef48bad4d1b2e';

  const [tracks, setTracks] = useState([]);
  const [playlist, setPlaylist] = useState([]);

  const searchForMusic = () => {
    let query = document.getElementById('search-bar').value;
    console.log('Searching');
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
    let searchBar = document.getElementById('search-bar');
		searchBar.value = '';
		searchBar.focus();
    setTracks([]);
  }

  const addTrackToPlaylist = (track) => {
    setTracks(tracks.filter(t => t.id !== track.id));
    setPlaylist(playlist.filter(t => t.id !== track.id).concat(track));
    console.log(playlist, tracks);
  };

  const removeTrackFromPlaylist = (track) => {
    setPlaylist(playlist.filter(t => t.id !== track.id));
  }
  
  
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
              <Track track={track} key={track.id} addOrRemove={true} handleClick={() => addTrackToPlaylist(track)} />
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
              <Track track={track} key={track.id} addOrRemove={false} handleClick={() => removeTrackFromPlaylist(track)} />
            ))
          } </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
