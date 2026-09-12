import { Mail, MirrorRectangular, Phone, User, X } from "lucide-react";
import { useState } from "react";

import Navbar from "~/components/organisms/Navbar";

const menus = [
  {
    name: "Expresso",
    price: "IDR 15k",
    image: "/images/medium/1.jpg",
  },
  {
    name: "Expresso",
    price: "IDR 15k",
    image: "/images/medium/1.jpg",
  },
  {
    name: "Expresso",
    price: "IDR 15k",
    image: "/images/medium/1.jpg",
  },
  {
    name: "Expresso",
    price: "IDR 15k",
    image: "/images/medium/1.jpg",
  },
  {
    name: "Expresso",
    price: "IDR 15k",
    image: "/images/medium/1.jpg",
  },
  {
    name: "Expresso",
    price: "IDR 15k",
    image: "/images/medium/1.jpg",
  },
  {
    name: "Expresso",
    price: "IDR 15k",
    image: "/images/medium/1.jpg",
  },
];

export default function CoffeeRoute() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#010101] text-white">
      {/* ================= NAVBAR ================= */}
      <Navbar />

      {/* ================= HERO ================= */}
      <section
        id="home"
        className="
          relative flex min-h-screen items-center
          bg-cover bg-center bg-no-repeat
          bg-[url('/images/medium/header-bg-flip.jpg')]
        "
      >
        {/* Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 from-[#010101] to-transparent" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl px-[7%] pt-20">
          <h1 className="text-5xl font-bold leading-tight md:text-7xl">
            Mari Nikmati Secangkir <span className="text-[#b6895b]">Kopi</span>
          </h1>

          <p className="mt-6 text-lg font-light leading-relaxed text-white/80 md:text-2xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure, enim.
          </p>

          <a
            href="#menu"
            className="mt-6 inline-block rounded-md bg-[#b6895b] px-8 py-4 text-lg transition hover:bg-[#9b7047]"
          >
            Beli Sekarang
          </a>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section id="about" className="px-[7%] py-24">
        <h2 className="mb-12 text-center text-4xl font-bold">
          <span className="text-[#b6895b]">Tentang</span> Kami
        </h2>

        <div className="flex flex-col gap-10 md:flex-row">
          {/* Image */}
          <div className="flex-1">
            <img
              src="/images/medium/tentang-kami.jpg"
              alt="Tentang kami"
              className="w-full"
            />
          </div>

          {/* Content */}
          <div className="flex-1 md:px-4">
            <h3 className="mb-4 text-2xl font-bold">
              Kenapa memilih kopi kami?
            </h3>

            <p className="mb-4 text-lg font-light leading-relaxed text-white/70">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Laboriosam dolorem soluta, obcaecati consectetur deserunt eius?
            </p>

            <p className="text-lg font-light leading-relaxed text-white/70">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. At
              assumenda necessitatibus blanditiis tenetur velit sint modi, sed
              nihil officiis nam.
            </p>
          </div>
        </div>
      </section>

      {/* ================= MENU ================= */}
      <section id="menu" className="px-[7%] py-24">
        <h2 className="mb-4 text-center text-4xl font-bold">
          <span className="text-[#b6895b]">Menu</span> Kami
        </h2>

        <p className="mx-auto max-w-lg text-center font-light text-white/70">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum est
          tenetur quaerat officia inventore repellendus.
        </p>

        {/* Menu Cards */}
        <div className="mt-20 grid grid-cols-2 justify-items-center gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
          {menus.map((menu, index) => (
            <div key={index} className="w-full text-center">
              <img
                src={menu.image}
                alt={menu.name}
                className="mx-auto w-4/5 max-w-48 rounded-full"
              />

              <h3 className="mt-4 font-bold">- {menu.name} -</h3>

              <p className="mt-2 text-[#b6895b]">{menu.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section id="contact" className="px-[7%] py-24">
        <h2 className="mb-4 text-center text-4xl font-bold">
          <span className="text-[#b6895b]">Kontak</span> Kami
        </h2>

        <p className="mx-auto max-w-lg text-center font-light text-white/70">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti,
          deleniti?
        </p>

        <div className="mt-8 flex flex-col bg-[#222] md:flex-row">
          {/* Google Maps */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4780.1305892419705!2d108.58150543216277!3d-6.773929578290424"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-96 w-full md:h-auto md:flex-1"
          />

          {/* Form */}
          <form className="flex-1 p-8 md:p-16">
            {/* Name */}
            <div className="mb-6 flex items-center border border-white bg-[#010101] px-4">
              <User size={20} />

              <input
                type="text"
                placeholder="Nama"
                className="w-full bg-transparent p-5 text-white outline-none placeholder:text-white/50"
              />
            </div>

            {/* Email */}
            <div className="mb-6 flex items-center border border-white bg-[#010101] px-4">
              <Mail size={20} />

              <input
                type="email"
                placeholder="Email"
                className="w-full bg-transparent p-5 text-white outline-none placeholder:text-white/50"
              />
            </div>

            {/* Phone */}
            <div className="mb-6 flex items-center border border-white bg-[#010101] px-4">
              <Phone size={20} />

              <input
                type="text"
                placeholder="No HP"
                className="w-full bg-transparent p-5 text-white outline-none placeholder:text-white/50"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="bg-[#b6895b] px-8 py-4 text-lg transition hover:bg-[#9b7047]"
            >
              Kirim Pesan
            </button>
          </form>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="mt-12 bg-[#b6895b] px-4 py-10 text-center">
        {/* Social */}
        <div className="flex justify-center gap-6">
          <a href="#" className="hover:text-black">
            <X />
          </a>

          <a href="#" className="hover:text-black">
            <X />
          </a>

          <a href="#" className="hover:text-black">
            <MirrorRectangular />
          </a>
        </div>

        {/* Footer Links */}
        <div className="mt-6 flex justify-center gap-6">
          <a href="#home" className="hover:text-black">
            Home
          </a>

          <a href="#about" className="hover:text-black">
            About
          </a>

          <a href="#menu" className="hover:text-black">
            Menu
          </a>

          <a href="#contact" className="hover:text-black">
            Contact
          </a>
        </div>

        {/* Credit */}
        <p className="mt-6 text-sm">
          Created by{" "}
          <a href="#" className="font-bold">
            Jannatun Naim
          </a>{" "}
          | © 2026
        </p>
      </footer>
    </div>
  );
}
