import React, {useState, useEffect} from 'react';
import './resources/css/Track.css';

export function Track({track}) {
	return <li>
		<div className='track-title'>{track.title}</div>
		<div className='track-artist'>{track.artist}</div>
		<div className='track-add'>+</div>
	</li>
}