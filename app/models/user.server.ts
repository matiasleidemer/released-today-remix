import { prisma } from "~/db.server";

import type { User, Artist } from "@prisma/client";
import type { SpotifyUser } from "./spotify.server";

export type { User } from "@prisma/client";

export const createUser = (user: SpotifyUser) =>
  prisma.user.create({
    data: {
      name: user.name,
      email: user.email,
      uid: user.id,
      provider: "spotify",
      metadata: JSON.stringify(user),
    },
  });

export const getUserByUid = async (uid: User["uid"]) =>
  prisma.user.findUnique({ where: { uid } });

export const followArtist = async (user: User, artist: Artist) => {
  await prisma.user.update({
    where: { id: user.id },
    data: { artists: { connect: { id: artist.id } } },
  });
};
