import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";

import { spotifyStrategy } from "~/services/auth.server";
import { userClient, SpotifyUserSchema } from "~/models/spotify.server";
import { getUserByUid } from "~/models/user.server";
import { signUpUser } from "~/services/signUpUser.server";

export async function loader({ request }: LoaderArgs) {
  const session = await spotifyStrategy.getSession(request);

  if (session === null) return null;

  try {
    const spotifyUser = SpotifyUserSchema.parse(session?.user);
    if (await getUserByUid(spotifyUser.id)) return redirect("/dashboard");

    await signUpUser(spotifyUser, userClient(session.accessToken));

    return redirect("/dashboard");
  } catch (error) {
    console.error(error);
    return null;
  }
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
