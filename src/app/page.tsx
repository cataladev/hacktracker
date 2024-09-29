import Link from "next/link";

const PictureUrls = [
  {
    url: "https://utfs.io/f/6f972ORmLdsFhAQHM5u7PdF3GLyes9zIiBUtnDSvJkRZq1mo",
    title: "HACK TRACKER",
    description: "Find your next hack now!",
  },
];

export default function Home() {
  return (
    <main className="relative p-4 min-h-screen">
      <video
        autoPlay
        muted
        loop
        className="absolute top-0 left-0 z-[-1] w-full h-full object-cover"
      >
        <source src="/spacevideo.webm" type="video/webm" />
      </video>

      <div className="flex flex-wrap justify-center w-full">
        {PictureUrls.map((image, index) => (
          <div key={index} className="m-4 text-center max-w-2xl">
            <div className="w-64 mx-auto animate-fadeIn transform transition duration-300 hover:scale-110">
              <img
                src={image.url}
                alt={`Image ${index + 1}`}
                className="w-full h-auto object-cover"
              />
            </div>
            <div
              className="m-4 max-w-6xl animate-fadeIn border border-black transition duration-300 p-4 bg-black bg-opacity-70 transform hover:scale-110"
            >
              <p
                style={{
                  fontWeight: "bold",
                  fontFamily: "chakra", 
                  fontSize: "65px",
                  color: "#ffffff",
                  padding: "15px",
                }}
                className="text-sm text-white-600 mb-2 animate-fadeIn"
              >
                {image.title}
              </p>
              <p
                style={{
                  fontFamily: "chakra", 
                  fontSize: "25px",
                  color: "#ffffff",
                  padding: "25px",
                }}
                className="text-sm w-full text-white-600 mb-2 animate-fadeIn"
              >
                {image.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <Link href="/profile">
          <button className="rounded-full bg-[#e63946] text-white font-bold py-3 px-10 shadow hover:border-white-600 hover:bg-[#8b0000] animate-fadeIn transform transition duration-300 hover:scale-110">
            Start Now!
          </button>
        </Link>
      </div>
    </main>
  );
}
