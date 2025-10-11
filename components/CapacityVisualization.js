'use client'

import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

export default function CapacityVisualization({ capacity, reserved }) {
  const available = capacity - reserved;
  const percentage = (reserved / capacity) * 100;
  
  // Create array of seats
  const seats = Array.from({ length: Math.min(capacity, 50) }, (_, i) => {
    const isReserved = i < (reserved / capacity) * Math.min(capacity, 50);
    return { id: i, isReserved };
  });

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Users className="w-5 h-5 text-[#05B6C4]" />
          Beschikbaarheid
        </h3>
        <div className="text-right">
          <p className="text-2xl font-bold text-[#05B6C4]">{available}</p>
          <p className="text-sm text-gray-600">plaatsen vrij</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-[#05B6C4] to-[#3B87BE] rounded-full"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
        <div>
          <p className="text-sm text-gray-600">Totaal</p>
          <p className="text-xl font-bold text-gray-800">{capacity}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Gereserveerd</p>
          <p className="text-xl font-bold text-[#F7941D]">{reserved}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Beschikbaar</p>
          <p className="text-xl font-bold text-green-600">{available}</p>
        </div>
      </div>

      {/* Seat Visualization */}
      <div className="grid grid-cols-10 gap-2">
        {seats.map((seat) => (
          <motion.div
            key={seat.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: seat.id * 0.01 }}
            className={`aspect-square rounded-lg flex items-center justify-center ${
              seat.isReserved
                ? 'bg-[#F7941D] text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            <Users className="w-3 h-3" />
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#F7941D] rounded"></div>
          <span className="text-gray-600">Gereserveerd</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <span className="text-gray-600">Beschikbaar</span>
        </div>
      </div>
    </div>
  );
}
