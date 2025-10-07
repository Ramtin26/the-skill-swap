import Link from "next/link";
import Image from "next/image";
import image1 from "@/public/about-1.jpg";
import image2 from "@/public/about-2.jpg";

export const metadata = {
  title: "About",
};

export default function Page() {
  return (
    <div className="grid gap-y-16 gap-x-10 p-4 sm:p-6 md:p-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-5 text-base sm:text-lg items-stretch">
      <div className="lg:col-span-3 space-y-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl mb-6 sm:mb-8 text-accent-400 font-medium">
          Welcome to the Skill Swap
        </h1>

        <div className="space-y-6 sm:space-y-8 text-primary-200">
          <p>
            SkillSwap is a modern job marketplace designed to bridge the gap
            between talented professionals and forward-thinking employers.
            Whether you&apos;re searching for your next career move or looking
            for the perfect candidate to join your team, SkillSwap makes the
            process simple, efficient, and enjoyable.
          </p>
          <p>
            From creating detailed job posts to discovering opportunities
            tailored to your skills, the platform offers a smooth, intuitive
            experience. Job seekers can explore openings, save interesting
            positions, and apply directly — while employers can manage
            applications, review candidate profiles, and make quick hiring
            decisions.
          </p>
          <p>
            By combining a clean design, powerful search tools, and real-time
            application tracking, SkillSwap transforms job hunting and
            recruiting into a connected, engaging journey for everyone involved.
          </p>
        </div>
      </div>

      <div className="lg:col-span-2">
        <Image
          src={image1}
          alt="Modern office in a city"
          placeholder="blur"
          quality={80}
          className="w-full h-auto rounded-lg"
        />
      </div>

      <div className="lg:col-span-2">
        <Image
          src={image2}
          alt="employees taking a selfie outside an office"
          placeholder="blur"
          quality={80}
          className="w-full h-auto rounded-lg"
        />
      </div>

      <div className="lg:col-span-3 space-y-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl mb-6 sm:mb-8 text-accent-400 font-medium">
          The Vision Behind the Platform
        </h1>

        <div className="space-y-6 sm:space-y-8 text-primary-200">
          <p>
            The vision behind SkillSwap is rooted in the belief that
            opportunities should be accessible, and talent should never go
            unnoticed. Designing this application was about more than just
            building features — it was about creating a digital space where
            people can take meaningful steps toward their goals.
          </p>
          <p>
            At its core, SkillSwap is designed to empower people, encourage
            professional networking, and make the process of hiring and job
            seeking a collaborative experience, rather than a transactional one.
            Every interaction — from a job application to an acceptance
            notification — is a moment of growth and connection.
          </p>

          <div className="text-center md:text-left">
            <Link
              href="/jobs"
              className="inline-block mt-4 bg-accent-500 px-4 py-3 sm:px-8 sm:py-4 text-primary-800 text-sm sm:text-base md:text-lg font-semibold hover:bg-accent-600 transition-colors rounded-lg cursor-pointer whitespace-nowrap"
            >
              Explore our professional app
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
