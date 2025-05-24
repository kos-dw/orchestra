import { Spinner } from "app/presentation/components/svg";

export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-secondary">
      <div className="w-16">
        <Spinner className="stroke-white stroke-2" />
      </div>
    </div>
  );
}
