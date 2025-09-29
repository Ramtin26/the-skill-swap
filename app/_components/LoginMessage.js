import Link from "next/link";

function LoginMessage() {
  return (
    <div className="grid place-items-center bg-primary-800/70 px-4 sm:px-6 md:px-8">
      <p className="text-center text-lg sm:text-xl md:text-2xl py-10 sm:py-12 max-w-2xl">
        Please{" "}
        <Link href="/login" className="underline text-accent-500">
          Login
        </Link>{" "}
        to apply to this job position right now
      </p>
    </div>
  );
}

export default LoginMessage;
