import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useUser } from "@/hooks";
const Home: NextPage = () => {
  const { loading, user, mutate } = useUser();
  const router = useRouter();
  if (loading) {
    return <div>loading</div>;
  }

  const handleLogout = async () => {
    const req = await fetch("/api/auth/logout");
    const res = await req.json();
    await mutate(
      { success: false, error: { message: "Missing user token" } },
      false
    );
  };
  return (
    <main>
      <p></p>
      <div className="container w-full md:max-w-3xl mx-auto pt-20">
        <div className="w-full px-4 md:px-6 text-xl text-gray-800 leading-normal">
          <div className="text-center">
            <h1 className="text-4xl font-bold">
              next.js meta mask login example
            </h1>
          </div>
          <p className="py-6">
            This is an example to demonstrate how to use metamask for
            authentication.
          </p>
          <div className="flex items-center justify-center flex-col">
            {user.success ? (
              <>
                <div>
                  <p>user id: {user.user.id}</p>
                  <p>nonce: {user.user.nonce}</p>
                  <p>publicAddress: {user.user.publicAddress}</p>
                  <p>username: {user.user.username}</p>
                </div>
                <div>
                  <button
                    onClick={handleLogout}
                    className="py-2 mt-20 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-red-600 hover:bg-red-800"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p>error message: {user.error.message}</p>
                </div>
                <button
                  onClick={() => router.push("/login")}
                  className="py-2 mt-20 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800"
                >
                  Go To Login Page
                </button>
              </>
            )}
            <button
              onClick={() => router.push("/profile")}
              className="py-2 mt-20 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-green-600 hover:bg-green-800"
            >
              Go To Profile
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
