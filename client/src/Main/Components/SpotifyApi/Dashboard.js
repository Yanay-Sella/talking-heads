import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuthSpotify";
import SpotifyWebApi from "spotify-web-api-node";
import TrackSearchResult from "./TrackSearchResult";
import Player from "./Player";

let spotifyApi;
try {
  spotifyApi = new SpotifyWebApi({
    clientId: "d679667fbb3e4d9e92688887dd7e6db3",
  });
} catch {
  console.error();
}

const Dashboard = () => {
  const accessToken = useAuth();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();

  const chooseTrack = (track) => {
    setPlayingTrack(track);
    setSearch("");
  };

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;

    let cancel = false;
    spotifyApi.searchTracks(search).then((res) => {
      if (cancel) return;

      setSearchResults(
        res.body.tracks.items.map((track) => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image;
              return smallest;
            },
            track.album.images[0]
          );
          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
          };
        })
      );
    });

    return () => (cancel = true);
  }, [search, accessToken]);

  return (
    <div className="flex p-2 h-max flex-col w-[25rem]">
      <form
        action=""
        className="w-full"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <input
          className="w-full"
          type="serach"
          placeholder="Search Songs/Artists"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </form>
      <div className="flex flex-col flex-grow m-2 overflow-y-auto">
        {searchResults.map((track) => (
          <TrackSearchResult
            track={track}
            key={track.uri}
            chooseTrack={chooseTrack}
          />
        ))}
      </div>

      <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
    </div>
  );
};

export default Dashboard;
