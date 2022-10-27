import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Tooltip } from "@mui/material";
import Logo from "../../Media/NameChatLogo4.png";
import ProfileMenu from "./ProfileMenu/ProfileMenu";
import { UserContext } from "../../../contexts/UserContextProvider";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import Dashboard from "../SpotifyApi/Dashboard";
import MusicMenu from "./MusicMenu/MusicMenu";
import { useEffect } from "react";
import { useRef } from "react";

const NavBar = () => {
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const [anchorElMusic, setAnchorElMusic] = useState(null);
  const [spotifyCode, setSpotifyCode] = useState(null);

  const musicRef = useRef();

  const openMenuProfile = Boolean(anchorElProfile);
  const openMenuMusic = Boolean(anchorElMusic);

  const { darkMode } = useContext(UserContext);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("spotifyCode"));
    console.log(storedData);

    if (!storedData) {
      setSpotifyCode(new URLSearchParams(window.location.search).get("code"));
      return;
    }
    if (spotifyCode) return;
    setSpotifyCode(storedData);
    return () => localStorage.removeItem("spotifyCode");
  }, []);

  useEffect(() => {
    if (!spotifyCode) return;

    localStorage.setItem("spotifyCode", JSON.stringify(spotifyCode));
  }, [spotifyCode]);

  return (
    <nav
      className={`w-full h-13 flex items-center shadow-md border-b-black border-solid px-6 py-2 text-3xl ${
        darkMode ? "bg-[#090909]" : "bg-thirdy"
      } `}
    >
      <Link to="/">
        <span className="flex items-center justify-center gap-2 text-white font-bold">
          <img src={Logo} alt="Name logo" className="w-12" />
          <p className=""> Name Chat </p>
        </span>
      </Link>
      <div className="flex justify-center items-center ml-auto gap-4">
        {spotifyCode ? (
          <Tooltip
            title="Play Music"
            className="text-white hover:text-gray-200"
          >
            <button
              className={`text-[#1DB954] hover:text-[#1a9c47] flex items-center justify-center `}
              onClick={(e) => {
                setAnchorElMusic(e.currentTarget);
              }}
              id="music-button"
              aria-controls={openMenuMusic ? "music-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openMenuMusic ? "true" : undefined}
              ref={musicRef}
            >
              <HeadphonesIcon fontSize="large" />
            </button>
          </Tooltip>
        ) : (
          <Tooltip
            title="Login To Spotify"
            className="text-white hover:text-gray-200"
          >
            <a
              href="https://accounts.spotify.com/authorize?client_id=d679667fbb3e4d9e92688887dd7e6db3&response_type=code&redirect_uri=http://localhost:3000/main/1&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"
              className="flex items-center justify-center"
              ref={musicRef}
            >
              <HeadphonesIcon fontSize="large" />
            </a>
          </Tooltip>
        )}

        <Tooltip title="Your Profile">
          <button
            className={`flex  items-center w-min text-white hover:text-gray-200 `}
            onClick={(e) => {
              setAnchorElProfile(e.currentTarget);
            }}
            id="profile-button"
            aria-controls={openMenuProfile ? "profile-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openMenuProfile ? "true" : undefined}
          >
            <AccountCircleIcon sx={{ color: "inherit" }} fontSize="large" />
            <ArrowDropDownIcon sx={{ color: "inherit" }} />
          </button>
        </Tooltip>
        <ProfileMenu
          setAnchorEl={setAnchorElProfile}
          anchorEl={anchorElProfile}
          openMenu={openMenuProfile}
        />
        <MusicMenu
          setAnchorEl={setAnchorElMusic}
          anchorEl={anchorElMusic}
          openMenu={openMenuMusic}
          code={spotifyCode}
          musicRef={musicRef}
        />
      </div>
    </nav>
  );
};

export default NavBar;
