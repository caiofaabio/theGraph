import Link from "next/link";
import React from "react";

const Navbar = () => {
  const menuItem = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Swaps",
      href: "/swaps",
    },
  ];
  return (
    <nav className="p-4 bg-zinc-500 text-white flex gap-3 justify-center text-3xl font-semibold">
      {menuItem.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className="hover:text-zinc-900 hover:font-bold"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default Navbar;
