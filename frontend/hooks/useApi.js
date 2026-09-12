"use client";

import { useCallback, useState } from "react";

export function useApi(action) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError("");
      try {
        const result = await action(...args);
        setData(result);
        return result;
      } catch (requestError) {
        setError(requestError.message || "Something went wrong.");
        throw requestError;
      } finally {
        setLoading(false);
      }
    },
    [action],
  );

  return { data, loading, error, execute, setData };
}
