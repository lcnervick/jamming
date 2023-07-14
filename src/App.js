import './resources/css/App.css';
import React, {useState, useEffect, useCallback} from 'react';
import Search from './Search.js';
import Playlist from './Playlist.js';
import Track from './Track.js';
import Spotify from './Spotify.js';

import logo from './resources/images/spotify.png';
import jammmingLogo from './resources/images/Jammming-Logo.png';

const spotify = new Spotify();

function App() {
  const [tracks, setTracks] = useState([]);

  const [playlists, setPlaylists] = useState([]);
  useEffect(() => {
    console.log('Setting Playlists: ', playlists);

  }, [playlists]);
  
  
  // PLAYLIST ID TRIGGERS
  const [playlistId, setPlaylistId] = useState(null);
  useEffect(() => {
    if(playlistId === null) { // Playlist List should show up for choosing
      console.log("Getting playlist list...");
      spotify.getPlaylists().then(spl => {
        setPlaylists(spl);
        console.log("Playlists:", playlists);
      });
    } else {  // a playlist has been chosen or is being created
      setPlaylists([]);
      // TODO - if it's not new, show tracks in playlist
    }
  }, [playlistId]);

  
  // PLAYLIST ID STATES
  const [playlist, setPlaylist] = useState([]);
  useEffect(() => {
    if(playlist.length && playlistId === null) setPlaylistId('new'); // show name setter for new playlist
    else if(!playlist.length && playlistId === 'new') setPlaylistId(null); // reset to playlist list
    console.log("Setting Playlist Id", playlistId)
  },[playlist]);


  const searchForMusic = useCallback(async (query) => {
    const response = await spotify.search(query);
		setTracks(response);
  },[]);
  

  const addTrackToPlaylist = useCallback((track) => {
    // set 'added' class to track
    setTracks(prev => {
      for(const t of prev) if(t.id === track.id) t.added = true;
      return prev;
    });

    // add track to playlist container, eliminating duplicates
    setPlaylist(prev => {
      return [...prev.filter(t => t.id !== track.id), track];
    });
  },[]);


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


  const selectPlaylist = useCallback((id) => {
    spotify.getPlaylist(id).then((thisPlaylist) => {
      setPlaylistId(thisPlaylist.id);
      setPlaylist(thisPlaylist.tracks);
      console.log('Playlist Tracks: ', thisPlaylist.tracks)
    })
    console.log("Selecting Playlist: ", id);
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
          <Playlist playlists={playlists} playlist={playlist} playlistId={playlistId} removeTrack={removeTrackFromPlaylist} choosePlaylist={selectPlaylist} savePlaylist={savePlaylist} />
        </section>
      </main>
    </div>
  );
}

export default App;
