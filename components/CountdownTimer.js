'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const TimeUnit = ({ value, label }) => (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center"
    >
      <motion.div
        key={value}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="bg-gradient-to-br from-[#05B6C4] to-[#3B87BE] text-white rounded-lg p-4 min-w-[80px] shadow-lg"
      >
        <span className="text-3xl font-bold">{String(value).padStart(2, '0')}</span>
      </motion.div>
      <span className="text-sm text-gray-600 mt-2 font-medium">{label}</span>
    </motion.div>
  );

  return (
    <div className="flex justify-center gap-4 py-6">
      <TimeUnit value={timeLeft.days} label="Dagen" />
      <TimeUnit value={timeLeft.hours} label="Uren" />
      <TimeUnit value={timeLeft.minutes} label="Minuten" />
      <TimeUnit value={timeLeft.seconds} label="Seconden" />
    </div>
  );
}
