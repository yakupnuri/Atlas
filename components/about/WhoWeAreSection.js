'use client'

import { motion } from 'framer-motion';

export default function WhoWeAreSection({ content }) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            {content?.title || 'Over Stichting Atlas'}
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="leading-relaxed text-center">
              {content?.content || 'Stichting Atlas is een jonge, dynamische organisatie die in 2024 is opgericht door een groep maatschappelijk betrokken nieuwkomers uit Turkije, woonachtig in Leiden en omliggende gemeenten. De stichting is geworteld in het streven naar een inclusieve, verbonden en vreedzame samenleving waarin culturele diversiteit wordt gewaardeerd en waarin iedereen actief kan deelnemen aan het maatschappelijk leven.'}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
