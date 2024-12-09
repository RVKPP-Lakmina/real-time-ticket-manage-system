import { ImagesSlider } from "@/components/ui/images-slider";
import useMainStore from "@/hooks/use-main-store";
import { motion } from "framer-motion";

const movies = [
  { id: 1, title: "Mortal Combat", img: "/mortal-combat.jpg" },
  { id: 2, title: "The Lord Of the Rings", img: "/the-lord-of-the-rings.webp" },
  { id: 3, title: "The Wild Robot", img: "/the-wild-robot.webp" },
  { id: 4, title: "The Batman", img: "/the-batman.jpg" },
  { id: 5, title: "The Avengers", img: "/the-avengers.webp" },
  { id: 6, title: "The Lost City", img: "/the-lost-city.jpg" },
];

const Home = () => {
  const { useRouter } = useMainStore();
  const { push: navigate } = useRouter();

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Movie Slider */}
      <ImagesSlider className="h-[40rem]" images={movies.map(({ img }) => img)}>
        <motion.div
          initial={{
            opacity: 0,
            y: -80,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
          }}
          className="z-50 flex flex-col justify-center items-center"
        >
          <motion.p className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
            WELCOME BACK! <br /> <br /> Cinema Multiverse
          </motion.p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 backdrop-blur-sm border bg-emerald-300/10 border-emerald-500/20 text-white mx-auto text-center rounded-full relative mt-4"
          >
            <span>To the Dashboard →</span>
            <div className="absolute inset-x-0  h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-emerald-500 to-transparent" />
          </button>
        </motion.div>
      </ImagesSlider>

      {/* News Cards */}
      <div className="flex flex-wrap justify-center gap-8 mt-12 p-6">
        {movies.slice(0, 3).map((movie) => (
          <div
            key={movie.id}
            className="bg-gray-800 rounded-lg shadow-md overflow-hidden w-80"
          >
            <img
              src={movie.img}
              alt={movie.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-bold">{movie.title}</h3>
              <p className="text-gray-400 mt-2">Upcoming soon...</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 py-6 mt-auto">
        <div className="container mx-auto text-center text-gray-400">
          &copy; 2024 TicketSim. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
