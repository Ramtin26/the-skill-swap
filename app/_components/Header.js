import Navigation from "./Navigation";
import Logo from "./Logo";

function Header() {
  return (
    <header className="border-b border-primary-900 px-4 sm:px-6 md:px-8 py-4 sm:py-5">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Logo />
        <Navigation />
      </div>
    </header>
  );
}

export default Header;
