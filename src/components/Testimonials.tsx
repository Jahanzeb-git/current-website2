import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { BadgeCheck, Quote } from 'lucide-react';

const testimonials = [
  {
    content: "Jahanzeb's expertise in machine learning and data analysis transformed our business intelligence capabilities. His innovative solutions helped us achieve remarkable results.",
    author: "Sarah Chen",
    position: "CTO, TechVision Analytics",
  },
  {
    content: "Working with Jahanzeb was exceptional. His deep understanding of data science and ability to communicate complex concepts clearly made our project a success.",
    author: "Michael Rodriguez",
    position: "Lead Data Scientist, AI Innovations",
  },
  {
    content: "His contributions to our ML infrastructure were invaluable. The solutions he implemented continue to drive efficiency and insights across our organization.",
    author: "Emily Watson",
    position: "Director of Analytics, DataFlow",
  },
];

const Testimonials = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      className="mb-20"
    >
      <h2 className="text-3xl font-bold mb-12 text-gray-800 dark:text-white">
        Client Testimonials
      </h2>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2, // Controls staggered animations
            },
          },
        }}
      >
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            className="relative bg-white/90 dark:bg-gray-800/90 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <Quote className="absolute top-4 right-4 w-8 h-8 text-emerald-500/20" />
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              "{testimonial.content}"
            </p>
            <div className="flex items-center">
              <div>
                <div className="flex items-center">
                  <h3 className="font-semibold text-gray-800 dark:text-white mr-2">
                    {testimonial.author}
                  </h3>
                  <BadgeCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {testimonial.position}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default Testimonials;
