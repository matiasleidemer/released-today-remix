import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import { spotifyStrategy } from "~/services/auth.server";

export async function loader({ request }: LoaderArgs) {
  const session = await spotifyStrategy.getSession(request);

  if (!session?.user) throw redirect("/");

  return session;
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const user = data?.user;

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Dashboard</h1>

          <p>Hello {user?.name}</p>
          <p>You are logged in as: {user?.email}</p>

          <Form action="/logout" method="post" className="mt-4">
            <button className="btn btn-warning">Logout</button>
          </Form>
        </div>
      </div>
    </div>
  );
}
