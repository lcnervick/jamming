import React, {useState, useEffect} from 'react';
import './resources/css/Track.css';

export function Track({track, handleClick, addOrRemove}) {
	return <li className='track-item'>
		<div className='track-title'>{track.title}</div>
		<div className='track-artist'>{track.artist}</div>
		<div className='track-add' onClick={handleClick}>{addOrRemove ? '+' : 'x'}</div>
	</li>
}