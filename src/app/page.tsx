import UserHeader from "@/components/user-header";
import { getServerAuthSession } from "@/server/auth";
import Link from "next/link";

export default async function HomePage() {
  const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      {/* User Header */}
      <div className="w-full bg-white/10 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <UserHeader session={session} />
          <div>
            {session ? (
              <Link
                href="/api/auth/signout"
                className="rounded-lg bg-white/10 px-4 py-2 font-semibold hover:bg-white/20"
              >
                Sign out
              </Link>
            ) : (
              <Link
                href="/signin"
                className="rounded-lg bg-white/10 px-4 py-2 font-semibold hover:bg-white/20"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Existing content */}
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            href="https://create.t3.gg/en/usage/first-steps"
            target="_blank"
          >
            <h3 className="text-2xl font-bold">First Steps →</h3>
            <div className="text-lg">
              Just the basics - Everything you need to know to set up your
              database and authentication.
            </div>
          </Link>
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            href="https://create.t3.gg/en/introduction"
            target="_blank"
          >
            <h3 className="text-2xl font-bold">Documentation →</h3>
            <div className="text-lg">
              Learn more about Create T3 App, the libraries it uses, and how to
              deploy it.
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}