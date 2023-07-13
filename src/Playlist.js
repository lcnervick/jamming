import React, {useState, useEffect} from 'react';
import './resources/css/Playlist.css';

export default function Playlist({playlist, setPlaylist, setTracks, spotify}) {
	const[text, setText] = useState('');

	async function savePlaylist(e) {
		if(!text) return;
		const response = await spotify.savePlaylist(text, playlist);
		console.log("Save Playlist: ", response);
		setPlaylist([]);
		setTracks([]);
	}

	return <div className='playlist-header'>
		<input type="text" id="playlist-name" className="playlist-name" placeholder="Playlist Name" value={text} onChange={({target}) => { setText(target.value) }} />
		<button className='playlist-save' id="playlist-save" onClick={savePlaylist}>Save</button>
	</div>

}
