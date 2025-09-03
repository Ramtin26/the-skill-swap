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
    <div className="border border-primary-800 flex rounded-full overflow-hidden">
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
      className={`px-5 py-2 hover:bg-primary-700 cursor-pointer ${
        filter === activeFilter ? "bg-primary-700 text-primary-50" : ""
      }`}
      onClick={() => handleFilter(filter)}
    >
      {children}
    </button>
  );
}

export default Filter;
