import Link from "next/link";
import Image from "next/image";
import image1 from "@/public/about-1.jpg";
import image2 from "@/public/about-2.jpg";

export const metadata = {
  title: "About",
};

export default function Page() {
  return (
    <div className="grid grid-cols-5 gap-x-24 gap-y-32 text-lg items-center">
      <div className="col-span-3">
        <h1 className="text-4xl mb-10 text-accent-400 font-medium">
          Welcome to the Skill Swap
        </h1>

        <div className="space-y-8">
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

      <div className="col-span-2">
        <Image
          src={image1}
          alt="an office in the middle of a city"
          placeholder="blur"
          quality={80}
        />
      </div>

      <div className="col-span-2">
        <Image
          src={image2}
          placeholder="blur"
          quality={80}
          alt="employees taking a selfie"
        />
      </div>

      <div className="col-span-3">
        <h1 className="text-4xl mb-10 text-accent-400 font-medium">
          The Vision Behind the Platform
        </h1>

        <div className="space-y-8">
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

          <div>
            <Link
              href="/jobs"
              className="inline-block mt-4 bg-accent-500 px-8 py-5 text-primary-800 text-lg font-semibold hover:bg-accent-600 transition-all"
            >
              Explore our professional app
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
