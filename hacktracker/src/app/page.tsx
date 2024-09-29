import Link from "next/link";

const PictureUrls = [
  {
    url: "https://utfs.io/f/6f972ORmLdsFhAQHM5u7PdF3GLyes9zIiBUtnDSvJkRZq1mo",
    title: "HACK TRACKER",
    description: "HACK TRACKER",
    description2:
      "Are you ready to unleash your creativity and technical skills? Our platform connects you with hackathons tailored just for you! By analyzing your location, educational background, and interests, we curate a list of exciting hackathon events where you can collaborate with like-minded individuals, innovate groundbreaking solutions, and take your skills to the next level. Whether you're a seasoned developer, a design enthusiast, or a first-time participant, we have opportunities that fit your profile. Join us to network with industry leaders, showcase your talents, and even win fantastic prizes! Your next big challenge is just a click away—lets hack the future together!",
  },
];

export default function Home() {
  return (
    <main className="relative p-4">
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
               className="m-4 max-w-6xl animate-fadeIn border border-black hover:border-red-600 transition duration-300 p-4 bg-black bg-opacity-70 transform hover:scale-110">
              <p
                style={{
                  fontWeight: "bold",
                  fontFamily: "Poppins",
                  fontSize: "40px",
                  color: "#ffffff",
                  padding: "15px",
                }}
                className="text-sm text-white-600 mb-2 animate-fadeIn"
              >
                {image.description}
              </p>
              <p
                style={{
                  fontFamily: "hind",
                  fontSize: "20px",
                  color: "#ffffff",
                }}
                className="text-sm w-full text-white-600 mb-2 animate-fadeIn"
              >
                {image.description2}
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