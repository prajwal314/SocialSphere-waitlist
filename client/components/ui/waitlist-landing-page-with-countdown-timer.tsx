import React, { useState, useEffect, useRef, FormEvent } from "react"
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  QuadraticBezierCurve3,
  Vector3,
  TubeGeometry,
  ShaderMaterial,
  Mesh,
  AdditiveBlending,
  DoubleSide,
} from "three"
import { joinWaitlist } from "@/lib/api"
import { Loader2, AlertCircle, PartyPopper, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border border-white/20 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/50 backdrop-blur-sm",
          "focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium",
          "h-12 px-6 bg-red-600 hover:bg-red-700 text-white",
          "transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
          "disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export function WaitlistExperience() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<Scene>()
  const rendererRef = useRef<WebGLRenderer>()
  const animationIdRef = useRef<number>()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [timeLeft, setTimeLeft] = useState({
    days: 225,
    hours: 23,
    minutes: 17,
    seconds: 58,
  })

  // Three.js background effect
  useEffect(() => {
    if (!mountRef.current) return

    const scene = new Scene()
    sceneRef.current = scene

    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

    const renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
    })
    rendererRef.current = renderer

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 1)
    mountRef.current.appendChild(renderer.domElement)

    const curve = new QuadraticBezierCurve3(
      new Vector3(-15, -4, 0),
      new Vector3(2, 3, 0),
      new Vector3(18, 0.8, 0)
    )

    const tubeGeometry = new TubeGeometry(curve, 200, 0.8, 32, false)

    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `

    const fragmentShader = `
      uniform float time;
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        vec3 color1 = vec3(1.0, 0.2, 0.1);
        vec3 color2 = vec3(0.8, 0.1, 0.6);
        vec3 color3 = vec3(0.4, 0.05, 0.8);
        
        vec3 finalColor = mix(color1, color2, vUv.x);
        finalColor = mix(finalColor, color3, vUv.x * 0.7);
        
        float glow = 1.0 - abs(vUv.y - 0.5) * 2.0;
        glow = pow(glow, 2.0);
        
        float fade = 1.0;
        if (vUv.x > 0.85) {
          fade = 1.0 - smoothstep(0.85, 1.0, vUv.x);
        }
        
        float pulse = sin(time * 2.0) * 0.1 + 0.9;
        
        gl_FragColor = vec4(finalColor * glow * pulse * fade, glow * fade * 0.8);
      }
    `

    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
      },
      transparent: true,
      blending: AdditiveBlending,
      side: DoubleSide,
    })

    const lightStreak = new Mesh(tubeGeometry, material)
    scene.add(lightStreak)

    const glowGeometry = new TubeGeometry(curve, 200, 1.5, 32, false)
    const glowMaterial = new ShaderMaterial({
      vertexShader,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vec3 color1 = vec3(1.0, 0.3, 0.2);
          vec3 color2 = vec3(0.6, 0.2, 0.8);
          
          vec3 finalColor = mix(color1, color2, vUv.x);
          
          float glow = 1.0 - abs(vUv.y - 0.5) * 2.0;
          glow = pow(glow, 4.0);
          
          float fade = 1.0;
          if (vUv.x > 0.85) {
            fade = 1.0 - smoothstep(0.85, 1.0, vUv.x);
          }
          
          float pulse = sin(time * 1.5) * 0.05 + 0.95;
          
          gl_FragColor = vec4(finalColor * glow * pulse * fade, glow * fade * 0.3);
        }
      `,
      uniforms: {
        time: { value: 0 },
      },
      transparent: true,
      blending: AdditiveBlending,
      side: DoubleSide,
    })

    const glowLayer = new Mesh(glowGeometry, glowMaterial)
    scene.add(glowLayer)

    camera.position.z = 7
    camera.position.y = -0.8

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)

      const time = Date.now() * 0.001
      material.uniforms.time.value = time
      glowMaterial.uniforms.time.value = time

      lightStreak.rotation.z = Math.sin(time * 0.2) * 0.05
      glowLayer.rotation.z = Math.sin(time * 0.2) * 0.05

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      if (!camera || !renderer) return

      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)

      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }

      renderer.dispose()
      tubeGeometry.dispose()
      glowGeometry.dispose()
      material.dispose()
      glowMaterial.dispose()
    }
  }, [])

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev

        if (seconds > 0) {
          seconds--
        } else if (minutes > 0) {
          minutes--
          seconds = 59
        } else if (hours > 0) {
          hours--
          minutes = 59
          seconds = 59
        } else if (days > 0) {
          days--
          hours = 23
          minutes = 59
          seconds = 59
        }

        return { days, hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name.trim()) {
      setError("Please enter your name")
      return
    }
    if (!email.trim()) {
      setError("Please enter your email")
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address")
      return
    }

    setLoading(true)
    try {
      await joinWaitlist(name.trim(), email.trim())
      setIsSubmitted(true)
      setName("")
      setEmail("")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong"
      if (message.toLowerCase().includes("already")) {
        setIsSubmitted(true)
      } else {
        setError(message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black w-full">
      <div ref={mountRef} className="fixed inset-0 w-full h-full" style={{ zIndex: 0 }} />

      <div className="relative z-10 min-h-screen">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="relative">
            <div className="relative backdrop-blur-xl bg-black/60 border border-white/20 rounded-3xl p-8 w-[420px] shadow-2xl">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

              <div className="relative z-10">
                {!isSubmitted ? (
                  <>
                    <div className="mb-8 text-center">
                      <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
                        Join the <span className="text-red-400">Waitlist</span>
                      </h1>
                      <p className="text-white/60 text-sm leading-relaxed">
                        SocialSphere helps you connect with people for real-life experiences — friends, travel, business, activities and more.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mb-6 space-y-3">
                      <Input
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => { setName(e.target.value); setError("") }}
                        required
                      />
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError("") }}
                        required
                      />
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-lg shadow-red-500/20 disabled:opacity-60"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Joining...
                          </>
                        ) : (
                          "Get Notified"
                        )}
                      </Button>
                    </form>

                    {error && (
                      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-900/30 border border-red-500/30 text-red-300 text-sm mb-4" role="alert">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-center gap-3 mb-6">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-black/40 flex items-center justify-center text-white text-xs font-medium">
                          J
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-black/40 flex items-center justify-center text-white text-xs font-medium">
                          A
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-black/40 flex items-center justify-center text-white text-xs font-medium">
                          M
                        </div>
                      </div>
                      <span className="text-white/50 text-sm">
                        <Users className="w-3 h-3 inline mr-1" />
                        ~2k+ already joined
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-6 text-center">
                      <div>
                        <div className="text-2xl font-light text-white">{timeLeft.days}</div>
                        <div className="text-xs text-white/50 uppercase tracking-wide">days</div>
                      </div>
                      <div className="text-white/30">|</div>
                      <div>
                        <div className="text-2xl font-light text-white">{timeLeft.hours}</div>
                        <div className="text-xs text-white/50 uppercase tracking-wide">hours</div>
                      </div>
                      <div className="text-white/30">|</div>
                      <div>
                        <div className="text-2xl font-light text-white">{timeLeft.minutes}</div>
                        <div className="text-xs text-white/50 uppercase tracking-wide">minutes</div>
                      </div>
                      <div className="text-white/30">|</div>
                      <div>
                        <div className="text-2xl font-light text-white">{timeLeft.seconds}</div>
                        <div className="text-xs text-white/50 uppercase tracking-wide">seconds</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-400/20 to-emerald-500/20 flex items-center justify-center border border-green-400/30">
                      <PartyPopper className="w-10 h-10 text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">You're on the list!</h3>
                    <p className="text-white/60 text-sm">We'll notify you when SocialSphere launches. Thanks for joining!</p>
                  </div>
                )}
              </div>

              <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-transparent via-white/[0.02] to-white/[0.05] pointer-events-none" />
            </div>

            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-red-500/10 to-purple-600/10 blur-xl scale-110 -z-10" />
          </div>
        </div>
      </div>
    </main>
  )
}
