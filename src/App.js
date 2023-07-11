import './resources/css/App.css';
import {SearchBar, SearchButton, ClearSearch, SearchResults} from './Search.js';

function App() {
  const clientID = 'b2359de28f42496482e8a5a0aaeb483f';
  const clientSecret = '02ad3ab661be483bae9ef48bad4d1b2e';

  return (
    <div className="App">
      <header className="App-header">
        <h1>Jamming!</h1>
        <h2>Spotify Playlist Manager</h2>
      </header>
      <main>
        <section className="search">
          <SearchBar />
          <SearchButton />
          <ClearSearch />
          <SearchResults />
        </section>
      </main>
    </div>
  );
}

export default App;
