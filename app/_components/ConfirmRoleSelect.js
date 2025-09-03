"use client";

import { useState } from "react";

function ConfirmRoleSelect({ currentRole }) {
  const roles = ["seeker", "employer"];
  const [role, setRole] = useState(currentRole);

  function handleChange(e) {
    const newRole = e.target.value;
    if (newRole !== currentRole) {
      const confirmed = window.confirm(
        `You are switching to ${newRole}. Some of your current profile data may no longer be visible! Continue?`
      );
      if (confirmed) {
        setRole(newRole);
      } else {
        // revert select to previous
        setRole(currentRole);
      }
    }
  }

  return (
    <select
      name="role"
      value={role}
      onChange={handleChange}
      className="px-4 py-3 rounded-sm bg-primary-200 text-primary-800 self-start"
    >
      {roles.map((role) => (
        <option key={role} value={role}>
          {role === currentRole ? `${currentRole} (current)` : role}
        </option>
      ))}
    </select>
  );
}

export default ConfirmRoleSelect;
