import { userDataStore } from "app/presentation/stores";
import { useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

export function Dropdown() {
  const userData = useAtomValue(userDataStore);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="cursor-pointer bg-gray-200 hover:bg-gray-100 w-full h-12 rounded-md px-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <div className="">
            {`サインイン中 : ${userData?.display_name || ""}`}
          </div>
          <div className="w-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="fill-black"
            >
              <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
            </svg>
          </div>
        </div>
      </button>
      <ul
        className="absolute top-full bg-white w-full shadow-lg rounded-md mt-1 p-2"
        hidden={!isOpen}
      >
        <li>
          <Link to="/signout">
            <div className="flex items-center gap-2 p-2 hover:bg-gray-100">
              <div className="">サインアウト</div>
              <div className="w-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                >
                  <path d="M320 32c0-9.9-4.5-19.2-12.3-25.2S289.8-1.4 280.2 1l-179.9 45C79 51.3 64 70.5 64 92.5L64 448l-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 192 0 32 0 0-32 0-448zM256 256c0 17.7-10.7 32-24 32s-24-14.3-24-32s10.7-32 24-32s24 14.3 24 32zm96-128l96 0 0 352c0 17.7 14.3 32 32 32l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0 0-320c0-35.3-28.7-64-64-64l-96 0 0 64z" />
                </svg>
              </div>
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
}
