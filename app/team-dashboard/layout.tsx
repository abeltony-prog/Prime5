import { AuthProvider } from "@/contexts/auth-context"

export default function TeamDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthProvider>{children}</AuthProvider>
} 