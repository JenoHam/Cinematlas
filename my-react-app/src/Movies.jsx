import { motion } from "framer-motion";

function Movies() {
  return (
    <motion.div
      className="min-h-dvh text-white p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      Movies page…
    </motion.div>
  );
}

export default Movies;
