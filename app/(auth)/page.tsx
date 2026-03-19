import { redirect } from "next/navigation";

export default function AuthIndexPage() {
  // Redirect to home if someone accesses the (auth) group directly
  redirect("/");
}
