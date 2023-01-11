import { Authenticator } from "remix-auth";
import { SpotifyStrategy } from "remix-auth-spotify";
import invariant from "tiny-invariant";

import { sessionStorage } from "~/services/session.server";

invariant(process.env.SPOTIFY_CALLBACK_URL, "SPOTIFY_CALLBACK_URL must be set");
invariant(process.env.SPOTIFY_CLIENT_ID, "SPOTIFY_CLIENT_ID must be set");
invariant(
  process.env.SPOTIFY_CLIENT_SECRET,
  "SPOTIFY_CLIENT_SECRET must be set"
);

// See https://developer.spotify.com/documentation/general/guides/authorization/scopes
const scopes = [
  "user-read-email",
  "user-top-read",
  "user-read-private",
  "user-follow-read",
].join(" ");

export const spotifyStrategy = new SpotifyStrategy(
  {
    clientID: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    callbackURL: process.env.SPOTIFY_CALLBACK_URL,
    sessionStorage,
    scope: scopes,
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => ({
    accessToken,
    refreshToken,
    expiresAt: Date.now() + extraParams.expiresIn * 1000,
    tokenType: extraParams.tokenType,
    user: {
      id: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      image: profile.__json.images?.[0]?.url,
    },
  })
);

export const authenticator = new Authenticator(sessionStorage, {
  sessionKey: spotifyStrategy.sessionKey,
  sessionErrorKey: spotifyStrategy.sessionErrorKey,
});

authenticator.use(spotifyStrategy);
