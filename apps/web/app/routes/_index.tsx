import { useState } from "react";
import { client } from "~/trpc/client";
import { trpc } from "~/trpc/react";
import type { Route } from "./+types/_index";

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader() {
  return {
    data: await client.get.query(),
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const [data, setData] = useState<number[]>([]);
  trpc.stream.useSubscription(undefined, {
    onData(data) {
      setData((prev) => [...prev, data]);
    },
    onComplete() {
      console.log("done");
    },
  });
  return (
    <div className="p-2">
      <h1>Welcome to the Home Page</h1>
      <ul>
        {data.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
