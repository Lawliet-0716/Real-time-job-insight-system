import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TeamAbout from "../../components/shared/TeamAbout";

export const metadata = {
  title: "About the team | CareerWise",
  description: "Meet the team behind CareerWise.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-[#20364a]">
      <header className="border-b border-[#e1e7eb] bg-white">
        <div className="mx-auto flex w-full max-w-[1400px] items-center px-5 py-5 sm:px-8 lg:px-12">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="CareerWise"
              width={180}
              height={54}
              priority
              className="h-14 w-auto object-contain object-left"
            />
          </Link>
          <Link
            href="/"
            className="ml-auto inline-flex items-center gap-2 text-sm font-semibold text-[var(--ink-muted)] transition hover:text-[var(--leaf)]"
          >
            Back to home <ArrowLeft size={16} />
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-3xl border-b border-[#e1e7eb] pb-16 text-center sm:pb-20">
          <p className="text-sm font-medium text-[#42617b]">About CareerWise</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.06em] sm:text-6xl">
            Helping people make clearer, more confident career moves.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#61778a] sm:text-lg">
            CareerWise brings your resume, the changing job market, and your
            next learning step into one focused workspace. We built it to make
            career planning feel practical, personal, and easier to act on.
          </p>
        </div>

        <div className="mt-16 sm:mt-20">
          <TeamAbout />
        </div>
      </section>

      <footer className="border-t border-[#e1e7eb] px-5 py-5 text-center text-xs text-[#61778a] sm:px-8 lg:px-12">
        © 2026 CareerWise. All rights reserved.
      </footer>
    </main>
  );
}
