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
    <main className="p-4">
      <div className="flex flex-wrap justify-center w-full">
        {PictureUrls.map((image, index) => (
          <div key={index} className="m-4 text-center max-w-2xl">
            <div className="w-64 mx-auto animate-fadeIn">
              <img
                src={image.url}
                alt={`Image ${index + 1}`}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="m-4 max-w-6xl animate-fadeIn">
              <p
                style={{
                  fontWeight: "bold",
                  fontFamily: "Poppins",
                  fontSize: "40px",
                  color: "#a8dadc",
                  padding: "15px",
                }}
                className="text-sm text-teal-600 mb-2"
              >
                {image.description}
              </p>
              <p
                style={{
                  fontFamily: "hind",
                  fontSize: "20px",
                  color: "#a8dadc",
                }}
                className="text-sm w-full text-teal-600 mb-2"
              >
                {image.description2}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <Link href="/dashboard">
          <button className="rounded-full bg-[#e63946] text-white font-bold py-3 px-10 shadow hover:bg-[#d62839] animate-fadeIn">
            Start Now!
          </button>
        </Link>
      </div>
    </main>
  );
}
