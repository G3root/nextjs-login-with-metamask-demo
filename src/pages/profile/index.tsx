import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <main>
      <div className="container w-full md:max-w-3xl mx-auto pt-20">
        <div className="w-full px-4 md:px-6 text-xl text-gray-800 leading-normal">
          <div className="text-center">
            <h1 className="text-4xl font-bold">
              only authenticated can access
            </h1>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
