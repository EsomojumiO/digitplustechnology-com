"use client";

import * as React from "react";

/**
 * Honeypot — visually hidden bot trap. Field name `company_website` must stay
 * empty; the server treats a filled value as a bot and silently 200s.
 *
 * Hidden from sighted users AND assistive tech (aria-hidden), removed from tab
 * order (tabIndex -1), autocomplete off. Not `display:none` (some bots skip
 * those) — uses an off-screen clip instead.
 */
export function Honeypot() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0 0 0 0)",
        whiteSpace: "nowrap",
        border: 0,
      }}
    >
      <label htmlFor="company_website">
        Company website (leave this field empty)
      </label>
      <input
        id="company_website"
        name="company_website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
}

export default Honeypot;
