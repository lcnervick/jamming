class Spotify {
	constructor() {
		this.clientId = 'b2359de28f42496482e8a5a0aaeb483f';
		this.clientSecret = '02ad3ab661be483bae9ef48bad4d1b2e';
		this.url = 'https://api.spotify.com/v1';

		this.accessToken = localStorage.getItem('access_token');
		this.userId = null;

		if(this.accessToken) {
			//uncomment the following line when refresh tokens are integrated into this app.
			// localStorage.removeItem('access_token');
			this.getUserInfo();
		} else {
			// look for oauth code and exchange the code for a token if so
			const code = new URLSearchParams(window.location.search).get('code');
			if(code) this.verifyCode(code);
			else this.requestAuthorization();
		}
		
	}

	async makeRequest(type, endpoint, opts = {}) {
		if(!this.accessToken) await this.requestAuthorization();

		let url = `${this.url}${endpoint}`;
		const reqOpts = {headers: { "Authorization": `Bearer ${this.accessToken}`}};

		if(type === 'GET') {
			const queryString = Object.keys(opts).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(opts[key])).join('&');
			if(queryString) url += "?"+queryString;
		}
		else if(type === 'POST') {
			reqOpts.method = type;
			reqOpts.body = JSON.stringify(opts);
			reqOpts.headers['Content-type'] = 'application/json';
		}

		try {
			const response = await fetch(url, reqOpts);
			const body = await response.json();
			if(response.ok) return body;
			else throw Error("Bad Request: " + body.error?.message ?? 'Unknown error');
		} catch(e) {
			console.log(e);
			return false;
		}
	}

	async getUserInfo() {
		const userInfo = await this.makeRequest('GET', '/me', {});
		this.userId = userInfo.id;
		console.log("User Info", userInfo);
		return userInfo;
	}

	async search(query) {
		console.log('Searching', query);
		if(!query) return [];

		const response = await this.makeRequest('GET', '/search', {q: query, type: "track"});
		console.log('Found Tracks', response);

		const tracks = [];
		for(const track of response?.tracks?.items ?? []) {
			const artists = [];
			for(const artist of track.artists) artists.push(artist.name);

			tracks.push({
				id: track.id,
				added: false,
				title: track.name,
				album: track.album.name,
				artist: artists.join(', ')
			});
		}
		return tracks;
	}

	async savePlaylist(name, tracks) {
		const newPlaylist = await this.makeRequest('POST', `/users/${this.userId}/playlists`, {name: name});
		if(newPlaylist) {
			const pid = newPlaylist.id;
			const addTracks = [];
			for(const track of tracks) addTracks.push('spotify:track:'+track.id);
			const tracksAdded = await this.makeRequest('POST', `/playlists/${pid}/tracks`, {uris: addTracks});
			if(tracksAdded) {
				return await this.makeRequest('GET', `/playlists/${pid}`);
			}
			console.log("Track playlist assignment failed");
			// TODO delete playlist
			return false;
		}
		console.log("Playlist creation failed");
		return false;
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
		const redirectUri = 'http://localhost:3000';
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

	async verifyCode(code) {
		const redirectUri = 'http://localhost:3000';
		const codeVerifier = localStorage.getItem('code_verifier');

		let body = new URLSearchParams({
			grant_type: 'authorization_code',
			code: code,
			redirect_uri: redirectUri,
			client_id: this.clientId,
			code_verifier: codeVerifier
		});

		console.log("Verification code: ", code);

		const response = fetch('https://accounts.spotify.com/api/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: body
		})
		.then(response => {
			if (!response.ok) {
				throw new Error('HTTP status ' + response.status);
			}
			return response.json();
		})
		.then(data => {
			localStorage.setItem('access_token', data.access_token);
			localStorage.removeItem('code_verifier');
			window.location = redirectUri;
		})
		.catch(error => {
			console.error('Error:', error);
		});
	}

	async getRefreshToken() {

	}
}

export default Spotify;