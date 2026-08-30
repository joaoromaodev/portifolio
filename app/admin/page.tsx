import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AdminClient } from "@/components/admin/AdminClient";

export const metadata: Metadata = {
  title: "Admin — projects",
  robots: { index: false, follow: false },
};

// Local authoring tool, not part of the published site. In a production build
// this renders the 404 page and /api/admin/* returns 404 too, so the deployed
// portfolio ships no write path and no login to secure.
export default function AdminPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <AdminClient />;
}
