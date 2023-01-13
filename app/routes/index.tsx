import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { z } from "zod";

import { prisma } from "~/db.server";
import { getUserByUid } from "~/models/user.server";
import { spotifyStrategy } from "~/services/auth.server";

const SpotifyUser = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  image: z.string().url(),
});

export async function loader({ request }: LoaderArgs) {
  const session = await spotifyStrategy.getSession(request);

  const parsedSession = SpotifyUser.safeParse(session?.user);
  if (!parsedSession.success) return session;

  const spotifyUser = parsedSession.data;

  if (await getUserByUid(spotifyUser.id)) return redirect("/dashboard");

  await prisma.user.create({
    data: {
      email: spotifyUser.email,
      uid: spotifyUser.id,
      provider: "spotify",
    },
  });

  return redirect("/dashboard");
}

export default function Index() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Released.today</h1>
          <p className="py-6">
            Receive an email everytime there are new releases from your
            favourite artists.
          </p>
          <Form action="/auth/spotify" method="post">
            <button className="btn btn-primary">Sign in with Spotify</button>
          </Form>
        </div>
      </div>
    </div>
  );
}
