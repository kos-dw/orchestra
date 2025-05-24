import { INFO } from "app/shared/constants/";

export default function Footer({ className }: { className?: string }) {
  return (
    <footer className={className}>
      <div className="p-4 bg-fill-tertiary text-white">
        <p className="text-right text-sm tracking-normal">
          &copy;&nbsp;{INFO.ESTERBLISHMENT_YEAR}-{new Date().getFullYear()}
          &nbsp;{INFO.APP_NAME}.
        </p>
      </div>
    </footer>
  );
}
