import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import {
  ApiError,
  api,
  clearToken,
  getAssetUrl,
  getToken,
  setToken,
} from "../lib/api.js";

const originalFetch = globalThis.fetch;
const originalWindow = globalThis.window;

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalWindow === undefined) {
    delete globalThis.window;
  } else {
    globalThis.window = originalWindow;
  }
});

function setLocalStorage(initialValues = {}) {
  const values = new Map(Object.entries(initialValues));
  globalThis.window = {
    localStorage: {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, String(value)),
      removeItem: (key) => values.delete(key),
    },
  };
}

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json" },
  });
}

test("builds asset URLs while preserving absolute URLs", () => {
  assert.equal(
    getAssetUrl("/uploads/avatar.png"),
    "http://localhost:8000/uploads/avatar.png",
  );
  assert.equal(
    getAssetUrl("uploads/avatar.png"),
    "http://localhost:8000/uploads/avatar.png",
  );
  assert.equal(
    getAssetUrl("https://cdn.example.com/avatar.png"),
    "https://cdn.example.com/avatar.png",
  );
  assert.equal(getAssetUrl(""), "");
});

test("stores, reads, and clears the authentication token", () => {
  setLocalStorage();

  assert.equal(getToken(), null);
  setToken("test-token");
  assert.equal(getToken(), "test-token");
  clearToken();
  assert.equal(getToken(), null);
});

test("sends JSON requests with the bearer token and filtered query parameters", async () => {
  setLocalStorage({ signaldesk_token: "test-token" });
  let capturedUrl;
  let capturedOptions;
  globalThis.fetch = async (url, options) => {
    capturedUrl = url;
    capturedOptions = options;
    return jsonResponse({ jobs: [] });
  };

  const result = await api.getJobs({ title: "Engineer", location: "", page: 2 });

  assert.deepEqual(result, { jobs: [] });
  assert.equal(
    capturedUrl,
    "http://localhost:8000/api/jobs?title=Engineer&page=2",
  );
  assert.equal(capturedOptions.headers.get("Authorization"), "Bearer test-token");
  assert.equal(capturedOptions.headers.get("Content-Type"), "application/json");
});

test("surfaces API errors with their status code and message", async () => {
  globalThis.fetch = async () =>
    jsonResponse({ message: "Invalid credentials" }, 401);

  await assert.rejects(
    api.login({ email: "user@example.com", password: "wrong" }),
    (error) => {
      assert.ok(error instanceof ApiError);
      assert.equal(error.status, 401);
      assert.equal(error.message, "Invalid credentials");
      return true;
    },
  );
});

test("does not set JSON content type for multipart uploads", async () => {
  let capturedOptions;
  globalThis.fetch = async (_url, options) => {
    capturedOptions = options;
    return jsonResponse({ uploaded: true });
  };

  await api.uploadResume(new Blob(["resume"]), 4);

  assert.equal(capturedOptions.headers.has("Content-Type"), false);
  assert.ok(capturedOptions.body instanceof FormData);
  assert.equal(capturedOptions.body.get("roadmapDuration"), "4");
});

test("saves roadmap task completion", async () => {
  let capturedUrl;
  let capturedOptions;
  globalThis.fetch = async (url, options) => {
    capturedUrl = url;
    capturedOptions = options;
    return jsonResponse({ success: true });
  };

  await api.updateRoadmapTask(2, 1, true);

  assert.equal(capturedUrl, "http://localhost:8000/api/resume/roadmap/task");
  assert.equal(capturedOptions.method, "PATCH");
  assert.deepEqual(JSON.parse(capturedOptions.body), {
    weekIndex: 2,
    taskIndex: 1,
    completed: true,
  });
});
