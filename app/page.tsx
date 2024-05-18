import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";

import { NavBar } from "@/components/nav-bar";

import awsconfig from "./aws-exports";

Amplify.configure(awsconfig, { ssr: true });

export default function IndexPage() {
  return (
    <main>
      <NavBar />
    </main>
  );
}
