import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Doc } from "../../convex/_generated/dataModel"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMeetingStatus(interview: Doc<"interviews">) {
  const now = Date.now();
  const startTime = interview.startTime;
  const endTime = interview.endTime;

  if (interview.status === "completed" || (endTime && endTime < now)) {
    return "completed";
  }

  // Consider meeting "live" if it's within 10 minutes before start time or after start time
  const tenMinutesBeforeStart = startTime - 10 * 60 * 1000;
  if (now >= tenMinutesBeforeStart && interview.status !== "completed") {
    return "live";
  }

  return "upcoming";
}
