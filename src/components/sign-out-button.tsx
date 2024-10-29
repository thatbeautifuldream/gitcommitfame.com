"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
    >
      Sign out
    </button>
  );
}
