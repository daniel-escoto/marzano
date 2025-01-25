import { useEffect } from "react";
import { formatTime } from "../_util/formatTime";

export function useUpdateMetadata(time: number) {
  useEffect(() => {
    // Update the document title directly since Next.js metadata can't be updated client-side
    document.title = `${formatTime(time)} | Marzano`;
  }, [time]);
}
