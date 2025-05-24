import type { ReactNode } from "react";

export default function Marquee({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`max-w-full sticky top-0 z-5 bg-meaquee py-6 ${className ?? ""}`}
    >
      <div className="container px-4 mx-auto">{children}</div>
    </section>
  );
}
