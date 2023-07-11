import React, {useState, useEffect} from 'react';
import './resources/css/Search.css';


/**** SEARCH HANDLER ****/

export function searchForMusic() {
	let query = document.getElementById('search-bar').value;
}


/**** SEARCH BAR ****/

export function SearchBar() {
	const [text, setText] = useState({});
	const handleChange = ({target}) => {
		setText(target.value);
	};
	return <input type="text" id="search-bar" className="search-bar" onChange={handleChange} placeholder="Search for Music" />
}



/**** SEARCH BUTTON ****/

export function SearchButton() {
	const handleClick = ({target}) => {
		searchForMusic()
	};

	return <button id="search-button" className='search-button' onClick={handleClick}>
		Search
	</button>
}



/**** CLEAR SEARCH BUTTON ****/

export function ClearSearch() {
	const handleClick = ({target}) => {
		let searchBar = document.getElementById('search-bar');
		searchBar.value = '';
		searchBar.focus();
	};
	return <div className='search-clear' onClick={handleClick}>X</div>
}

export function SearchResults() {
	return <div id="search-results" className='search-results'>

	</div>
}
