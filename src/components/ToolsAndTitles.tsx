import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Python, Database, BarChart2, Cpu, GitHub, Cloud } from 'lucide-react';

const tools = [
  {
    icon: <Python className="w-8 h-8" />,
    title: 'Python',
    description: 'Versatile programming language for data science.',
  },
  {
    icon: <Database className="w-8 h-8" />,
    title: 'SQL',
    description: 'Database management and data manipulation.',
  },
  {
    icon: <BarChart2 className="w-8 h-8" />,
    title: 'Tableau',
    description: 'Data visualization and business intelligence tool.',
  },
  {
    icon: <Cpu className="w-8 h-8" />,
    title: 'TensorFlow',
    description: 'Open-source library for machine learning.',
  },
  {
    icon: <GitHub className="w-8 h-8" />,
    title: 'GitHub',
    description: 'Version control and collaboration platform.',
  },
  {
    icon: <Cloud className="w-8 h-8" />,
    title: 'AWS',
    description: 'Cloud computing services for scalable solutions.',
  },
];

const ToolsAndTitles = () => {
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
        Tools & Technologies
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map((tool, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: index * 0.1 }}
            className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-xl shadow-lg flex items-center space-x-4"
          >
            <div className="p-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
              {tool.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {tool.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {tool.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default ToolsAndTitles;
