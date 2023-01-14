import type { User } from "@prisma/client";
import { z } from "zod";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export const SpotifyUser = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  image: z.string().url(),
});

export const getUserByUid = async (uid: User["uid"]) =>
  prisma.user.findUnique({ where: { uid } });

export const findOrCreateUserFromSpotify = async (
  spotifyUser: z.infer<typeof SpotifyUser>
) => {
  const user = await getUserByUid(spotifyUser.id);
  if (user) return user;

  return prisma.user.create({
    data: {
      email: spotifyUser.email,
      uid: spotifyUser.id,
      provider: "spotify",
    },
  });
};
