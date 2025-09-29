import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/solid";
import { signOutAction } from "@/app/_lib/actions";

function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button className="w-full flex items-center gap-3 sm:gap-4 py-2 sm:py-3 px-4 sm:px-5 font-semibold text-primary-200 hover:bg-primary-900 hover:text-primary-100 transition-colors cursor-pointer">
        <ArrowRightStartOnRectangleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
        <span>Sign out</span>
      </button>
    </form>
  );
}

export default SignOutButton;
