"use client";

export default function Error({ error, reset }) {
  return (
    <main className="flex justify-center items-center flex-col gap-4 sm:gap-6 px-4 sm:px-6">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">
        Something went wrong!
      </h1>
      <p className="text-sm sm:text-base md:text-lg">{error.message}</p>

      <button
        className="inline-block bg-accent-500 text-primary-800 px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-lg cursor-pointer hover:bg-accent-600 transition-all"
        onClick={() => reset()}
      >
        Try again
      </button>
    </main>
  );
}
