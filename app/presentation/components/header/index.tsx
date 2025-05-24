import { Logo } from "app/presentation/components/svg";
import { HamburgerOpen } from "app/presentation/components/svg/hamburger";
import { phoneMenu } from "app/presentation/stores";
import { useSetAtom } from "jotai";
import { Link } from "react-router";
import { Dropdown } from "./dropdown";

export default function Header() {
  const setIsOpen = useSetAtom(phoneMenu.isOpen);

  return (
    <header className="relative z-10 shadow-md/10 shadow-slate-800">
      <div className="flex">
        <div className="w-[250px] max-w-full shrink-0 bg-slate-500 p-4 flex items-center">
          <Link to="/" className="text-2xl font-bold">
            <Logo className="w-52 fill-white" />
          </Link>
        </div>
        <div className="grow flex justify-end items-center gap-4 bg-white p-4">
          <div className="">
            <Dropdown />
          </div>
          <div className="w-12 md:hidden">
            <button onClick={() => setIsOpen(true)}>
              <HamburgerOpen />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
