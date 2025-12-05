import { redirect } from "next/navigation";

/**
 * Redirect from /generate to /photo-generator for backwards compatibility
 */
export default function GenerateRedirect() {
  redirect("/photo-generator");
}
