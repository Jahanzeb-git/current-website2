import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Award, Brain, Code, Database, LineChart, Rocket } from 'lucide-react';

const milestones = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: 'Machine Learning',
    progress: 95,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: 'Data Analysis',
    progress: 90,
    color: 'from-teal-500 to-cyan-500',
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: 'Python & R',
    progress: 85,
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: <LineChart className="w-6 h-6" />,
    title: 'Visualization',
    progress: 88,
    color: 'from-blue-500 to-indigo-500',
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    title: 'Deep Learning',
    progress: 82,
    color: 'from-indigo-500 to-purple-500',
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: 'Statistics',
    progress: 92,
    color: 'from-purple-500 to-pink-500',
  },
];

const ProgressMilestones = () => {
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
        Technical Expertise
      </h2>
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg">
        {milestones.map((milestone, index) => (
          <motion.div
            key={index}
            initial={{ x: -50, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : {}}
            transition={{ delay: index * 0.1 }}
            className="mb-6 last:mb-0"
          >
            <div className="flex items-center mb-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white mr-3">
                {milestone.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {milestone.title}
              </h3>
            </div>
            <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={inView ? { width: `${milestone.progress}%` } : {}}
                transition={{
                  duration: 1,
                  ease: 'easeOut',
                  delay: index * 0.2,
                }}
                className={`absolute h-full rounded-full bg-gradient-to-r ${milestone.color}`}
              />
            </div>
            <div className="mt-2 text-right">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {milestone.progress}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default ProgressMilestones;
