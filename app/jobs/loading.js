import Spinner from "@/app/_components/Spinner";

export default function Loading() {
  return (
    <div className="grid place-items-center gap-4 py-10">
      <Spinner />
      <p className="text-base sm:text-lg lg:text-xl text-primary-200">
        Loading job data...
      </p>
    </div>
  );
}
