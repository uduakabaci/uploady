import type { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return <div className="app-shell min-h-screen">{children}</div>;
}
