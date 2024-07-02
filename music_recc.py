import sys
import json
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from spotipy.oauth2 import SpotifyOAuth
import spotipy.util as util
from skimage import io
import matplotlib.pyplot as plt
import pandas as pd
from datetime import datetime
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity

def create_features(df, numerical_columns):
    numerical_columns = df[numerical_columns].reset_index(drop=True)
    df_numeric = numerical_columns
    scaler = MinMaxScaler()
    scaled_features = scaler.fit_transform(df_numeric)
    df_numeric = pd.DataFrame(scaled_features, columns=numerical_columns.columns)
    final = pd.concat([df_numeric], axis=1)
    final['track_id'] = df['track_id'].values
    return final

def gen_playlists(playlist_name, id_dic, data):
    playlist = pd.DataFrame()
    for i, j in enumerate(sp.playlist(id_dic[playlist_name])['tracks']['items']):
        playlist.loc[i, 'artist'] = j['track']['artists'][0]['name']
        playlist.loc[i, 'track_name'] = j['track']['name']
        playlist.loc[i, 'track_id'] = j['track']['id']
        playlist.loc[i, 'url'] = j['track']['album']['images'][1]['url']
        playlist.loc[i, 'date_added'] = j['added_at']
    playlist['date_added'] = pd.to_datetime(playlist['date_added'])
    playlist = playlist[playlist['track_id'].isin(data['track_id'].values)].sort_values('date_added', ascending=False)
    return playlist

def generate_playlist_vector(spotify_features, playlist_df, weight_factor):
    spotify_features_playlist = spotify_features[spotify_features['track_id'].isin(playlist_df['track_id'].values)]
    spotify_features_playlist = spotify_features_playlist.merge(playlist_df[['track_id', 'date_added']], on='track_id', how='inner')
    spotify_features_nonplaylist = spotify_features[~spotify_features['track_id'].isin(playlist_df['track_id'].values)]
    playlist_feature_set = spotify_features_playlist.sort_values('date_added', ascending=False)
    most_recent_date = playlist_feature_set.iloc[0, -1]
    for ix, row in playlist_feature_set.iterrows():
        playlist_feature_set.loc[ix, 'days_from_recent'] = int((most_recent_date.to_pydatetime() - row.iloc[-1].to_pydatetime()).days)
    playlist_feature_set['weight'] = playlist_feature_set['days_from_recent'].apply(lambda x: weight_factor ** (-x))
    playlist_feature_set_weighted = playlist_feature_set.copy()
    playlist_feature_set_weighted.update(playlist_feature_set_weighted.iloc[:, :-3].mul(playlist_feature_set_weighted.weight.astype(int), 0))
    playlist_feature_set_weighted_final = playlist_feature_set_weighted.iloc[:, :-3]
    return playlist_feature_set_weighted_final.sum(axis=0), spotify_features_nonplaylist

def generate_recommendation(spotify_data, playlist_vector, nonplaylist_df):
    non_playlist = spotify_data[spotify_data['track_id'].isin(nonplaylist_df['track_id'].values)]
    non_playlist = non_playlist.copy()
    non_playlist['sim'] = cosine_similarity(nonplaylist_df.drop(['track_id'], axis=1).values, playlist_vector.drop(labels='track_id').values.reshape(1, -1))[:, 0]
    non_playlist_top15 = non_playlist.sort_values('sim', ascending=False).head(15)
    non_playlist_top15['url'] = non_playlist_top15['track_id'].apply(lambda x: sp.track(x)['album']['images'][1]['url'])
    return non_playlist_top15.drop_duplicates(subset=['track_name'])

if __name__ == "__main__":
    playlist_name = sys.argv[1]
    client_id = '2e3991f3876640a993a7599c64474248'
    client_secret = '237650bcc80b4f5fba005aa6e4f89fea'
    scope = 'user-library-read'
    token = util.prompt_for_user_token(
        scope,
        client_id=client_id,
        client_secret=client_secret,
        redirect_uri='http://localhost:8881/callback/'
    )
    sp = spotipy.Spotify(auth=token)

    df = pd.read_csv('./SpotifyFeatures.csv')
    df = df.drop(['popularity', 'key', 'mode', 'time_signature', 'duration_ms', 'artist_name'], axis=1)
    numerical_columns = [col for col in df.columns if df[col].dtype != 'object']
    complete_feature_set = create_features(df, numerical_columns)

    playlist_dic = {}
    for i in sp.current_user_playlists()['items']:
        playlist_dic[i['name']] = i['uri'].split(':')[2]

    playlist_df = gen_playlists(playlist_name, playlist_dic, df)
    playlist_vector, nonplaylist_df = generate_playlist_vector(complete_feature_set, playlist_df, 1.2)
    recommendations = generate_recommendation(df, playlist_vector, nonplaylist_df)
    print(recommendations[['track_name', 'artist', 'url']].to_json(orient='records'))
