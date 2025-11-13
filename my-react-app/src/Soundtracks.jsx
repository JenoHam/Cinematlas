import { motion } from "framer-motion";

function Soundtracks() {
  return (
    <motion.div
      className="min-h-dvh text-white p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      Soundtracks page…
    </motion.div>
  );
}

export default Soundtracks;
