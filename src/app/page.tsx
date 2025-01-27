import { TRPCReactProvider } from "~/trpc/react";
import PomodoroApp from "./_components/PomodoroApp";

// Server Component (default export)
export default function Home() {
  return (
    <TRPCReactProvider>
      <PomodoroApp />
    </TRPCReactProvider>
  );
}
