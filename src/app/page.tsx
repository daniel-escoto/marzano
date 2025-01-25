import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  // void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center dark:bg-gray-900 dark:text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Welcome to Marzano
          </h1>
        </div>
      </main>
    </HydrateClient>
  );
}
