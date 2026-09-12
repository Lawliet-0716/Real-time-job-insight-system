"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "../../lib/api";
import LoadingState from "../shared/LoadingState";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const ready = useSyncExternalStore(
    () => () => {},
    () => Boolean(getToken()),
    () => false,
  );

  useEffect(() => {
    if (!getToken()) router.replace("/login");
  }, [router]);

  if (!ready)
    return (
      <div className="mx-auto max-w-5xl px-5 py-10">
        <LoadingState label="Checking your session" />
      </div>
    );
  return children;
}
