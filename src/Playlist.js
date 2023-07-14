import React, {useState} from 'react';
import Track from './Track.js';

import './resources/css/Playlist.css';

export default function Playlist({playlists, playlist, removeTrack, playlistId, choosePlaylist, savePlaylist}) {
	const[text, setText] = useState('');

	console.log("Playlist Repaint", playlist, playlistId);
	
	const Header = () => {
		if(playlistId) { // Show Tracks in Playlist
			return <>
				<input id="playlist-name" className="playlist-name" type="text" placeholder="New Playlist Name" value={text} onChange={({target}) => { setText(target.value) }} />
				<button id="playlist-save" className='playlist-save' onClick={e => savePlaylist(text)}>Save</button>
			</>
		} else { // Show Playlist List
			return <h3>Your Playlists</h3>
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
		return <li className='playlist-item' data-playlist-id={item.id} onClick={e => { choosePlaylist(item.id); setText(item.name); }}>
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
