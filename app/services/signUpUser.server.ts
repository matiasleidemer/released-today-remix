import { createUser, followArtist } from "~/models/user.server";
import { fetchTopArtists } from "~/models/spotify.server";
import { upsertArtist } from "~/models/artist.server";

import type { SpotifyUser, SpotifyUserClient } from "~/models/spotify.server";

export const signUpUser = async (
  user: SpotifyUser,
  client: SpotifyUserClient
) => {
  const newUser = await createUser(user);
  const topArtists = await fetchTopArtists(client);

  for (const artist of topArtists) {
    await followArtist(newUser, await upsertArtist(artist));
  }

  return newUser;
};
