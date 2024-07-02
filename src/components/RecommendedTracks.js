import React, { Component, Fragment } from 'react';
import spotifyHelpers from '../spotifyHelpers';

export default class RecommendedTracks extends Component {
  render() {
    const { recommendations, goBack } = this.props;

    return (
      <Fragment key="recommendedTracks">
        <div className="funcs">
          <button className="goBack" onClick={goBack}>Go back</button>
          {/* <button onClick={(e) => spotifyHelpers.createPlaylist()}>
            Create a Playlist
          </button> */}
        </div>
        <div className="tracks-container">
          {recommendations.map((track) => (
            <Fragment key={track.id}>
              <div className="track-item">
                {track.album && track.album.images[0] ? (
                  <div className="track-art">
                    <img
                      alt="album art"
                      src={track.album.images[2].url}
                    ></img>
                  </div>
                ) : (
                  ''
                )}
                <p className="track-details">
                  <span className='track-name'>{track.name}</span>
                  <span className='track-artist'>
                    {track.artists.map(
                      (item, index) => (index ? ', ' : '') + item.name
                    )}
                  </span>
                </p>
              </div>
            </Fragment>
          ))}
        </div>
      </Fragment>
    );
  }
}
