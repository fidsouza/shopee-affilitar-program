import { get, getAll } from "@vercel/edge-config";

type EdgeConfigItem = {
  key: string;
  value: unknown;
  operation?: "upsert" | "delete";
};

const EDGE_CONFIG_URL = process.env.EDGE_CONFIG;
const EDGE_CONFIG_REST_API_URL = process.env.EDGE_CONFIG_REST_API_URL;
const EDGE_CONFIG_REST_TOKEN = process.env.EDGE_CONFIG_REST_TOKEN;
const EDGE_CONFIG_TEAM_ID = process.env.EDGE_CONFIG_TEAM_ID;

function normalizeRestBase(): URL {
  if (!EDGE_CONFIG_REST_API_URL) {
    throw new Error("EDGE_CONFIG_REST_API_URL not set (expected https://api.vercel.com/v1/edge-config/<id>)");
  }
  // Handle accidental leading "=" or extra whitespace from env assignment.
  const cleanedInput = EDGE_CONFIG_REST_API_URL.replace(/^\s*=/, "").trim();
  const trimmed = cleanedInput.replace(/\/items\/?$/, "");
  let base: URL;
  try {
    base = new URL(trimmed);
  } catch {
    throw new Error(
      `EDGE_CONFIG_REST_API_URL is invalid (${EDGE_CONFIG_REST_API_URL}). Expected full URL like https://api.vercel.com/v1/edge-config/<id>`,
    );
  }
  return base;
}

export const isEdgeConfigConnected = Boolean(EDGE_CONFIG_URL);

export async function readValue<T>(key: string): Promise<T | null> {
  return get<T>(key);
}

export async function readValues<T extends Record<string, unknown>>(
  keys: string[],
): Promise<Partial<T>> {
  const result = await getAll(keys);
  return (result ?? {}) as Partial<T>;
}

export async function upsertItems(items: EdgeConfigItem[]): Promise<void> {
  if (!EDGE_CONFIG_REST_API_URL || !EDGE_CONFIG_REST_TOKEN) {
    throw new Error("Edge Config write not configured (missing REST API URL or token)");
  }

  const base = normalizeRestBase();

  const payload = {
    items: items.map((item) => ({
      operation: item.operation ?? "upsert",
      key: item.key,
      value: item.value,
    })),
  };

  const url = new URL(base.toString().replace(/\/$/, "") + "/items");
  if (EDGE_CONFIG_TEAM_ID) {
    url.searchParams.set("teamId", EDGE_CONFIG_TEAM_ID);
  }

  const response = await fetch(url.toString(), {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${EDGE_CONFIG_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Edge Config write failed: ${response.status} ${text} | payload=${JSON.stringify(payload)}`,
    );
  }
}
