"use client";

import { useState } from "react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";

function ExperienceManager({ name, defaultExperience = [] }) {
  const [items, setItems] = useState(defaultExperience);

  function updateItem(index, field, value) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  function addItem() {
    setItems((prev) => [...prev, { role: "", years: "", company: "" }]);
  }

  function removeItem(index) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4 mt-2">
      {items.map((exp, i) => (
        <div
          key={i}
          className="flex flex-col lg:flex-row gap-2 lg:items-center"
        >
          <input
            type="text"
            placeholder="Role"
            value={exp.role ?? ""}
            onChange={(e) => updateItem(i, "role", e.target.value)}
            className="w-full lg:flex-1 min-w-0 rounded-sm border border-primary-200 px-3 py-2 text-sm md:text-base"
          />
          <input
            type="number"
            placeholder="Years"
            value={exp.years ?? ""}
            onChange={(e) => updateItem(i, "years", e.target.value)}
            className="w-full lg:flex-1 min-w-0 rounded-sm border border-primary-200 px-3 py-2 text-sm md:text-base"
          />
          <input
            type="text"
            placeholder="Company"
            value={exp.company ?? ""}
            onChange={(e) => updateItem(i, "company", e.target.value)}
            className="w-full lg:flex-1 min-w-0 rounded-sm border border-primary-200 px-3 py-2 text-sm md:text-base"
          />
          <button
            type="button"
            onClick={() => removeItem(i)}
            className="self-center lg:self-auto w-10 h-10 lg:w-auto lg:h-auto flex items-center justify-center lg:px-3 lg:py-3 rounded-full bg-primary-600 hover:bg-primary-700 text-white cursor-pointer flex-shrink-0"
          >
            <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="flex gap-1 items-center px-3 py-2 sm:px-4 sm:py-3 rounded-md bg-accent-500 hover:bg-accent-600 text-white text-sm md:text-base cursor-pointer"
      >
        <span>
          <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
        </span>{" "}
        Add experience
      </button>

      {/* Hidden input sends JSON array to server action */}
      <input type="hidden" name={name} value={JSON.stringify(items)} />
    </div>
  );
}

export default ExperienceManager;
