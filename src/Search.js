import React, {useState, useEffect} from 'react';
import './resources/css/Search.css';


/**** SEARCH HANDLER ****/

/**** SEARCH BAR ****/

export function SearchBar() {
	const [text, setText] = useState({});
	const handleChange = ({target}) => {
		setText(target.value);
	};
	return <input type="text" id="search-bar" className="search-bar" onChange={handleChange} placeholder="Search for Music" />
}



/**** SEARCH BUTTON ****/

export function SearchButton({ handleClick }) {
	return <button id="search-button" className='search-button' onClick={handleClick}>
		Search
	</button>
}



/**** CLEAR SEARCH BUTTON ****/

export function ClearSearch({handleClick}) {
	return <div className='search-clear' onClick={handleClick}>X</div>
}

