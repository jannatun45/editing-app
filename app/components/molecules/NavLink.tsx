type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
};

export default function NavLink({ href, children, onClick }: NavLinkProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="block px-6 py-4 text-2xl text-black
        md:inline-block md:px-4 md:py-0
        md:text-lg md:text-white"
    >
      {children}
    </a>
  );
}
