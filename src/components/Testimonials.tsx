import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { BadgeCheck, Quote, Star } from 'lucide-react';

const testimonials = [
  {
    content: "Jahanzeb's expertise in machine learning and data analysis transformed our business intelligence capabilities. His innovative solutions helped us achieve remarkable results.",
    author: "Sarah Chen",
    position: "CTO, TechVision Analytics",
    rating: 5,
    avatar: "SC"
  },
  {
    content: "Working with Jahanzeb was exceptional. His deep understanding of data science and ability to communicate complex concepts clearly made our project a success.",
    author: "Michael Rodriguez",
    position: "Lead Data Scientist, AI Innovations",
    rating: 5,
    avatar: "MR"
  },
  {
    content: "His contributions to our ML infrastructure were invaluable. The solutions he implemented continue to drive efficiency and insights across our organization.",
    author: "Emily Watson",
    position: "Director of Analytics, DataFlow",
    rating: 5,
    avatar: "EW"
  },
];

const Testimonials = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '-50px 0px',
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 40, 
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      }
    },
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent mb-4">
            Client Testimonials
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Hear what industry leaders say about working with me
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -8, 
                transition: { duration: 0.2 } 
              }}
              className="group relative"
            >
              {/* Card */}
              <div className="relative h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Quote Icon */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl shadow-lg flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                  <Quote className="w-6 h-6 text-white" />
                </div>

                {/* Rating Stars */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-4 h-4 fill-current text-yellow-400" 
                    />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 text-sm sm:text-base">
                  "{testimonial.content}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm mr-4 shadow-md">
                    {testimonial.avatar}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate mr-2">
                        {testimonial.author}
                      </h3>
                      <BadgeCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                      {testimonial.position}
                    </p>
                  </div>
                </div>

                {/* Bottom Accent */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;