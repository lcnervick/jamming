import './resources/css/App.css';
import React, {useState, useEffect, useCallback} from 'react';
import Search from './Search.js';
import Playlist from './Playlist.js';
import Track from './Track.js';
import Spotify from './Spotify.js';

import logo from './resources/images/spotify.png';
import jammmingLogo from './resources/images/Jammming-Logo.png';

const spotify = new Spotify();


////  TODOS  /////

// Add save feature for existing playlists and separate from create function
// Set for responsive;
// Setup package for relative paths

function App() {
  const [tracks, setTracks] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [playlists, setPlaylists] = useState([]);


  // PLAYLIST ID TRIGGERS
  const [playlistId, setPlaylistId] = useState(null);
  useEffect(() => {
    if(playlistId === null) { // Playlist List should show up for choosing
      console.log("Getting playlist list...");
      spotify.getPlaylists().then(spl => {
        setPlaylists(spl);
        setPlaylist([]);
        // also remove added class from the search results
        setTracks(prev => prev.map(t => ({...t, added: false})));
        console.log("Playlists:", playlists);
      });
    } else if(playlistId === 'new') {  // a playlist has been chosen or is being created
      setPlaylists([]);
      setPlaylist([]);
      console.log("Clearing Playlist...");
    } else {
      // If it's not new, show tracks in playlist
      spotify.getPlaylist(playlistId).then((thisPlaylist) => {
        setPlaylists([]);
        setPlaylist(thisPlaylist.tracks);
        console.log('Playlist Tracks: ', thisPlaylist.tracks)
      })
  
    }
    // eslint-disable-next-line
  }, [playlistId]);


  const searchForMusic = useCallback(async (query) => {
    const response = await spotify.search(query);
		setTracks(response);
  },[]);
  

  const addTrackToPlaylist = useCallback((track) => {
    if(playlistId === null) {
      setTimeout(() => {

      }, 3000)
      return;
    }
    // set 'added' class to track
    setTracks(prev => {
      for(const t of prev) if(t.id === track.id) t.added = true;
      return prev;
    });
    // add track to playlist container, eliminating duplicates
    setPlaylist(prev => {
      return [...prev.filter(t => t.id !== track.id), track];
    });
  },[playlistId]);


  const removeTrackFromPlaylist = useCallback((track) => {
    // remove 'added' class from search result
    setTracks(prev => {
      for(const t of prev) if(t.id === track.id) t.added = false;
      return prev;
    });
    // remove from the playlist list
    setPlaylist(prev => {
      return prev.filter(t => t.id !== track.id);
    });
  },[]);


  const savePlaylist = useCallback(async (title) => {
		if(!title) return;
		const response = await spotify.savePlaylist(title, playlistId, playlist);
    setPlaylistId(response.id);
		console.log("Save Playlist: ", response);
		// setPlaylist([]);
		// setTracks([]);
	},[playlist, playlistId]);


  return (
    <div className="App">
      <header className="App-header">
        <div></div>
        <img src={jammmingLogo} alt="jammming logo" className="jammming-logo" />
        <img src={logo} alt="Spotify Logo" className='spotify-logo' onClick={() => { console.log(playlists)}} />
      </header>
      <main>

        <section className="search">
          <Search setTracks={setTracks} onSearch={searchForMusic} />
        </section>

        <section className='tracks'>
          <h3>Search Results</h3>
          <ul className="track-list"> {
            tracks.map(track => (
              <Track track={track} key={track.id} isSearchList={true} addTrack={addTrackToPlaylist} />
            ))
          } </ul>
        </section>

        <section className='playlist'>
          <Playlist 
            playlists={playlists}
            playlist={playlist}
            playlistId={playlistId}
            setPlaylistId={setPlaylistId}
            removeTrack={removeTrackFromPlaylist}
            savePlaylist={savePlaylist} />
        </section>
      </main>
    </div>
  );
}

export default App;
