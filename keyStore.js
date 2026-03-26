import { randomBytes } from "crypto";

const store = [];

function generateId() {
  const timestamp = Date.now().toString(36);
  const suffix = randomBytes(4).toString("hex");
  return `${timestamp}-${suffix}`;
}

function generateKeyString() {
  const secret = randomBytes(24).toString("hex");
  return `sk_live_${secret}`;
}

export async function getAllKeys() {
  return [...store];
}

export async function createKey(label) {
  const newKey = {
    id: generateId(),
    key: generateKeyString(),
    label,
    status: "active",
    createdAt: new Date().toISOString(),
  };

  store.unshift(newKey);
  return { ...newKey };
}

export async function getKeyById(id) {
  const key = store.find((k) => k.id === id);
  return key ? { ...key } : null;
}

export async function revokeKey(id) {
  const index = store.findIndex((k) => k.id === id);
  if (index === -1) return null;

  store[index] = {
    ...store[index],
    status: "revoked",
    revokedAt: new Date().toISOString(),
  };

  return { ...store[index] };
}