import type { ReactNode } from "react";

type ContainerLayoutProps = {
  children: ReactNode;
};
export default function Container({ children }: ContainerLayoutProps) {
  return (
    <div className="mx-auto max-w-6xl px-8 py-12 bg-zinc-950">
      <div className="grid grid-cols-[1fr_198px] gap-12">{children}</div>
    </div>
  );
}
