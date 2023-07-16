import React, {useEffect} from 'react';
import './resources/css/ErrorMessage.css';

export default function ErrorMessage({errorMessage, setErrorMessage}) {
	useEffect(() => {
		if(errorMessage) {
			setTimeout(() => {
				setErrorMessage('');
			}, 6000);
		}
	}, [errorMessage, setErrorMessage]);

	return <div className={"error-message " + (errorMessage ? "active" : '')}>
		<span>{errorMessage}</span>
		<button className="close-error" onClick={(e) => {setErrorMessage('')}}>X</button>
	</div>
}