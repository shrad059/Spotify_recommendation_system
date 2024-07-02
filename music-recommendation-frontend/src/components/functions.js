import React, { Fragment } from 'react';
import spotifyHelpers from '../spotifyHelpers';
import ArtistSearch from './ArtistSearch';
import TrackSearch from './TrackSearch';
import Loading from './Loading';
import PlaylistSearch from './PlaylistSearch'; // Import PlaylistSearch component

export default class Functions extends React.Component {
  constructor() {
    super();
    this.state = {
      artistsUpdated: false,
      tracksUpdated: false,
      clearResults: false,
      inputsEmpty: true,
      loading: false,
      playlists: [],
    };
    this.timer = null;

    this.artistInput = React.createRef();
    this.trackInput = React.createRef();
  }

  handleArtistInput = (e) => {
    const value = e.target.value;
    this.setState({ loading: true });
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.handleArtist(value);
      this.setState({
        clearResults: false,
        inputsEmpty: !value,
        loading: false,
      });
    }, 1000);
  };

  handleTrackInput = (e) => {
    const value = e.target.value;
    this.setState({ loading: true });
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.handleTrack(value);
      this.setState({
        clearResults: false,
        inputsEmpty: !value,
        loading: false,
      });
    }, 1000);
  };

  handleArtist = async (value) => {
    this.setState({ tracksUpdated: false });
    if (!value) return;

    this.setState({ artistsUpdated: true });
    this.setState({ loading: false });

    const artists = await spotifyHelpers.searchArtist(value);
    this.setState({ artists });
  };

  handleTrack = async (value) => {
    this.setState({ artistsUpdated: false });
    if (!value) return;

    this.setState({ tracksUpdated: true });
    this.setState({ loading: false });

    const tracks = await spotifyHelpers.searchTrack(value);
    this.setState({ tracks });
  };

  fetchPlaylists = async () => {
    try {
      const playlists = await spotifyHelpers.getUserPlaylists();
      this.setState({ playlists });
    } catch (error) {
      console.error('Error fetching playlists:', error);
      // Optionally handle the error (e.g., show a message to the user)
    }
  };

  componentDidMount() {
    this.fetchPlaylists();
  }

  fetchTopTracks = async (time_range) => {
    try {
      this.setState({ loading: true });
      await spotifyHelpers.databyTopTracks(time_range);
      this.setState({ loading: false });
    } catch (error) {
      console.error('Error fetching top tracks:', error);
      this.setState({ loading: false });
      // Optionally handle the error (e.g., show a message to the user)
    }
  };

  render() {
    return (
      <div className="results">
        {/* <div className="top-buttons">
          {this.state.inputsEmpty && (
            <Fragment>
              <button onClick={() => Functions.getbyArtists('medium_term')}>
                Explore by Recent Top Artists
              </button>
              <button onClick={() => Functions.getbyTracks('medium_term')}>
                Explore by Recent Top Tracks
              </button>
            </Fragment>
          )}
        </div> */}

        {/* <div className="funcs">
          <input
            onChange={this.handleArtistInput}
            placeholder="Pick at most 5 artists..."
            ref={this.artistInput}
          />
          {this.state.loading ? <Loading /> : <span>OR</span>}
          <input
            onChange={this.handleTrackInput}
            placeholder="Pick at most 5 tracks..."
            ref={this.trackInput}
          />
        </div> */}

        {/* {!this.state.clearResults && ( */}
          <Fragment>
            {/* {this.state.artistsUpdated && (
              <div className="search-container">
                <ArtistSearch artists={this.state.artists} />
              </div>
            )}
            {this.state.tracksUpdated && (
              <div className="search-container">
                <TrackSearch tracks={this.state.tracks} />
              </div>
            )} */}

            {/* Render PlaylistSearch component */}
            <PlaylistSearch playlists={this.state.playlists} />
          </Fragment>
        {/* )} */}
      </div>
    );
  }
}

Functions.getbyArtists = (range) => {
  spotifyHelpers.databyAllTimeTopArtists(range);
};

Functions.getbyTracks = (range) => {
  spotifyHelpers.databyAllTimeTopTracks(range);
};
