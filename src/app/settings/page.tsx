"use client";

export default function SettingsPage() {
  const clearAllData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all data? This action cannot be undone.",
      )
    ) {
      localStorage.clear();
      // Force a page reload to ensure all components update their state
      window.location.reload();
    }
  };

  return (
    <>
      <h1 className="mb-8 text-2xl font-bold">Settings</h1>

      <section className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/50">
        <h2 className="mb-2 text-lg font-semibold text-red-900 dark:text-red-200">
          Clear Data
        </h2>
        <p className="mb-4 text-sm text-red-700 dark:text-red-300">
          This will reset all your progress and settings. This action cannot be
          undone.
        </p>
        <button
          onClick={clearAllData}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-800 dark:hover:bg-red-700"
        >
          Clear All Data
        </button>
      </section>
    </>
  );
}
