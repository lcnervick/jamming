class Spotify {
	constructor() {
		this.clientId = 'b2359de28f42496482e8a5a0aaeb483f';
		this.url = 'https://api.spotify.com/v1';
		this.location = window.location.href.match(/localhost/) ? 'http://localhost:3000' : 'http://www.leifnervick.com/projects/jamming';
		this._accessToken = null;
		this._userId = null;
		this._playlists = [];
		
		this._loadingStatus = document.createElement('div');
		document.body.appendChild(this._loadingStatus).classList.add("spotify-loader")
		this._loadingStatus.innerHTML = 'Loading...';

		// Oauth Processes
		if(localStorage.getItem('access_token')) {
			// this happens when the code is verified and refreshed
			// store the access token for it's initial use and move on
			this.accessToken = localStorage.getItem('access_token');
			this.init();
		} else {
			// look for oauth code and exchange the code for a token if so
			const code = new URLSearchParams(window.location.search).get('code');
			if(code) this.verifyCode(code);
			// if there is a refresh token stored, use it to get a new access token
			else if(localStorage.getItem('refresh_token')) this.getNewAccessToken();
			// otherwise, go through the login process again
			else this.requestAuthorization();
		}
	}

	/***** GETTERS  ******/

	get accessToken() {
		if(!this._accessToken) {
			this.requestAuthorization();
			return null;
		} else return this._accessToken;
	}

	get userId() {
		if(!this._userId) throw Error("Spotify was not initialized properly. Please refresh and try again.");
		else return this._userId;
	}

	get playlists() {
		return this._playlists;
	}

	/*****  SETTERS  *****/

	set accessToken(data) {
		this._accessToken = data;
	}

	set userId(data) {
		this._userId = data;
	}

	set playlists(data) {
		this._playlists = data || [];
	}

	/*****  INIT  *****/
	
	async init() {
		const userInfo = await this.getUserInfo();
		if(userInfo) {
			this.userId = userInfo.id;
			localStorage.removeItem('access_token');
		} else throw Error("Could not get user information");
	}
	
	// checks to see if the user info has been initialized yet. Times out after 5 seconds.
	checkInit() {
		return new Promise((ok, notok) => {
			const timer = setInterval(() => {
				if(this._userId) {
					clearInterval(timer);
					clearTimeout(timeout);
					ok("Spotify is initialized properly.");
				}
			}, 10);
			const timeout = setTimeout(() => {
				clearInterval(timer);
				notok("Operation Timed Out: Spotify did not initialize properly.");
			}, 5000);
		})
	}
	
	
	/*****  FUNCTIONS  *****/


	async getUserInfo() {
		return await this.makeRequest('GET', '/me', {});
	}

	buildTracks(tracks) {
		const returnTracks = [];
		for(const track of tracks) {
			const artists = [];
			for(const artist of track.artists) artists.push(artist.name);
			returnTracks.push({
				id: track.id,
				added: false,
				title: track.name,
				album: track.album.name,
				artist: artists.join(', ')
			});
		}
		return returnTracks;

	}

	async search(query) {
		console.log('Searching', query);
		if(!query) return [];
		try {
			const response = await this.makeRequest('GET', '/search', {q: query, type: "track"});
			console.log('Found Tracks', response);
			const tracks = this.buildTracks(response?.tracks?.items ?? []);
			return tracks;
		} catch(e) {
			console.log("Could not search for "+query);
			return false;
		}
	}

	async getPlaylist(id) {
		try {
			const playlist = await this.makeRequest('GET', `/playlists/${id}`);
			if(playlist) {
				const tracks = [];
				for(const track of playlist.tracks.items) tracks.push(track.track);
				console.log("Got Playlist", tracks);
				return {
					id: playlist.id,
					name: playlist.name,
					description: playlist.description,
					totalTracks: playlist.tracks.total,
					tracks: this.buildTracks(tracks)
				}
			}
			throw Error("Could Not Get Playlist"); 
		} catch(e) {
			console.log(e);
			return false;
		}
	}

	getPlaylists() {
		// must be a promise because it is being called from outside an async function
		return new Promise((resolve, reject) => {
			this.checkInit()
			.then(() => {
				this.makeRequest('GET', `/users/${this.userId}/playlists`,{limit: 50})
				.then(playlists => {
					if(playlists) {
						const playlistList = [];
						playlists.items.forEach(playlist => {
							playlistList.push({
								id: playlist.id,
								name: playlist.name,
								description: playlist.description,
								totalTracks: playlist.tracks.total,
							})
						});
						this.playlists = playlistList;
						resolve(playlistList);
					} else reject("Could not fetch playlists")
				});
			})
			.catch(error => {
				reject(error);
			})
		})
	}

	async savePlaylist(name, id, tracks) {
		this._loadingStatus.innerHTML = 'Saving...';
		try {
			await this.checkInit();
			let thisPlaylist = null;

			if(id === 'new') {
				// make new playlist
				thisPlaylist = await this.makeRequest('POST', `/users/${this.userId}/playlists`, {name: name});
			} else {
				// update playlist name
				thisPlaylist = await this.makeRequest('PUT', `/playlists/${id}`, {name: name});
				thisPlaylist = await this.makeRequest('GET', `/playlists/${id}`);
			}
			if(thisPlaylist) {
				const addTracks = [];
				for(const track of tracks) addTracks.push('spotify:track:'+track.id);
				const tracksAdded = await this.makeRequest(id === 'new' ? 'POST' : 'PUT', `/playlists/${thisPlaylist.id}/tracks`, {uris: addTracks});
				if(tracksAdded) {
					return await this.makeRequest('GET', `/playlists/${thisPlaylist.id}`);
				}
				throw Error("Could not add tracks to playlist");
			}
			this._loadingStatus.innerHTML = 'Saving...';
			throw Error("Could not create or update playlist");
		} catch(e) {
			console.log(e);
			this._loadingStatus.innerHTML = 'Loading...';
			return false;
		}
	}



	/**
	 * Used to handle the REST API Requests for Spotify and return parsed info or handle errors
	 * @param {string} type 'GET', 'POST', etc
	 * @param {string} endpoint the endpoint to request data from
	 * @param {object} opts Optional for GET requests. Data gets parsed into a query string for POST requests
	 * @returns object | bool	Returns a parsed response body or false on failure
	 */

	async makeRequest(type, endpoint, opts = {}) {
		let url = `${this.url}${endpoint}`;
		const reqOpts = {
			method: type,
			headers: { "Authorization": `Bearer ${this.accessToken}`}
		};

		if(type === 'GET') {
			const queryString = Object.keys(opts).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(opts[key])).join('&');
			if(queryString) url += "?"+queryString;
		}
		else {
			reqOpts.body = JSON.stringify(opts);
			reqOpts.headers['Content-type'] = 'application/json';
		}

		this._loadingStatus.classList.add('active');

		try {
			const response = await fetch(url, reqOpts);
			let body;
			try {
				body = await response.json();
			} catch(e) {
				if(response.status === 201) return {};
			}

			this._loadingStatus.classList.remove('active');

			if(response.ok) return body;
			else {
				if(body.error?.message === "The access token expired") {
					localStorage.removeItem('access_token');
					this.requestAuthorization();
				}
				throw Error("Bad Request: " + body.error?.message ?? 'Unknown error');
			}
		} catch(e) {
			console.log(e);
			this._loadingStatus.classList.remove('active');
			return false;
		}
	}


	/*********  OAUTH PROCESSES  *******************/

	generateRandomString(length) {
		let text = '';
		let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	  
		for (let i = 0; i < length; i++) {
		  text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}

	async generateCodeChallenge(codeVerifier) {
		function base64encode(string) {
		  return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
			.replace(/\+/g, '-')
			.replace(/\//g, '_')
			.replace(/=+$/, '');
		}
		const encoder = new TextEncoder();
		const data = encoder.encode(codeVerifier);
		const digest = await window.crypto.subtle.digest('SHA-256', data);
		return base64encode(digest);
	}

	async requestAuthorization() {
		const redirectUri = this.location;
		const codeVerifier = this.generateRandomString(128);

		this.generateCodeChallenge(codeVerifier).then(codeChallenge => {
			let state = this.generateRandomString(16);
			let scope = 'user-read-private user-read-email playlist-read-private playlist-read-private playlist-modify-public playlist-modify-private';

			localStorage.setItem('code_verifier', codeVerifier);

			let args = new URLSearchParams({
				response_type: 'code',
				client_id: this.clientId,
				scope: scope,
				redirect_uri: redirectUri,
				state: state,
				code_challenge_method: 'S256',
				code_challenge: codeChallenge
			});

			window.location = 'https://accounts.spotify.com/authorize?' + args;
		});
	}

	async callAuthEndpoint(body, callback) {
		fetch('https://accounts.spotify.com/api/token', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams(body)
		})
		.then(response => {
			if(response.ok) return response.json();
			else throw new Error('HTTP status ' + response.status);
		}).then(data => {
			// need to use callback because of the chained promises
			localStorage.removeItem('code_verifier');
			// always set the refresh token
			localStorage.setItem('refresh_token', data.refresh_token);
			callback(data);
		})
		.catch(error => {
			console.error('Error:', error);
			localStorage.removeItem('code_verifier');
			localStorage.removeItem('refresh_token');
			localStorage.removeItem('access_token');
			this.requestAuthorization();
		});
	}


	async verifyCode(code) {
		this.callAuthEndpoint({
			grant_type: 'authorization_code',
			code: code,
			redirect_uri: this.location,
			client_id: this.clientId,
			code_verifier: localStorage.getItem('code_verifier')
		}, data => {
			// set access token in storage and refresh the page to initiate the initial session
			// localStorage.setItem('access_token', data.access_token);
			window.location = this.location;
		});
	}

	async getNewAccessToken() {
		this.callAuthEndpoint({
			grant_type: 'refresh_token',
			refresh_token: localStorage.getItem('refresh_token'),
			client_id: this.clientId
		}, data => {
			// set access token for use in this session and remove it from storage
			this.accessToken = data.access_token;
			this.init();
		});
	}
}

export default Spotify;