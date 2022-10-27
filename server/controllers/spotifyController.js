const SpotifyWebApi = require("spotify-web-api-node");

const refresh = async (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: "http://localhost:3000/main/1",
    clientId: "d679667fbb3e4d9e92688887dd7e6db3",
    clientSecret: "537dc11b712848d9af1ea90c27794e3f",
    refreshToken,
  });
  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      res.json({
        accessToken: data.body.accessToken,
        expiresIn: data.body.expiresIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
};

let currentCode;
let accessToken;
let refreshToken;
let expiresIn;

const login = async (req, res) => {
  const code = req.body.code;

  if (code === currentCode)
    return res.status(405).json({ accessToken, refreshToken, expiresIn });

  console.log(currentCode === code);
  currentCode = code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: "http://localhost:3000/main/1",
    clientId: "d679667fbb3e4d9e92688887dd7e6db3",
    clientSecret: "537dc11b712848d9af1ea90c27794e3f",
  });

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      accessToken = data.body.access_token;
      refreshToken = data.body.refresh_token;
      expiresIn = data.body.expires_in;
      res.json({
        accessToken,
        refreshToken,
        expiresIn,
      });
    })
    .catch((err) => {
      res.status(400).json({ err });
    });
};

exports.refresh = refresh;
exports.login = login;
