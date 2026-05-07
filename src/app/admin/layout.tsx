import { redirect } from "next/navigation";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin?callbackUrl=/admin");
  }
  if (session.user.role !== "admin") {
    redirect("/?denied=admin");
  }
  return <>{children}</>;
}
