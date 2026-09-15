import { cookies } from "next/headers";
import { createHash } from "crypto";

export const ADMIN_COOKIE = "bfix_admin";

export function adminPassword() {
  return process.env.ADMIN_PASSWORD || "bfix-admin-2025";
}

export function adminToken() {
  return createHash("sha256")
    .update(`bfix::${adminPassword()}`)
    .digest("hex");
}

export async function isAdmin() {
  const c = await cookies();
  return c.get(ADMIN_COOKIE)?.value === adminToken();
}
