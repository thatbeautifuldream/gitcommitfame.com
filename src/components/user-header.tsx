import { type Session } from "next-auth";
import Link from "next/link";
import SignOutButton from "./sign-out-button";

interface UserHeaderProps {
  session: Session | null;
}

export default function UserHeader({ session }: UserHeaderProps) {
  return (
    <header className="fixed left-0 right-0 top-0 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-gray-800">
          Your App Name
        </Link>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="text-gray-600">
                {session.user?.name || session.user?.email}
              </span>
              <SignOutButton />
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
