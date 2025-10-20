import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import explosionSoundUrl from "./sounds/massive-explosion-3-397984.mp3";
import fuseSoundUrl from "./sounds/sparkler_fuse_nmwav-14738.mp3";

interface Firecracker {
  id: number;
  x: number;
  y: number;
  rotation: number;
  hasWish: boolean;
  clicked: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  angle: number;
  velocity: number;
}

const diwaliWishes = [
  "✨ May your Diwali glow brighter than a thousand diyas, filling your heart with endless joy and prosperity! 🪔",
  "🌟 Wishing you a Diwali as dazzling as fireworks in the night sky, and as sweet as the festive treats you share! 🍬",
  "💫 May the festival of lights chase away every shadow of worry and illuminate your path with success and peace!",
  "🎆 Happy Diwali! May your dreams sparkle like rangoli colors and your life shine with boundless opportunities!",
  "🌸 Wishing you harmony, happiness, and fortune as radiant as the diyas that light up this sacred night!",
  "🏵️ May this Diwali bring laughter that echoes, love that grows, and blessings that overflow in your home!",
  "🪔 Light up not just your home, but also hearts around you with kindness, joy, and positivity this Diwali!",
  "🌠 May the divine light of Diwali guide you to new beginnings, brighter days, and cherished memories!",
];

function App() {
  const [firecrackers, setFirecrackers] = useState<Firecracker[]>([]);
  const [showWish, setShowWish] = useState(false);
  const [currentWish, setCurrentWish] = useState("");
  const [celebrated, setCelebrated] = useState(false);
  const [burstParticles, setBurstParticles] = useState<{
    [key: number]: Particle[];
  }>({});

  useEffect(() => {
    generateFirecrackers();
  }, []);

  const generateFirecrackers = () => {
    const count = 20;
    const wishCount = Math.floor(Math.random() * 4) + 2;
    const wishIndices = new Set<number>();

    while (wishIndices.size < wishCount) {
      wishIndices.add(Math.floor(Math.random() * count));
    }

    const newFirecrackers: Firecracker[] = [];
    for (let i = 0; i < count; i++) {
      newFirecrackers.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotation: Math.random() * 360,
        hasWish: wishIndices.has(i),
        clicked: false,
      });
    }
    setFirecrackers(newFirecrackers);
  };

  const createBurstEffect = (
    id: number,
    x: number,
    y: number,
    hasWish: boolean
  ) => {
    const particles: Particle[] = [];
    const particleCount = hasWish ? 30 : 15;
    const colors = hasWish
      ? ["#FFD700", "#FFA500", "#FF6347", "#FFFF00", "#FF69B4"]
      : ["#FF0000", "#FF4500", "#FFA500", "#FFFF00"];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        id: i,
        x,
        y,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: (Math.PI * 2 * i) / particleCount,
        velocity: Math.random() * 3 + 2,
      });
    }

    setBurstParticles((prev) => ({ ...prev, [id]: particles }));

    setTimeout(() => {
      setBurstParticles((prev) => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }, 1000);
  };

  const handleFirecrackerClick = (
    firecracker: Firecracker,
    event: React.MouseEvent
  ) => {
    if (firecracker.clicked || celebrated) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    createBurstEffect(firecracker.id, x, y, firecracker.hasWish);

    if (firecracker.hasWish) {
      // Play explosion sound for special firecrackers
      const explosionAudio = new Audio(explosionSoundUrl);
      // explosionAudio.src = "./sounds/massive-explosion-3-397984.mp3";
      explosionAudio.volume = 0.7;

      setCurrentWish(
        diwaliWishes[Math.floor(Math.random() * diwaliWishes.length)]
      );
      setShowWish(true);
      setCelebrated(true);

      // Play audio after a small delay
      setTimeout(() => {
        explosionAudio.play().catch((error) => {
          console.error("Error playing explosion sound:", error);
        });
      }, 100);

      // Auto-reload after 30 seconds of showing Diwali message
      setTimeout(() => {
        window.location.reload();
      }, 30000);
    } else {
      // Play fuse sound for regular firecrackers
      const fuseAudio = new Audio(fuseSoundUrl);
      // fuseAudio.src = "./sounds/sparkler_fuse_nmwav-14738.mp3";
      fuseAudio.volume = 0.5;
      fuseAudio.play().catch((error) => {
        console.error("Error playing fuse sound:", error);
      });
    }

    setFirecrackers((prev) =>
      prev.map((fc) =>
        fc.id === firecracker.id ? { ...fc, clicked: true } : fc
      )
    );
  };

  return (
    <div
      className={`min-h-screen w-full transition-all duration-1000 relative overflow-hidden ${
        celebrated
          ? "bg-gradient-to-br from-orange-400 via-pink-500 to-yellow-400"
          : "bg-gradient-to-b from-indigo-950 via-purple-950 to-indigo-900"
      }`}
    >
      {/* Enhanced moon with crater details and multi-layered glow */}
      <div className="absolute top-10 right-20 w-32 h-32 animate-moon-float">
        <div className="relative w-full h-full">
          {/* Outer glow rings */}
          <div className="absolute inset-0 bg-yellow-200 rounded-full blur-3xl opacity-40 animate-glow-pulse"></div>
          <div
            className="absolute inset-0 bg-yellow-300 rounded-full blur-2xl opacity-30 animate-glow-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>

          {/* Main moon body */}
          <div className="absolute inset-0 bg-gradient-radial from-yellow-100 via-yellow-200 to-yellow-300 rounded-full shadow-[0_0_80px_30px_rgba(255,255,200,0.6)] animate-glow-strong">
            {/* Half shadow for crescent */}
            <div className="absolute left-1/2 top-0 w-1/2 h-full bg-gradient-to-l from-indigo-950 to-transparent rounded-r-full opacity-70"></div>

            {/* Moon craters */}
            <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-gray-400 rounded-full opacity-40"></div>
            <div className="absolute top-1/2 left-1/3 w-4 h-4 bg-gray-400 rounded-full opacity-30"></div>
            <div className="absolute top-2/3 left-1/4 w-2 h-2 bg-gray-400 rounded-full opacity-35"></div>
            <div className="absolute top-1/3 left-2/5 w-5 h-5 bg-gray-400 rounded-full opacity-25"></div>
          </div>

          {/* Sparkle effects around moon */}
          <div className="absolute -top-2 left-1/4 w-2 h-2 bg-white rounded-full animate-sparkle"></div>
          <div
            className="absolute top-1/3 -left-2 w-1.5 h-1.5 bg-white rounded-full animate-sparkle"
            style={{ animationDelay: "0.3s" }}
          ></div>
          <div
            className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-sparkle"
            style={{ animationDelay: "0.6s" }}
          ></div>
        </div>
      </div>

      {/* Twinkling stars */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        {[...Array(120)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-twinkle"
            style={{
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              animationDelay: Math.random() * 3 + "s",
              animationDuration: Math.random() * 4 + 2 + "s",
            }}
          />
        ))}
      </div>

      {/* Fireworks on celebration */}
      {celebrated && (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          {[...Array(150)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-burst"
              style={{
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
                animationDelay: Math.random() * 2 + "s",
                animationDuration: Math.random() * 3 + 2 + "s",
              }}
            >
              <Sparkles
                className="text-yellow-300"
                size={Math.random() * 18 + 12}
                style={{
                  filter: "drop-shadow(0 0 10px rgba(255, 215, 0, 0.9))",
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Burst particles */}
      {Object.entries(burstParticles).map(([id, particles]) => (
        <div key={id} className="fixed inset-0 pointer-events-none z-30">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-3 h-3 rounded-full"
              style={{
                backgroundColor: particle.color,
                boxShadow: `0 0 10px ${particle.color}`,
                left: particle.x,
                top: particle.y,
              }}
              initial={{ scale: 1, opacity: 1 }}
              animate={{
                x: Math.cos(particle.angle) * particle.velocity * 50,
                y: Math.sin(particle.angle) * particle.velocity * 50 + 20,
                scale: 0,
                opacity: 0,
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          ))}
        </div>
      ))}

      {/* Centered heading and wish */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 animate-fadeIn pointer-events-none">
        {celebrated ? (
          <>
            <h1 className="text-6xl font-extrabold text-yellow-300 drop-shadow-xl animate-pulse">
              🎆 Happy Diwali! 🎇
            </h1>
            <p className="text-3xl mt-6 text-white drop-shadow-lg font-semibold animate-scaleIn">
              {currentWish}
            </p>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-yellow-300 mb-4 drop-shadow-lg animate-pulse">
              {/* Find the special firecrackers with Diwali wishes! */}
            </h1>
            <p className="text-4xl font-bold text-orange-200 mt-4 animate-pulse">
              Tap the firecrackers to reveal your Diwali fortune! 🎆
            </p>
          </>
        )}
      </div>

      {/* Enhanced firecrackers with improved movement */}
      {!showWish && (
        <div className="absolute inset-0 overflow-hidden">
          {firecrackers.map((firecracker) => (
            <motion.button
              key={firecracker.id}
              onClick={(e) => handleFirecrackerClick(firecracker, e)}
              disabled={firecracker.clicked}
              className={`absolute transition-all duration-300 z-10 ${
                firecracker.clicked
                  ? "opacity-0 scale-0"
                  : "opacity-100 hover:scale-150 active:scale-75"
              }`}
              animate={{
                x: [
                  0,
                  Math.sin(firecracker.id) * 200,
                  Math.cos(firecracker.id * 2) * 250,
                  Math.sin(firecracker.id * 1.5) * 180,
                  0,
                ],
                y: [
                  0,
                  Math.cos(firecracker.id) * 180,
                  Math.sin(firecracker.id * 2) * 220,
                  Math.cos(firecracker.id * 1.5) * 150,
                  0,
                ],
                rotate: [0, 180, 360, 540, 720],
                scale: [1, 1.1, 0.9, 1.05, 1],
              }}
              transition={{
                duration: 15 + (firecracker.id % 5),
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.25, 0.5, 0.75, 1],
              }}
              style={{
                left: `${firecracker.x}%`,
                top: `${firecracker.y}%`,
              }}
            >
              <div className="relative cursor-pointer">
                <motion.div
                  className={`text-6xl transition-all duration-300 ${
                    firecracker.clicked ? "animate-explode" : ""
                  }`}
                  animate={
                    !firecracker.clicked
                      ? {
                          y: [0, -15, 0],
                          rotate: [-5, 5, -5],
                        }
                      : {}
                  }
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    filter: firecracker.hasWish
                      ? "drop-shadow(0 0 25px rgba(255, 215, 0, 1)) drop-shadow(0 0 15px rgba(255, 215, 0, 0.8))"
                      : "drop-shadow(0 0 12px rgba(255, 0, 0, 0.8))",
                  }}
                >
                  🧨
                </motion.div>
                {/* Glow ring for special firecrackers */}
                {firecracker.hasWish && !firecracker.clicked && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.6, 0.2, 0.6],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      background:
                        "radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, transparent 70%)",
                    }}
                  />
                )}
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* Enhanced animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes twinkle { 0%, 100% { opacity: 0.8; transform: scale(1); } 50% { opacity: 0.3; transform: scale(0.8); } }
        @keyframes burst { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(-100px) scale(0); opacity: 0; } }
        @keyframes explode { 
          0% { transform: scale(1); opacity: 1; } 
          50% { transform: scale(2.5) rotate(180deg); opacity: 0.8; } 
          100% { transform: scale(0) rotate(360deg); opacity: 0; } 
        }
        @keyframes glow-strong { 
          0%, 100% { box-shadow: 0 0 80px 30px rgba(255,255,200,0.7); } 
          50% { box-shadow: 0 0 120px 50px rgba(255,255,150,1); } 
        }
        @keyframes glow-pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.2); opacity: 0.6; }
        }
        @keyframes moon-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-15px) rotate(2deg); }
          50% { transform: translateY(-5px) rotate(0deg); }
          75% { transform: translateY(-20px) rotate(-2deg); }
        }
        @keyframes sparkle {
          0%, 100% { transform: scale(0) rotate(0deg); opacity: 0; }
          50% { transform: scale(1) rotate(180deg); opacity: 1; }
        }

        .animate-fadeIn { animation: fadeIn 0.8s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-twinkle { animation: twinkle infinite ease-in-out; }
        .animate-burst { animation: burst infinite ease-in-out; }
        .animate-explode { animation: explode 0.8s ease-out forwards; }
        .animate-glow-strong { animation: glow-strong 4s ease-in-out infinite alternate; }
        .animate-glow-pulse { animation: glow-pulse 3s ease-in-out infinite; }
        .animate-moon-float { animation: moon-float 6s ease-in-out infinite; }
        .animate-sparkle { animation: sparkle 2s ease-in-out infinite; }

        .bg-gradient-radial {
          background: radial-gradient(circle at 40% 40%, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
}

export default App;
