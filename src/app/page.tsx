import { TRPCReactProvider } from "~/trpc/react";
import { PomodoroApp } from "./_components/pomodoro";

// Server Component (default export)
export default function Home() {
  return (
    <TRPCReactProvider>
      <main className="flex min-h-screen flex-col items-center justify-center dark:bg-gray-900 dark:text-white">
        <PomodoroApp />
      </main>
    </TRPCReactProvider>
  );
}
