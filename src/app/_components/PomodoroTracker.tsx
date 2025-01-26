function PomodoroTracker({ count }: { count: number }) {
  // Handle negative counts gracefully by treating them as 0
  const safeCount = Math.max(0, count);

  const tomatoGroups = [];
  for (let i = 0; i < safeCount; i += 4) {
    const groupTomatoes = Array.from(
      { length: Math.min(4, safeCount - i) },
      (_, j) => (
        <span key={i + j} role="img" aria-label="completed pomodoro">
          🍅
        </span>
      ),
    );
    if (groupTomatoes.length === 4) {
      tomatoGroups.push(
        <span
          key={`group-${i}`}
          className="inline-flex rounded border border-gray-300 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800"
        >
          {groupTomatoes}
        </span>,
      );
    } else {
      tomatoGroups.push(
        <span key={`group-${i}`} className="inline-flex p-1">
          {groupTomatoes}
        </span>,
      );
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-wrap gap-3 text-2xl">{tomatoGroups}</div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {safeCount} {safeCount === 1 ? "pomodoro" : "pomodoros"} completed
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          {Math.floor(safeCount / 4)}{" "}
          {Math.floor(safeCount / 4) === 1 ? "pack" : "packs"}{" "}
          {safeCount % 4 > 0 && `+ ${safeCount % 4}`}
        </p>
      </div>
    </div>
  );
}

export default PomodoroTracker;
