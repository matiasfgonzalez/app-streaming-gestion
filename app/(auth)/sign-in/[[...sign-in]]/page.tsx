import { SignIn } from "@clerk/nextjs";

export const metadata = { title: "Ingresar" };

export default function SignInPage() {
  return <SignIn />;
}
