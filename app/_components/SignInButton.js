import Image from "next/image";
import { signInAction } from "@/app/_lib/actions";

function SignInButton() {
  return (
    <form action={signInAction}>
      <button className="flex items-center justify-center gap-4 sm:gap-6 text-base sm:text-lg lg:text-xl font-medium border border-primary-300 px-6 py-3 sm:px-10 sm:py-4 rounded-md hover:bg-primary-800 hover:text-primary-100 transition-colors duration-200 cursor-pointer w-full sm:w-auto">
        <Image
          src="https://authjs.dev/img/providers/google.svg"
          alt="Google logo"
          width={28}
          height={28}
          quality={90}
          className="h-6 w-6 sm:h-7 sm:w-7"
        />
        <span className="whitespace-nowrap">Continue with Google</span>
      </button>
    </form>
  );
}

export default SignInButton;
