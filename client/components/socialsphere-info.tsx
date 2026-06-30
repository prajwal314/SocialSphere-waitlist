import { Heart, Plane, Home, Briefcase, Users, Sparkles } from "lucide-react"

const highlights = [
  { icon: Heart, label: "Friendships", color: "from-rose-500 to-pink-500" },
  { icon: Plane, label: "Travel Buddies", color: "from-blue-500 to-cyan-500" },
  { icon: Home, label: "Roommates", color: "from-amber-500 to-orange-500" },
  { icon: Briefcase, label: "Co-founders", color: "from-purple-500 to-indigo-500" },
  { icon: Users, label: "Activity Partners", color: "from-accent-500 to-emerald-500" },
  { icon: Sparkles, label: "More", color: "from-pink-500 to-rose-500" },
]

export default function SocialSphereInfo() {
  return (
    <section className="relative bg-black py-24 sm:py-32 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Find Your People. <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-purple-400">Not Just More Followers.</span>
          </h2>
          <p className="text-white/50 text-base max-w-2xl mx-auto leading-relaxed">
            SocialSphere is an intent-based social networking platform that helps you discover meaningful connections for real-life experiences.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {highlights.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-white/70 text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-white/40 text-sm leading-relaxed max-w-3xl mx-auto">
            Making friends as an adult is difficult. Moving to a new city feels lonely. Finding travel partners is hard.
            Meeting like-minded people shouldn&apos;t depend on luck. SocialSphere connects you based on shared intent —
            so you can build real relationships that go beyond the screen.
          </p>
        </div>
      </div>
    </section>
  )
}
