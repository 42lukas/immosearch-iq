import { motion } from "framer-motion";
import Link from "next/link";

/*
 * Definiere den Typ für einen einzelnen Link:
 * - href:      Pfad zur Seite
 * - label:     Beschriftung des Links
 * - icon?:     Optionales Icon (react-icons)
*/
export interface NavLink {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface NavbarProps {
  navLinks: NavLink[];
}

export default function Navbar({ navLinks }: NavbarProps) {
  return (
    <motion.header
      className="text-white shadow-md bg-blue-900 p-6 flex justify-between items-center"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="text-xl font-bold tracking-wider"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
      >
        <Link href="/home" className="flex items-center gap-2 hover:opacity-90">
            <img src="favicon.ico" className="w-14 h-14" />
          <span>Immosearch-IQ</span>
        </Link>
      </motion.div>

      <nav className="flex gap-6 text-base font-semibold">
        {navLinks.map((link, index) => {
          const Icon = link.icon;
          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="hover:opacity-90 transition flex items-center gap-1 cursor-pointer"
            >
              {Icon && <Icon className="inline-block" />}
              <Link href={link.href}>{link.label}</Link>
            </motion.div>
          );
        })}
      </nav>
    </motion.header>
  );
}