import React, {useState, useEffect} from 'react';
import './resources/css/Search.css';

export default function Search({setTracks, spotify}) {
	const [text, setText] = useState('');
	const handleChange = ({target}) => { setText(target.value) };

	async function searchForMusic() {
		const response = await spotify.search(text);
		setTracks(response);
	}

	function clearSearchResults(e) {
		e.preventDefault();
		setText('');
		setTracks([]);
		document.getElementById('search-bar').focus();
	}
	
	return <form onSubmit={e => { e.preventDefault(); searchForMusic() }}>

	  <input type="text" id="search-bar" className="search-bar" placeholder="Search for Music" value={text} onChange={handleChange} />

	  <button className='search-clear' onClick={clearSearchResults} type="button">X</button>

	  <button id="search-button" className='search-button' type="submit">Search</button>

	</form>

}	
