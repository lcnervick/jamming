import React from 'react';
import './resources/css/Track.css';

export default function Track({track, addTrack, removeTrack, isSearchList}) {
	const buttonType = () => {
		if(isSearchList) return <button className='track-action' onClick={e => addTrack(track)}>+</button>;
		else return <button className='track-action' onClick={e => removeTrack(track)}>x</button>
	}

	return <li className={'track-item' + (isSearchList && track.added ? ' added' : '')} data-track-id={track.id}>
		<div className='track-title'>{track.title}</div>
		<div className='track-artist'>
			<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g> <path  d="M458.159,404.216c-18.93-33.65-49.934-71.764-100.409-93.431c-28.868,20.196-63.938,32.087-101.745,32.087 c-37.828,0-72.898-11.89-101.767-32.087c-50.474,21.667-81.479,59.782-100.398,93.431C28.731,448.848,48.417,512,91.842,512 c43.426,0,164.164,0,164.164,0s120.726,0,164.153,0C463.583,512,483.269,448.848,458.159,404.216z"></path> <path  d="M256.005,300.641c74.144,0,134.231-60.108,134.231-134.242v-32.158C390.236,60.108,330.149,0,256.005,0 c-74.155,0-134.252,60.108-134.252,134.242V166.4C121.753,240.533,181.851,300.641,256.005,300.641z"></path> </g></svg>
			{track.artist}
		</div>
		<div className='track-album'>
			<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" stroke="#ffffff"><g> <path  d="M425.706,86.294A240,240,0,0,0,86.294,425.706,240,240,0,0,0,425.706,86.294ZM256,464C141.309,464,48,370.691,48,256S141.309,48,256,48s208,93.309,208,208S370.691,464,256,464Z"></path> <path  d="M256,152A104,104,0,1,0,360,256,104.118,104.118,0,0,0,256,152Zm0,176a72,72,0,1,1,72-72A72.081,72.081,0,0,1,256,328Z"></path> <rect width="32" height="32" x="240" y="240" ></rect> <path  d="M256,112V80a174.144,174.144,0,0,0-79.968,19.178A177.573,177.573,0,0,0,115.2,150.39l25.586,19.219A142.923,142.923,0,0,1,256,112Z"></path> </g></svg>
			{track.album}</div>
		{buttonType()}
	</li>
}