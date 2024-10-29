import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import { getProviders } from "next-auth/react";
import { redirect } from "next/navigation";

export default async function SignIn() {
  const session = await getServerSession(authOptions);

  // Redirect to home if already signed in
  if (session) {
    redirect("/");
  }

  const providers = await getProviders();

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-8 space-y-4">
            {providers &&
              Object.values(providers).map((provider) => (
                <div key={provider.name} className="text-center">
                  <form
                    action={`/api/auth/signin/${provider.id}`}
                    method="POST"
                  >
                    <button
                      type="submit"
                      className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Sign in with {provider.name}
                    </button>
                  </form>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
