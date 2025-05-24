export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={"svg-spinner ".concat(className || "")}
      viewBox="-50 -50 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        id="circle"
        r="45"
        fill="none"
        // strokeWidth="2"
        strokeDasharray="250"
        strokeDashoffset="0"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="500"
          to="0"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}
