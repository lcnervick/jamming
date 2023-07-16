import React, {useCallback, useState} from 'react';
import Track from './Track.js';

import './resources/css/Playlist.css';



export default function Playlist({playlists, playlist, playlistId, setPlaylistId, removeTrack, savePlaylist}) {
	const [title, setTitle] = useState('');
	const handleTitleChange = (e => {
		setTitle(e.target.value);
	})

	const newPlaylist = useCallback(() => {
		setTitle('');
		setPlaylistId('new');
	    console.log("Creating New Playlist...");
	}, [setPlaylistId, setTitle]);

	const selectPlaylist = useCallback((item) => {
		setTitle(item.name);
		setPlaylistId(item.id);
		console.log("Selecting Playlist " + item.id + "...");
	  },[setPlaylistId, setTitle]);
	
	const cancelPlaylist = useCallback(() => {
		setTitle('');
		setPlaylistId(null);
		console.log("Cancelling Playlist Edit...");
	}, [setPlaylistId, setTitle]);


	const PlaylistName = () => {
		return <input id="playlist-name" className="playlist-name" type="text" placeholder="New Playlist Name" defaultValue={title} onBlur={handleTitleChange} />
	}
	
	const PlaylistItem = ({item}) => {
		return <li className='playlist-item' onClick={e => selectPlaylist(item)}>
			<div className='playlist-title'>{item.name}</div>
			<div className='playlist-tracks'>{item.totalTracks} Tracks</div>
			<button className='playlist-action'>::</button>
		</li>;
	}

	const Header = () => {
		if(playlistId) { // Show Tracks in Playlist
			return <>
				<PlaylistName />
				<button id="playlist-save" className='playlist-save' onClick={e => savePlaylist(title)}>Save</button>
				<button id="playlist-cancel" className='playlist-cancel' onClick={e => cancelPlaylist()}>Cancel</button>
			</>
		} else { // Show Playlist List
			return <>
				<h3>Your Playlists</h3>
				<button id="new-playlist" className="new-playlist" onClick={e => newPlaylist()}>+</button>
			</>
		}
	};

	const List = () => {
		if(playlistId) {
			return playlist.map(track => (<Track track={track} key={track.id} isSearchList={false} removeTrack={removeTrack} />));
		} else {
			return playlists.map(item => (<PlaylistItem key={item.id} item={item} />));
		}
	}


	return <>
		<div className='playlist-header'><Header /></div>
		<ul className='playlist-list'><List /></ul>
	</>

}


