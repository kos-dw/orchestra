import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export default function Container({
  children,
  className,
}: ContainerProps) {
  return (
    <section className={`mt-8 mb-8 max-w-full ${className ?? ""}`}>
      <div className="container px-4 mx-auto">{children}</div>
    </section>
  );
}
