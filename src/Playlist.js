import React, {useState, useEffect} from 'react';
import './resources/css/Playlist.css';

export function PlaylistName() {
	return <input id="playlist-name" className="playlist-name" placeholder="Playlist Name" />
}

export function PlaylistSave() {
	return <button className='playlist-save' id="playlist-save">Save</button>
}