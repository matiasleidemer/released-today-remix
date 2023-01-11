import type { LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import { spotifyStrategy } from "~/services/auth.server";

export async function loader({ request }: LoaderArgs) {
  return spotifyStrategy.getSession(request);
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const user = data?.user;

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Released.today</h1>
          <p className="py-6">
            Receive an email everytime there are new releases from your
            favourite artists.
          </p>
          {user ? (
            <>
              <p>You are logged in as: {user?.email}</p>
              <Form action="/logout" method="post" className="mt-4">
                <button className="btn btn-warning">Logout</button>
              </Form>
            </>
          ) : (
            <Form action="/auth/spotify" method="post">
              <button className="btn btn-primary">Sign in with Spotify</button>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}
