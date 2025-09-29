"use client";

import { useState } from "react";

function StarRating({
  maxRating = 5,
  initialRating = 0,
  onSetRating,
  size = 20,
  color = "#facc15", // Tailwind yellow-400
}) {
  const [rating, setRating] = useState(initialRating);
  const [tempRating, setTempRating] = useState(0);

  function handleRate(value) {
    setRating(value);
    onSetRating?.(value);
  }

  return (
    <div className="flex items-center gap-1 bg-primary-900/80 p-2 sm:p-3 md:p-4 rounded-lg">
      <div className="flex">
        {Array.from({ length: maxRating }, (_, i) => {
          const value = i + 1;
          return (
            <button
              key={value}
              type="button"
              onClick={() => handleRate(value)}
              onMouseEnter={() => setTempRating(value)}
              onMouseLeave={() => setTempRating(0)}
              className="focus:outline-none cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                style={{ width: size, height: size }}
                fill={value <= (tempRating || rating) ? color : "none"}
                stroke={color}
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          );
        })}
      </div>

      {/* numeric feedback*/}
      <span className="text-sm sm:text-sm md:text-base font-medium text-primary-300 w-10 text-center">
        {tempRating || rating}/{maxRating}
      </span>
    </div>
  );
}

export default StarRating;
