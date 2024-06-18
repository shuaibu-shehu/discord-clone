import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return <SignIn forceRedirectUrl={'http://localhost:3000'} />;
}