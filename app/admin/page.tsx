import { isAuthenticated } from "@/lib/auth";
import { readCatalog } from "@/lib/products";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminEditor from "@/components/admin/AdminEditor";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "JustJuice — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const authed = await isAuthenticated();
  if (!authed) {
    return <AdminLogin />;
  }
  const catalog = await readCatalog();
  return <AdminEditor initialCatalog={catalog} />;
}
