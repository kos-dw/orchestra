import { Link } from "react-router";
export default function Aside({ className }: { className?: string }) {
  return (
    <aside className={"hidden md:block ".concat(className || "")}>
      <div className="bg-primary text-white h-full">
        <nav>
          <ul className="py-4">
            <li>
              <Link
                to="/dashboard"
                className="block px-4 py-2 text-white hover:bg-gray-500"
              >
                <span>ダッシュボード</span>
              </Link>
            </li>
            <li>
              <Link
                to="/medialibrary"
                className="block px-4 py-2 text-white hover:bg-gray-500"
              >
                <span>メディアライブラリ</span>
              </Link>
            </li>
            <li>
              <div className="block px-4 py-2 text-white">
                <span>ウェブログ</span>
              </div>
              <ul>
                <li>
                  <Link
                    to="/weblog"
                    className="block pl-8 pr-4 py-2 text-white hover:bg-gray-500"
                  >
                    <span>記事一覧</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/weblog/newentry"
                    className="block pl-8 pr-4 py-2 text-white hover:bg-gray-500"
                  >
                    <span>新規記事作成</span>
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
