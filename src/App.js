import './resources/css/App.css';
import React, {useState, useEffect} from 'react';
import Search from './Search.js';
import Playlist from './Playlist.js';
import Track from './Track.js';
import Spotify from './Spotify.js';

import logo from './resources/images/spotify.png';
import jammmingLogo from './resources/images/Jammming-Logo.png';

function App() {
  const spotify = new Spotify;
  const [tracks, setTracks] = useState([]);
  const [playlist, setPlaylist] = useState([]);

  function addTrackToPlaylist(track) {
    // set 'added' class to track
    setTracks(prev => {
      for(const t of prev) if(t.id === track.id) t.added = true;
      return prev;
    });

    // add track to playlist container, eliminating duplicates
    setPlaylist(prev => {
      return [...prev.filter(t => t.id !== track.id), track];
    });
  };

  function removeTrackFromPlaylist(track) {
    // remove 'added' class from search result
    setTracks(prev => {
      for(const t of prev) if(t.id === track.id) t.added = false;
      return prev;
    });

    // remove from the playlist list
    setPlaylist(prev => {
      return prev.filter(t => t.id !== track.id);
    });
  }
  
  
  return (
    <div className="App">
      <header className="App-header">
        <div></div>
        <img src={jammmingLogo} alt="jammming logo" className="jammming-logo" />
        <img src={logo} alt="Spotify Logo" className='spotify-logo' />
      </header>
      <main>

        <section className="search">
          <Search setTracks={setTracks} spotify={spotify} />
        </section>

        <section className='tracks'>
          <h3>Search Results</h3>
          <ul className="track-list"> {
            tracks.map(track => (
              <Track track={track} key={track.id} isSearchList={true} handleClick={() => addTrackToPlaylist(track)} />
            ))
          } </ul>
        </section>

        <section className='playlist'>
          <Playlist playlist={playlist} setPlaylist={setPlaylist} setTracks={setTracks} spotify={spotify} />
          <ul className="playlist-list"> {
            playlist.map(track => (
              <Track track={track} key={track.id} isSearchList={false} handleClick={() => removeTrackFromPlaylist(track)} />
            ))
          } </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
