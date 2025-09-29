"use client";

import { useEffect, useRef, useState } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

const SKILL_POOL = [
  "React",
  "JavaScript",
  "TypeScript",
  "Next.js",
  "Node.js",
  "Python",
  "Java",
  "C++",
  "HTML",
  "CSS",
  "Tailwind CSS",
  "Vue.js",
  "Angular",
  "Express.js",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Docker",
  "AWS",
  "Azure",
  "Google Cloud",
  "Kubernetes",
  "Git",
  "GraphQL",
  "REST API",
  "Jest",
  "Cypress",
  "Figma",
  "Adobe XD",
  "UI/UX Design",
];

function SkillsSelector({ name, defaultSkills = [] }) {
  const [selected, setSelected] = useState(
    Array.isArray(defaultSkills) ? defaultSkills : []
  );
  const validationInputRef = useRef(null);
  const [showError, setShowError] = useState(false);

  function toggleSkill(skill) {
    setSelected((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  }

  useEffect(() => {
    const isValid = selected.length >= 3;

    if (validationInputRef.current) {
      if (isValid) {
        validationInputRef.current.setCustomValidity("");
        setShowError(false);
      } else {
        validationInputRef.current.setCustomValidity(
          "You must select at least 3 skills."
        );
      }
    }
  }, [selected]);

  const handleValidation = (e) => {
    if (selected.length < 3) {
      e.preventDefault();
      setShowError(true);
      if (validationInputRef.current) {
        validationInputRef.current.focus();
        validationInputRef.current.reportValidity();
      }
    }
  };

  return (
    <div className="space-y-2 mt-2">
      <div className="flex flex-wrap gap-2">
        {SKILL_POOL.map((skill) => (
          <button
            type="button"
            key={skill}
            onClick={() => toggleSkill(skill)}
            className={`px-3 sm:px-4 py-2 sm:py-3 rounded-full text-sm border  transition cursor-pointer ${
              selected.includes(skill)
                ? "bg-primary-600 text-white hover:bg-primary-700 border-primary-600"
                : "bg-primary-100 text-primary-900 hover:bg-primary-200 border-primary-400"
            }`}
          >
            {skill}
          </button>
        ))}
      </div>

      {/* Validation input */}
      <input
        ref={validationInputRef}
        type="text"
        required
        value={selected.length >= 3 ? "valid" : ""}
        onChange={() => {}}
        onInvalid={handleValidation}
        className="w-0 h-0 opacity-0 absolute pointer-events-none"
        tabIndex={-1}
        aria-hidden="true"
      />

      <input type="hidden" name={name} value={JSON.stringify(selected)} />

      {/* Visual feedback */}
      <div className="flex items-center justify-between mt-3 sm:mt-4">
        <small
          className={`text-xs sm:text-sm ${
            selected.length < 3 ? "text-red-500" : "text-primary-400"
          }`}
        >
          Pick at least 3 skills (currently {selected.length})
        </small>

        {showError && selected.length < 3 && (
          <small className="text-red-500 flex gap-1 sm:gap-2 items-center font-medium text-xs sm:text-sm">
            <span>
              <ExclamationTriangleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
            </span>{" "}
            At least 3 skills required
          </small>
        )}
      </div>
    </div>
  );
}

export default SkillsSelector;
