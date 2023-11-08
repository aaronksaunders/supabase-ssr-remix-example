import { redirect } from "@remix-run/node";
import type {
  LoaderFunctionArgs,
  ActionFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import {
  parse,
  createServerClient,
  serialize,
  createBrowserClient,
} from "@supabase/ssr";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

//
// LOADER FUNCTION
// -----------------------------------------------------------------------------
export async function loader({ request }: LoaderFunctionArgs) {
  const cookies = parse(request.headers.get("Cookie") ?? "");
  const headers = new Headers();

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(key) {
          return cookies[key];
        },
        set(key, value, options) {
          headers.append("Set-Cookie", serialize(key, value, options));
        },
        remove(key, options) {
          headers.append("Set-Cookie", serialize(key, "", options));
        },
      },
    }
  );

  const userResponse = await supabase.auth.getUser();

  if (userResponse?.data?.user) {
    return {
      user: userResponse?.data?.user,
      env: {
        SUPABASE_URL: process.env.SUPABASE_URL!,
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
      },
    };
  } else {
    return redirect("/login");
  }
}
//
// ACTION FUNCTION
// -----------------------------------------------------------------------------
export async function action({ request }: ActionFunctionArgs) {
}

export default function Index() {
  const { user, env } = useLoaderData<typeof loader>();

  const doLogout = async () => {
    const supabase = createBrowserClient(
      env.SUPABASE_URL,
      env.SUPABASE_ANON_KEY
    );
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
      return;
    } else  {
      redirect("/login");
    }
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix - DASHBOARD PAGE</h1>
      <div>
        DASHBOARD MENU - {user?.email}
        <ul>
          <li>
            <Link to="/dashboard">Dashboard Home</Link>
          </li>
          <li>
            <Link to="/dashboard/about">Dashboard About</Link>
          </li>
          <li>
            <Link to="/dashboard/contact">Dashboard Contact</Link>
          </li>
        </ul>
        <Form method="post" style={{ marginLeft: 32 }} action="/dashboard">
          <button type="button" onClick={async () => await doLogout()}>
            SIGN OUT
          </button>
        </Form>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
