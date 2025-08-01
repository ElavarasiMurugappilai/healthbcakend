import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const insights = [
  {
    icon: "🍚",
    title: "Sugar Spike",
    summary: "After lunch this week",
    details: "Your blood sugar spiked by 30% after lunch. Recommendation: Try a lighter lunch and monitor your intake.",
    gradient: "from-[#fceabb] to-[#f8b500]"
  },
  {
    icon: "😴",
    title: "Sleep Trend",
    summary: "Longer on weekends",
    details: "You sleep 1.5 hours longer on weekends. Try to keep a consistent sleep schedule for better rest.",
    gradient: "from-[#c2e9fb] to-[#81a4fd]"
  },
  {
    icon: "❤️",
    title: "Heart Rate",
    summary: "Higher on Fridays",
    details: "Your average heart rate is 8 bpm higher on Fridays. Consider stress-reducing activities.",
    gradient: "from-[#fbc2eb] to-[#a6c1ee]"
  },
  {
    icon: "👟",
    title: "Step Peak",
    summary: "Saturday steps peaked",
    details: "You reached 9,200 steps on Saturday. Great job! Aim for 8,000+ steps daily.",
    gradient: "from-[#f5f7fa] to-[#c3cfe2]"
  },
];

const FlipCard = ({ icon, title, summary, details, gradient, flipped, setFlipped, animateKey, direction }: any) => (
  <motion.div
    key={animateKey}
    className="w-full h-56 cursor-pointer"
    onClick={() => setFlipped((f: boolean) => !f)}
    tabIndex={0}
    onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setFlipped((f: boolean) => !f)}
    aria-label={`Flip card for ${title}`}
    initial={{ opacity: 0, x: direction > 0 ? 300 : -300 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: direction > 0 ? -300 : 300 }}
    transition={{ duration: 0.5, ease: "easeInOut" }}
  >
    <motion.div
      className="relative w-full h-full"
      animate={{ rotateY: flipped ? 180 : 0 }}
      transition={{ duration: 0.6 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Front */}
      <Card
        className={`absolute inset-0 flex flex-col items-center justify-center rounded-xl shadow-xl bg-gradient-to-br ${gradient} text-gray-900 dark:text-gray-100 transition-all duration-300 select-none dark:bg-gradient-to-br dark:from-[#23272f] dark:to-[#1a1d23]`}
        style={{ backfaceVisibility: "hidden" }}
      >
        <span className="text-4xl mb-2">
          {icon}
        </span>
        <div className="font-bold text-lg mb-1">{title}</div>
        <div className="text-sm text-gray-700 dark:text-gray-200 text-center">{summary}</div>
        <div className="mt-4 text-xs text-black dark:text-black-200">Click to see more</div>
      </Card>
      {/* Back */}
      <Card
        className={`absolute inset-0 flex flex-col items-center justify-center rounded-xl shadow-xl bg-gradient-to-br ${gradient} text-gray-900 dark:text-gray-100 transition-all duration-300 select-none dark:bg-gradient-to-br dark:from-[#23272f] dark:to-[#1a1d23]`}
        style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
      >
        <div className="font-bold text-lg mb-2">{title} Details</div>
        <div className="text-base text-center px-2 text-black dark:text-gray-200">{details}</div>
        <div className="mt-4 text-xs text-black dark:text-black-800">Click to flip back</div>
      </Card>
    </motion.div>
  </motion.div>
);

const useResponsiveCards = () => {
  // 1 card on mobile, 2 on desktop
  const [isMobile, setIsMobile] = useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile ? 1 : 2;
};

const AI: React.FC = () => {
  const cardsPerView = useResponsiveCards();
  const [startIdx, setStartIdx] = useState(0);
  const [flippedStates, setFlippedStates] = useState(Array(insights.length).fill(false));
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
  const endIdx = Math.min(startIdx + cardsPerView, insights.length);
  const canPrev = startIdx > 0;
  const canNext = endIdx < insights.length;

  const handlePrev = () => {
    setDirection(-1);
    setStartIdx(idx => Math.max(0, idx - cardsPerView));
  };
  const handleNext = () => {
    setDirection(1);
    setStartIdx(idx => Math.min(insights.length - cardsPerView, idx + cardsPerView));
  };

  // Reset flip state when cards change
  React.useEffect(() => {
    setFlippedStates(Array(insights.length).fill(false));
  }, [startIdx, cardsPerView]);

  const setFlipped = (idx: number) => (val: boolean | ((f: boolean) => boolean)) => {
    setFlippedStates(prev => {
      const arr = [...prev];
      arr[startIdx + idx] = typeof val === 'function' ? val(arr[startIdx + idx]) : val;
      return arr;
    });
  };

  return (
    <div className="w-full mt-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center text-2xl font-bold mb-6 flex items-center justify-center gap-2">
          <span>🤖</span> AI Insights
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-items-center">
          <AnimatePresence mode="wait" initial={false}>
            {insights.slice(startIdx, endIdx).map((insight, i) => (
              <FlipCard
                key={startIdx + i}
                animateKey={startIdx + i}
                {...insight}
                flipped={flippedStates[startIdx + i]}
                setFlipped={setFlipped(i)}
                direction={direction}
              />
            ))}
          </AnimatePresence>
        </div>
        <div className="flex justify-center gap-4 mt-6">
          <Button onClick={handlePrev} disabled={!canPrev} variant="secondary" size="sm" aria-label="Previous insights">
            Previous
          </Button>
          <Button onClick={handleNext} disabled={!canNext} variant="secondary" size="sm" aria-label="Next insights">
            Next
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default AI; 