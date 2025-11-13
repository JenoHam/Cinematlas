import { useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";

const VideoBackground = ({ pulseTrigger }) => {
  const controls = useAnimationControls();

  useEffect(() => {
    // skip the very first render
    if (!pulseTrigger) return;

    controls.start({
      scale: [1, 1.18, 1.02, 1],
      transition: {
        duration: 1.6,
        times: [0, 0.45, 0.75, 1],
        ease: "easeOut",
      },
    });
  }, [pulseTrigger, controls]);

  return (
    <motion.div
      className="fixed inset-0 -z-10 origin-center"
      initial={{ scale: 1 }}
      animate={controls}
    >
      <video
        src="/videos/trailers.mp4" // your public/videos file
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/25" />
    </motion.div>
  );
};

export default VideoBackground;

