import React, { Fragment } from 'react';
import spotifyHelpers from '../spotifyHelpers';

export default class Tracks extends React.Component {
  state = {
    loading: true,
  };

  async componentDidMount() {
    this.setState({ loading: false });
  }

  render() {
    const { recommendations } = this.props;

    if (recommendations) {
      return (
        <div className="results">
          <div className="funcs">
            <button onClick={this.props.goBack}>Go back</button>
            <button onClick={(e) => spotifyHelpers.createPlaylist()}>Create a Playlist</button>
          </div>
          <div className="tracks">
            <ul>
              {recommendations.map((track, index) => (
                <Fragment key={index}>
                  <li className="track-info">
                    <div className="name">
                      <span>{track.name}</span>
                    </div>
                  </li>
                </Fragment>
              ))}
            </ul>
          </div>
          <div className="funcs">
            <button onClick={this.props.goBack}>Go back</button>
            <button onClick={(e) => spotifyHelpers.createPlaylist()}>Create a Playlist</button>
          </div>
        </div>
      );
    } else if (this.state.loading) {
      return (
        <div className="results">
          <div className="state">Loading...</div>
        </div>
      );
    } else {
      return null;
    }
  }
}
