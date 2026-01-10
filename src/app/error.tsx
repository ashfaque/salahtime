"use client";

import { useEffect } from "react";
import { StatusScreen } from "@/components/ui/StatusScreen";

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Optional: Log the error to an external service (like Sentry)
    console.error("App Crash:", error);
  }, [error]);

  return (
    <StatusScreen
      title="Something went wrong"
      message="We encountered an unexpected error. Please try again."
      icon={<span className="text-4xl">💥</span>}
      actionLabel="Try Again"
      onAction={reset} // 'reset' attempts to re-render the page
    />
  );
}
