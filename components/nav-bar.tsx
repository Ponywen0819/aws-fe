import Link from "next/link";
import { Navbar, NavbarContent, NavbarItem } from "@nextui-org/navbar";

export const NavBar = () => {
  return (
    <Navbar isBordered>
      <NavbarContent>
        <NavbarItem>
          <Link href={"help"}>支援</Link>
        </NavbarItem>
        <NavbarItem>
          <Link href={"game"}>遊戲</Link>
        </NavbarItem>
        <NavbarItem>
          <Link href={"list"}>列表</Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};
