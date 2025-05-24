export function HamburgerOpen() {
  return (
    <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="38" width="90" height="2" fill="currentColor" />
      <rect x="5" y="61" width="90" height="2" fill="currentColor" />
    </svg>
  );
}
export function HamburgerClose() {
  return (
    <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="18" y="17" width="90" height="2" transform="rotate(45 18 17)" fill="currentColor" />
      <rect x="17" y="81" width="90" height="2" transform="rotate(-45 17 81)" fill="currentColor" />
    </svg>
  );
}
