type StorngProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Strong({ children, className = "" }: StorngProps) {
  return (
    <span
      className={`bg-zinc-900 text-zinc-400 font-bold  px-2 py-0.5 ${className}`}
    >
      {children}
    </span>
  );
}
