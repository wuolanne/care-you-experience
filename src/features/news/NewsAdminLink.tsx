import { Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/i18n/LanguageProvider";
import { adminAccessQuery } from "@/features/admin/queries";
import { shouldShowAdminDashboardLink } from "./admin-link";

export function NewsAdminLink() {
  const queryClient = useQueryClient();
  const { tr } = useLang();
  const { data: isAdmin, isPending } = useQuery(adminAccessQuery);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        void queryClient.invalidateQueries({ queryKey: ["current-admin-access"] });
      }
    });
    return () => listener.subscription.unsubscribe();
  }, [queryClient]);

  if (!shouldShowAdminDashboardLink(isAdmin, isPending)) return null;
  return (
    <div className="mt-3 flex justify-center">
      <Link to="/admin" className="text-xs hover:text-primary">
        {tr.footer.adminDashboard}
      </Link>
    </div>
  );
}
