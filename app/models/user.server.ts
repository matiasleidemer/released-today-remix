import type { User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserByUid(uid: User["uid"]) {
  return prisma.user.findUnique({ where: { uid } });
}
