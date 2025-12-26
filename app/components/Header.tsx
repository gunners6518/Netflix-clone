"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function Header() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleShow = () => {
      setShow(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleShow);
    return () => {
      window.removeEventListener("scroll", handleShow);
    };
  }, []);

  return (
    <div
      className={`fixed top-0 w-full h-16 p-5 z-10 flex justify-between items-center transition-all ease-in duration-500 ${
        show ? "bg-black" : ""
      }`}
    >
      <Link href="/" className="fixed left-5">
        <img
          className="w-20 object-contain cursor-pointer"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1920px-Netflix_2015_logo.svg.png"
          alt="Netflix Logo"
        />
      </Link>
    </div>
  );
}
