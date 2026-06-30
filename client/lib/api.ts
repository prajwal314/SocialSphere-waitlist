const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function joinWaitlist(name: string, email: string) {
  // const res = await fetch(`${API_URL}/api/waitlist`, {
  const res = await fetch(`${API_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}
