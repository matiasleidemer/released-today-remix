import { prisma } from "~/db.server";

import type { SpotifyArtist } from "~/models/spotify.server";

export const upsertArtist = (artist: SpotifyArtist) =>
  prisma.artist.upsert({
    where: { spotifyId: artist.id },
    update: {},
    create: {
      name: artist.name,
      spotifyId: artist.id,
      metadata: JSON.stringify(artist),
    },
  });
