import { motion } from "framer-motion";

interface MessageProps {
  content: string;
  user: string;
  timestamp: string;
  isOwnMessage: boolean;
}

export default function Message({ content, user, timestamp, isOwnMessage }: MessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: isOwnMessage ? 50 : -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`p-3 rounded-lg ${isOwnMessage ? "bg-primary text-white ml-auto" : "bg-gray-200 text-black mr-auto"}`}
    >
      <p className="text-sm font-semibold">{user}</p>
      <p className="text-md">{content}</p>
      <p className="text-xs text-right opacity-70">{timestamp}</p>
    </motion.div>
  );
}
