import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

// add the loader
export function loader() {
  return { message: "Hello from loader function" };
}

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8", background :'blue' }}>
      <h1>Welcome to Remix - DASHBOARD HOME</h1>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
