"use client";

const DEVICE_ID_KEY = "admin-app-device-id";

let inMemoryDeviceId: string | null = null;

function newId() {
  return crypto.randomUUID();
}

function getCookie(name: string) {
  const value = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));
  return value?.split("=")[1];
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=31536000`;
}

export function getOrCreateDeviceId(): string {
  if (typeof window === "undefined") return "server";

  if (inMemoryDeviceId) return inMemoryDeviceId;

  try {
    // 1️⃣ Try localStorage
    let id = localStorage.getItem(DEVICE_ID_KEY);

    // 2️⃣ Try cookie
    if (!id) {
      id = getCookie(DEVICE_ID_KEY) || null;
    }

    // 3️⃣ Create new
    if (!id) {
      id = newId();
      localStorage.setItem(DEVICE_ID_KEY, id);
      setCookie(DEVICE_ID_KEY, id);
    }

    inMemoryDeviceId = id;

    return id;
  } catch {
    inMemoryDeviceId = newId();
    return inMemoryDeviceId;
  }
}
