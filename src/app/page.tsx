import { redirect } from "next/navigation";

/**
 * Home page - redirects directly to notes page
 * Both authenticated users and trial users can access notes
 */
export default async function Home() {
  // Redirect everyone to notes page (trial mode or authenticated)
  redirect("/notes");
}
