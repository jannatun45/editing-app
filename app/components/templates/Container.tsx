import type { ReactNode } from "react";

type ContainerLayoutProps = {
  children: ReactNode;
};
export default function Container({ children }: ContainerLayoutProps) {
  return (
    <div className="bg-zinc-950 pl-10 py-8 grid grid-cols-[1fr_198px] gap-12 text-zinc-500">
      {children}
    </div>
  );
}
