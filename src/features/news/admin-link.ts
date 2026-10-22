export function shouldShowAdminDashboardLink(isAdmin: boolean | undefined, isPending: boolean) {
  return !isPending && isAdmin === true;
}
