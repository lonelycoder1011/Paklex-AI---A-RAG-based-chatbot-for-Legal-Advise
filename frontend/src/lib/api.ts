const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function queryLaws(question: string) {
  const res = await fetch(`${API_URL}/api/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function getCollectionStats() {
  const res = await fetch(`${API_URL}/api/collection/stats`);
  return res.json();
}
