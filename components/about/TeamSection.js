'use client'

import { motion } from 'framer-motion';
import { Users, User } from 'lucide-react';

export default function TeamSection({ team, loading }) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex items-center justify-center mb-12">
            <Users className="w-12 h-12 text-[#05B6C4] mr-4" />
            <h2 className="text-3xl font-bold text-gray-900">Ons Team</h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#05B6C4] mx-auto"></div>
            </div>
          ) : team && team.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name || 'Team member'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#05B6C4] to-[#3B87BE]"
                      style={{ display: member.photo ? 'none' : 'flex' }}
                    >
                      <User className="w-24 h-24 text-white opacity-80" />
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">
                      {member.name || 'Team Lid'}
                    </h3>
                    <p className="text-sm text-[#05B6C4] font-medium mb-2">
                      {member.role || 'Medewerker'}
                    </p>
                    {member.category && (
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {member.category}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg shadow-md max-w-2xl mx-auto">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Team informatie wordt binnenkort toegevoegd</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
