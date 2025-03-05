'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function LoadingAnimation() {
    const [isSearching, setIsSearching] = useState(true);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
            <motion.div
                initial={{ y: 0, rotate: 0 }}
                animate={{ y: [0, -30, 0], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="text-6xl"
            >
                🏠
            </motion.div>
            <p className="mt-4 text-lg font-semibold animate-pulse">Suche nach der perfekten Wohnung...</p>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="mt-2 text-sm"
            >
                Bitte warten, das Haus fliegt durch das Internet! 🚀
            </motion.div>
        </div>
    );
}
