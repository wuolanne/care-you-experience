export const safeAdminReturnPaths = [
  "/admin",
  "/admin/yhteydenotot",
  "/admin/videopalaverit",
  "/admin/palvelunaloitukset",
  "/admin/uutiset",
  "/uutisten-yllapito",
  "/pyynnot",
] as const;

export type SafeAdminReturnTo = (typeof safeAdminReturnPaths)[number] | "/admin/uutiset";

export function getSafeAdminReturnTo(value: unknown): SafeAdminReturnTo {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return "/admin";
  }

  const path = value.split(/[?#]/, 1)[0];
  if (path === "/uutisten-yllapito") return "/admin/uutiset";

  return safeAdminReturnPaths.includes(path as (typeof safeAdminReturnPaths)[number])
    ? (path as SafeAdminReturnTo)
    : "/admin";
}
