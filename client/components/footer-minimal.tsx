import { Sparkles, Instagram, Twitter, Github } from "lucide-react"

const socials = [
  { icon: Twitter, href: "https://twitter.com/socialspherenow", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com/socialspherenow", label: "Instagram" },
  { icon: Github, href: "https://github.com/socialspherenow", label: "GitHub" },
]

export default function MinimalFooter() {
  return (
    <footer className="relative bg-black border-t border-white/5 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white/80 text-sm font-semibold">SocialSphere</span>
          </div>

          <div className="flex items-center gap-6">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="text-white/30 hover:text-white/60 transition-colors"
              >
                <s.icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          <p className="text-white/20 text-xs">&copy; {new Date().getFullYear()} SocialSphere. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
