import React, {useState, useCallback} from 'react';
import Track from './Track.js';

import './resources/css/Playlist.css';

export default function Playlist({playlists, playlist, playlistId, setPlaylistId, removeTrack, savePlaylist}) {
	const[text, setText] = useState('');

	console.log("Playlist Repaint", playlist, playlistId);

	const newPlaylist = useCallback(() => {
		setPlaylistId('new');
	    console.log("Creating New Playlist...");
	}, [setPlaylistId]);

	const selectPlaylist = useCallback((id) => {
		setPlaylistId(id);
		console.log("Selecting Playlist " + id + "...");
	  },[setPlaylistId]);
	
	const cancelPlaylist = useCallback(() => {
		setPlaylistId(null);
		console.log("Cancelling Playlist Edit...");
	}, [setPlaylistId]);
	
	const Header = () => {
		if(playlistId) { // Show Tracks in Playlist
			return <>
				<input id="playlist-name" className="playlist-name" type="text" placeholder="New Playlist Name" value={text} onChange={({target}) => { setText(target.value) }} />
				<button id="playlist-save" className='playlist-save' onClick={e => savePlaylist(text)}>Save</button>
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

	const PlaylistItem = ({item}) => {
		return <li className='playlist-item' data-playlist-id={item.id} onClick={e => { selectPlaylist(item.id); setText(item.name); }}>
			<div className='playlist-title'>{item.name}</div>
			<div className='playlist-tracks'>{item.totalTracks} Tracks</div>
			<button className='playlist-action'>::</button>
		</li>;
	}


	return <>
		<div className='playlist-header'><Header /></div>
		<ul className='playlist-list'><List /></ul>
	</>

}
