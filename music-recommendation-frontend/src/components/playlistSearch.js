import React, { Component, Fragment } from 'react';
import spotifyHelpers from '../spotifyHelpers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RecommendedTracks from './RecommendedTracks';

export default class PlaylistSearch extends Component {
  constructor() {
    super();
    this.state = {
      suggUpdated: false,
      selectedPlaylists: [],
      allTracks: [],
      recommendations: [],
      showRecommendations: false, // New state to manage page navigation
    };
    this.selection = [];
    this.playlistResultList = React.createRef();
  }

  scrollToElement = () =>
    this.playlistResultList.current.scrollIntoView(true, {
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    });

  handlePlaylistSelection = async (e, playlistId) => {
    let index = this.selection.indexOf(playlistId);
    if (index < 0 && this.selection.length < 3) {
      this.selection.push(playlistId);
      this.toggleSelected(e);
      this.setState({ suggUpdated: true, selectedPlaylists: [...this.selection] }, () => {
        this.printAllTracks();
      });
    } else if (index >= 0 && this.selection.length <= 3) {
      this.selection.splice(index, 1);
      this.toggleSelected(e);
      this.setState({ suggUpdated: true, selectedPlaylists: [...this.selection] }, () => {
        this.printAllTracks();
      });
    }
    if (this.selection.length <= 0) {
      this.clearCookie();
    }
    if (this.selection.length === 3) {
      toast.error('Reached maximum selection capacity!');
    }
  };

  toggleSelected = async (e) => {
    e.classList.toggle('selected');
  };

  clearCookie = async () => {
    document.cookie = 'selection=;max-age=0;samesite=lax;Secure';
  };

  printAllTracks = async () => {
    const { selectedPlaylists } = this.state;
    let allTracks = [];

    for (let playlistId of selectedPlaylists) {
      const tracks = await spotifyHelpers.getPlaylistTracks(playlistId);
      allTracks = [...allTracks, ...tracks];
    }

    const trackNames = allTracks.map(track => track.name);
    console.log('Track Names:', trackNames);
    this.setState({ allTracks: allTracks });
  };

  getRecommendations = async () => {
    const allTrackIds = this.state.allTracks.map(track => track.id);

    const recommendations = await spotifyHelpers.generateRecommendations(allTrackIds);
    const recommendedTracks = await spotifyHelpers.getTracksDetails(recommendations.map(r => r.id));
    this.setState({ recommendations: recommendedTracks, showRecommendations: true });
  };

  goBack = () => {
    this.setState({ showRecommendations: false });
  };

  render() {
    if (this.state.showRecommendations) {
      return <RecommendedTracks recommendations={this.state.recommendations} goBack={this.goBack} />;
    }

    return (
      <Fragment key="playlistSearch">
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          icon={false}
          pauseOnHover={false}
          pauseOnFocusLoss={false}
          theme="dark"
        />
        {this.selection.length > 0 ? (
          <div className="funcs">
            <button onClick={this.getRecommendations}>Recommend Tracks</button>
          </div>
        ) : null}
        <ul ref={this.playlistResultList} className='playlist-list'>
          {this.props.playlists.map((playlist) => (
            <Fragment key={playlist.id}>
              <li >
                <div className="playlist-results">
                  <div
                    className={`item ${this.selection.includes(playlist.id) ? 'selected' : ''}`}
                    onClick={(e) => this.handlePlaylistSelection(e.target, playlist.id)}
                  >
                    {playlist.images[0] ? (
                      <div className="art">
                        <img alt="playlist art" src={playlist.images[0].url}></img>
                      </div>
                    ) : null}
                    <p className="name">{playlist.name}</p>
                  </div>
                </div>
              </li>
            </Fragment>
          ))}
        </ul>

      </Fragment>
    );
  }
}
