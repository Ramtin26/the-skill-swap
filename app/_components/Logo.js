import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";

function Logo() {
  return (
    <Link href="/" className="flex gap-2 sm:gap-3 md:gap-4 items-center z-10">
      <Image
        src={logo}
        height={60}
        width={60}
        quality={100}
        alt="The Skill Swap logo"
        priority={false}
      />
      <span className="text-lg sm:text-xl md:text-2xl font-semibold text-primary-100">
        The Skill Swap
      </span>
    </Link>
  );
}

export default Logo;
