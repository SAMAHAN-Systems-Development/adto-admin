import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserType } from "@/lib/types/user-type";

export default function OrganizationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole={UserType.ADMIN}>
      {children}
    </ProtectedRoute>
  );
}
