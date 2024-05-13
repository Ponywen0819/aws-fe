import { NavBar } from "@/components/nav-bar";
import { PropsWithChildren } from "react";

const WithNavLaout = (props: PropsWithChildren<object>) => {
  const { children } = props;
  return (
    <>
      <NavBar />
      <div className="container mx-auto p-2">{children}</div>
    </>
  );
};

export default WithNavLaout;
