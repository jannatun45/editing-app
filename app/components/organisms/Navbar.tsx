import { useState } from "react";
import Logo from "../atoms/Logo";
import NavLink from "../molecules/NavLink";
import { Menu, Search, ShoppingCart } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => {
    setIsOpen(false);
  };
  return (
    <nav
      className=" fixed top-0 right-0 left-0 z-50
        flex items-center justify-between
        border-b border-[#513c28]
        bg-black/80 px-[7%] py-5
        backdrop-blur-sm"
    >
      <Logo />
      <div
        className={`
          absolute top-full h-screen w-72 bg-white
          transition-all duration-300
          md:static md:flex md:h-auto
          md:w-auto md:bg-transparent
          ${isOpen ? "right-0" : "-right-full"}
        `}
      >
        <NavLink href="#home" onClick={closeMenu}>
          Home
        </NavLink>
        <NavLink href="#about" onClick={closeMenu}>
          About
        </NavLink>
        <NavLink href="#menu" onClick={closeMenu}>
          Menu
        </NavLink>
        <NavLink href="#contact" onClick={closeMenu}>
          Contact
        </NavLink>
      </div>

      {/* Navbar Extra */}
      <div className="flex items-center gap-2">
        <button className="p-2 hover:text-[#b6895b]">
          <Search size={22} />
        </button>

        <button className="p-2 hover:text-[#b6895b]">
          <ShoppingCart size={22} />
        </button>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:text-[#b6895b] md:hidden"
        >
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
}
