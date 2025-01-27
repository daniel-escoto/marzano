import { TRPCReactProvider } from "~/trpc/react";

export default function SettingsPage() {
  return (
    <TRPCReactProvider>
      <div className="container mx-auto px-4">
        <h1 className="mb-4 text-2xl font-bold">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Settings page coming soon...
        </p>
      </div>
    </TRPCReactProvider>
  );
}
