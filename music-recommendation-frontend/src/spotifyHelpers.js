import axios from "axios";
import authHelpers from "./authHelpers";
import cosineSimilarity from "cosine-similarity";

const spotifyHelpers = {
  searchArtist: async function (val) {
    let code = authHelpers.getCookie();
    let artists = [];
    await axios({
      method: "GET",
      url: `https://api.spotify.com/v1/search?q=${val}&type=artist&limit=18`,
      headers: {
        Authorization: `Bearer ${code}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      json: true,
    }).then((res) => {
      artists = res.data.artists.items;
    });
    return artists;
  },

  searchTrack: async function (val) {
    let code = authHelpers.getCookie();
    let tracks = [];
    await axios({
      method: "GET",
      url: `https://api.spotify.com/v1/search?q=${val}&type=track&limit=24`,
      headers: {
        Authorization: `Bearer ${code}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      json: true,
    }).then((res) => {
      tracks = res.data.tracks.items;
    });
    return tracks;
  },

  getUserPlaylists: async function () {
    let code = authHelpers.getCookie();
    const response = await axios.get("https://api.spotify.com/v1/me/playlists", {
      headers: {
        Authorization: `Bearer ${code}`,
      },
    });
    return response.data.items;
  },

  getPlaylistTracks: async function (playlistId) {
    let code = authHelpers.getCookie();
    const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
        Authorization: `Bearer ${code}`,
      },
    });
    return response.data.items.map(item => item.track);
  },

  getAudioFeatures: async function (trackIds) {
    let code = authHelpers.getCookie();
    const response = await axios.get(`https://api.spotify.com/v1/audio-features?ids=${trackIds.join(',')}`, {
      headers: {
        Authorization: `Bearer ${code}`,
      },
    });
    return response.data.audio_features;
  },

  getTracksDetails: async function (trackIds) {
    let code = authHelpers.getCookie();
    const response = await axios.get(`https://api.spotify.com/v1/tracks?ids=${trackIds.join(',')}`, {
      headers: {
        Authorization: `Bearer ${code}`,
      },
    });
    return response.data.tracks;
  },

  generateRecommendations: async function (selectedTracks) {
    // Fetch audio features and track details for selected tracks
    const selectedAudioFeatures = await this.getAudioFeatures(selectedTracks);
    const selectedTracksDetails = await this.getTracksDetails(selectedTracks);

    // Create vectors for cosine similarity
    const selectedVectors = selectedAudioFeatures.map(track => ({
      id: track.id,
      vector: [
        track.acousticness,
        track.danceability,
        track.energy,
        track.instrumentalness,
        track.liveness,
        track.loudness,
        track.speechiness,
        track.valence,
        track.tempo,
      ],
    }));

    // Fetch audio features and track details for all tracks
    const allAudioFeatures = await this.getAudioFeatures(selectedTracks);
    const allTracksDetails = await this.getTracksDetails(selectedTracks);

    const allVectors = allAudioFeatures.map(track => ({
      id: track.id,
      vector: [
        track.acousticness,
        track.danceability,
        track.energy,
        track.instrumentalness,
        track.liveness,
        track.loudness,
        track.speechiness,
        track.valence,
        track.tempo,
      ],
    }));

    // Calculate cosine similarity and generate recommendations
    const recommendations = allVectors.map(track => {
      const similarity = Math.max(
        ...selectedVectors.map(selected => cosineSimilarity(selected.vector, track.vector))
      );
      const trackDetails = allTracksDetails.find(t => t.id === track.id);
      return { ...track, similarity, name: trackDetails.name };
    });

    // Sort and return top 10 recommendations
    return recommendations.sort((a, b) => b.similarity - a.similarity).slice(0, 10);
  },
};

export default spotifyHelpers;
