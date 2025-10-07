"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

function Filter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeFilter = searchParams.get("locationType") ?? "all";

  function handleFilter(filter) {
    const params = new URLSearchParams(searchParams);

    params.set("locationType", filter);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="border border-primary-800 flex flex-nowrap rounded-full overflow-hidden">
      <Button
        filter="all"
        handleFilter={handleFilter}
        activeFilter={activeFilter}
      >
        All Types
      </Button>
      <Button
        filter="remote"
        handleFilter={handleFilter}
        activeFilter={activeFilter}
      >
        Remote
      </Button>
      <Button
        filter="in-office"
        handleFilter={handleFilter}
        activeFilter={activeFilter}
      >
        In-Office
      </Button>
      <Button
        filter="hybrid"
        handleFilter={handleFilter}
        activeFilter={activeFilter}
      >
        Hybrid
      </Button>
    </div>
  );
}

function Button({ filter, handleFilter, activeFilter, children }) {
  return (
    <button
      onClick={() => handleFilter(filter)}
      className={`px-4 py-2 sm:px-5 sm:py-2 md:px-6 md:py-3 text-sm sm:text-base hover:bg-primary-700 cursor-pointer ${
        filter === activeFilter ? "bg-primary-700 text-primary-50" : ""
      }`}
    >
      {children}
    </button>
  );
}

export default Filter;
