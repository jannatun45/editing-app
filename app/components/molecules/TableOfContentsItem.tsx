type TableOfContentsItemProps = {
  id: string;
  label: string;

  // Menentukan apakah item sedang aktif
  active: boolean;
};

export default function TableOfContentsItem({
  id,
  label,
  active,
}: TableOfContentsItemProps) {
  return (
    <li>
      <a
        href={`#${id}`}
        className={`
          block
          border-l-2
          py-1
          pl-4
          text-sm
          transition
          ${
            active
              ? "border-white text-white font-medium"
              : "border-transparent text-gray-400 hover:border-white/50 hover:text-white"
          }
        `}
      >
        {label}
      </a>
    </li>
  );
}
