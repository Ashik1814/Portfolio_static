import { Github, Linkedin, Twitter, Heart } from "lucide-react";

interface SocialLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
}

function SocialLink({ href, icon: Icon, label }: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-white/50 hover:text-cyan-400 transition-colors"
    >
      <Icon className="h-5 w-5" />
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm py-6 px-4 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Left - Copyright */}
        <p className="text-sm text-white/50">
          © 2024 Alex Chen. All rights reserved.
        </p>

        {/* Center - Made with love */}
        <p className="text-sm text-white/50 flex items-center gap-1">
          Made with <Heart className="h-4 w-4 text-red-500 fill-red-500" />{" "}
          and code
        </p>

        {/* Right - Social links */}
        <div className="flex items-center gap-4">
          <SocialLink
            href="https://github.com"
            icon={Github}
            label="GitHub"
          />
          <SocialLink
            href="https://linkedin.com"
            icon={Linkedin}
            label="LinkedIn"
          />
          <SocialLink
            href="https://twitter.com"
            icon={Twitter}
            label="Twitter"
          />
        </div>
      </div>
    </footer>
  );
}
