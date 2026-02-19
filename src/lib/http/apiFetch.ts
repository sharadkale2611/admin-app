"use client";

import { getOrCreateDeviceId } from "./deviceId";

export async function apiFetch(input: RequestInfo | URL, init?: RequestInit) {
  const headers = new Headers(init?.headers);

  // ✅ required on every call
  headers.set("Device-Id", getOrCreateDeviceId());

  // keep existing content-type if set by caller; for FormData do NOT set it manually.
  return fetch(input, {
    ...init,
    headers,
    credentials: init?.credentials ?? "include",
  });
}