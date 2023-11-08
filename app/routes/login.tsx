import { redirect, type MetaFunction } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import _aperture from "../../node_modules/ramda/es/internal/_aperture";
import { createBrowserClient } from "@supabase/ssr";
import React from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

// add the loader
export function loader() {
  return {
    env: {
      SUPABASE_URL: process.env.SUPABASE_URL!,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
    },
  };
}

export function action() {
  console.log("action function");
  return redirect("/dashboard");
}

export default function Index() {
  const { env } = useLoaderData<typeof loader>();
  const inputForm = React.useRef<HTMLFormElement>();

  const doLogin = async () => {
    const supabase = createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
    const formData = new FormData(inputForm.current);
    const dataFields = Object.fromEntries(formData.entries());
    const { data, error } = await supabase.auth.signInWithPassword({
      email: dataFields.email as string,
      password: dataFields.password as string,
    });

    if (error) {
      console.log(error);
      return;
    }

    if (data.session) {
      console.log(data.session);
      redirect("/dashboard");
    }
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix - LOGIN PAGE</h1>
      <form method="post" ref={inputForm as React.RefObject<HTMLFormElement>}>
        <input type="email" name="email" placeholder="username" />
        <input type="password" name="password" placeholder="password" />
        <button type="button" onClick={() => doLogin()}>
          LOGIN
        </button>
      </form>
      <Link to="/create-account">CREATE ACCOUNT</Link>
    </div>
  );
}
