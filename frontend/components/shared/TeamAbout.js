import Image from "next/image";

const teamMembers = [
  {
    name: "Adithya S",
    role: "Frontend & Backend Developer",
    bio: "Led the end-to-end development of CareerWise, bringing together a thoughtful user experience and the backend systems that power it.",
    mark: "AS",
    portrait: null,
  },
  {
    name: "Lepaksh S Gujar",
    role: "Backend Developer",
    bio: "Built and supported the server-side foundation, helping shape reliable APIs, data flows, and the services behind the platform.",
    mark: "LG",
    portrait: null,
  },
  {
    name: "Charan G",
    role: "Research & Analysis",
    bio: "Turned research and analysis into useful direction, helping the team understand the career landscape and build with purpose.",
    mark: "CG",
    portrait: null,
  },
  {
    name: "Achuta S",
    role: "Reports & Team Support",
    bio: "Strengthened the project through report preparation, documentation, and the practical team support that keeps ideas moving forward.",
    mark: "AS",
    portrait: null,
  },
];

export default function TeamAbout() {
  return (
    <section
      id="about"
      aria-labelledby="about-team-title"
      className="text-[#20364a]"
    >
      <div className="text-center">
        <p className="text-sm font-medium text-[#42617b]">People</p>
        <h2
          id="about-team-title"
          className="mt-3 text-4xl font-semibold tracking-[-0.06em] sm:text-5xl"
        >
          The people behind CareerWise.
        </h2>
      </div>
      <div className="mt-16 space-y-20 sm:mt-20 sm:space-y-24">
        {teamMembers.map(({ name, role, bio, mark, portrait }) => (
          <article
            key={name}
            className="grid items-center gap-10 border-t border-[#dce3e8] pt-10 md:grid-cols-[280px_minmax(0,560px)] md:justify-center md:gap-20 md:pt-12"
          >
            <div className="text-center">
              {portrait ? (
                <Image
                  src={portrait}
                  alt={`${name} portrait`}
                  width={256}
                  height={256}
                  className="mx-auto h-56 w-56 rounded-full object-cover grayscale sm:h-64 sm:w-64"
                />
              ) : (
                <div
                  aria-label={`${name} portrait placeholder`}
                  className="mx-auto flex h-56 w-56 items-center justify-center rounded-full bg-[#e7edf0] text-4xl font-semibold text-[#42617b] sm:h-64 sm:w-64"
                >
                  {mark}
                </div>
              )}
              <h3 className="mt-5 text-xl font-medium">{name}</h3>
              <p className="mt-2 text-sm text-[#61778a]">{role}</p>
            </div>
            <div className="max-w-xl text-base leading-7 text-[#30485d] sm:text-lg">
              <p>{bio}</p>
              <p className="mt-6">
                Contributing with care, curiosity, and a shared commitment to
                making the next career step easier to understand.
              </p>
              <p className="mt-7 text-sm text-[#61778a]">
                CareerWise team member
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
