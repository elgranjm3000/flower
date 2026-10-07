import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "sf_admin";
const MAX_AGE = 60 * 60 * 12; // 12 horas

function secret(): string {
  return process.env.AUTH_SECRET || "dev-insecure-secret";
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createSessionToken(username: string): string {
  const payload = `${username}.${Date.now() + MAX_AGE * 1000}`;
  return `${Buffer.from(payload).toString("base64url")}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): string | null {
  if (!token) return null;
  const [encoded, sig] = token.split(".");
  if (!encoded || !sig) return null;
  const payload = Buffer.from(encoded, "base64url").toString();
  const expected = sign(payload);
  if (
    sig.length !== expected.length ||
    !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  ) {
    return null;
  }
  const [username, expiry] = payload.split(".");
  if (!username || !expiry || Date.now() > Number(expiry)) return null;
  return username;
}

export async function getAdminSession(): Promise<string | null> {
  const store = await cookies();
  return verifySessionToken(store.get(COOKIE_NAME)?.value);
}

export async function setAdminCookie(username: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, createSessionToken(username), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearAdminCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export function checkCredentials(
  username: string,
  password: string,
): boolean {
  return (
    username === (process.env.ADMIN_USERNAME || "admin") &&
    password === (process.env.ADMIN_PASSWORD || "")
  );
}
