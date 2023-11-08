import { redirect, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
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
  const supabase = createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  const inputForm = React.useRef<HTMLFormElement>();

const doCreateAccount = async () => {
  const form = inputForm.current;
  if (!form) return;
  const formData = new FormData(form);

  const { email, password } = Object.fromEntries(formData.entries());
  const { data, error } = await supabase.auth.signUp({
    email: email as string,
    password: password as string,
  });

  if (error) {
    console.log(error);
    return;
  }

  if (data.session) {
    redirect("/dashboard");
  }
}


  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix - CREATE ACCOUNT PAGE</h1>
      <form method="post" ref={inputForm as React.RefObject<HTMLFormElement>}>
        <input type="email" name="email" placeholder="username" />
        <input type="password" name="password" placeholder="password" />
        <button type="button" onClick={() => doCreateAccount()}>
          CREATE ACCOUNT
        </button>
      </form>
      <Link to="/login">CANCEL</Link>
    </div>
  );
}
