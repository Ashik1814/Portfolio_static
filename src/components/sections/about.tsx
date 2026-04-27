import { User } from "lucide-react";

/**
 * About Section Component
 *
 * Displays the portfolio owner's professional profile including avatar,
 * bio, and key statistics. Uses glassmorphism styling consistent with
 * the dark-themed portfolio layout.
 */
export default function About() {
  return (
    <section
      id="about"
      className="min-h-screen flex items-center justify-center px-4 py-20"
    >
      <div className="w-full max-w-5xl">
        {/* ---- Section Heading ---- */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            About Me
          </h2>
          {/* Cyan underline accent */}
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-cyan-400" />
        </div>

        {/* ---- Glassmorphism Card ---- */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-12">
            {/* Left Side — Avatar Placeholder */}
            <div className="flex-shrink-0">
              <div className="flex h-48 w-48 items-center justify-center rounded-full border-2 border-white/10 bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
                <User className="h-20 w-20 text-white/60" />
              </div>
            </div>

            {/* Right Side — Bio Content */}
            <div className="flex flex-1 flex-col gap-6 text-center md:text-left">
              {/* Name */}
              <h3 className="text-3xl font-semibold text-white">Alex Chen</h3>

              {/* Title */}
              <p className="text-lg font-medium text-cyan-400">
                Senior UI/UX Designer &amp; Front-End Developer
              </p>

              {/* Bio Paragraphs */}
              <div className="space-y-4 text-base leading-relaxed text-white/70">
                <p>
                  I&apos;m a passionate designer and developer with over 5 years
                  of experience creating digital products that balance
                  aesthetics with functionality. I thrive at the intersection of
                  design and engineering, turning complex problems into elegant,
                  user-friendly solutions.
                </p>
                <p>
                  My expertise spans design systems, component architecture, and
                  interactive web experiences. I believe that great products are
                  built on a foundation of thoughtful design, clean code, and
                  relentless iteration — and I bring that philosophy to every
                  project I touch.
                </p>
              </div>

              {/* Stats Row */}
              <div className="mt-2 flex flex-wrap justify-center gap-4 md:justify-start">
                <StatCard value="5+" label="Years Experience" />
                <StatCard value="50+" label="Projects Completed" />
                <StatCard value="30+" label="Happy Clients" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * StatCard — Small glassmorphism mini-card for displaying a single statistic.
 *
 * @param value - The highlighted numeric / text value (e.g. "5+")
 * @param label - The descriptive label beneath the value
 */
interface StatCardProps {
  value: string;
  label: string;
}

function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-md">
      <p className="text-xl font-bold text-cyan-400">{value}</p>
      <p className="text-sm text-white/60">{label}</p>
    </div>
  );
}
