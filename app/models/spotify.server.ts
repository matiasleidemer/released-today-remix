import { Client, UserClient, TimeRange } from "spotify-api.js";
import { z } from "zod";

import type { Artist } from "spotify-api.js";

export const SpotifyUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  image: z.string().url(),
});

export type SpotifyUser = z.infer<typeof SpotifyUserSchema>;
export type SpotifyArtist = Artist;
export type SpotifyUserClient = UserClient;

export const userClient = (token: string) =>
  new UserClient(new Client({ token }));

export const fetchTopArtists = async (client: UserClient) => {
  const artists = new Array<Artist>();

  const addArtist = (newArtist: Artist) => {
    if (artists.find(({ id }) => id === newArtist.id)) return;

    artists.push(newArtist);
  };

  const spotifyArtists = await Promise.all([
    client.getTopArtists({ limit: 50, timeRange: TimeRange.Short }),
    client.getTopArtists({ limit: 50, timeRange: TimeRange.Medium }),
    client.getTopArtists({ limit: 50, timeRange: TimeRange.Long }),
  ]);

  spotifyArtists.flat().forEach((artist) => addArtist(artist));

  return artists;
};
