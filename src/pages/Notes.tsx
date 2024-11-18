import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Code, Database, Brain, ExternalLink } from 'lucide-react';

const notes = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'Deep Learning Fundamentals',
    description: 'A comprehensive guide to neural networks and deep learning architectures.',
    date: '2024-02-15',
    mediumUrl: 'https://medium.com/@yourusername/deep-learning-fundamentals',
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: 'Machine Learning Pipeline Design',
    description: 'Best practices for building scalable ML pipelines and model deployment.',
    date: '2024-02-10',
    mediumUrl: 'https://medium.com/@yourusername/ml-pipeline-design',
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: 'Data Visualization Best Practices',
    description: 'Creating effective and insightful data visualizations for analysis.',
    date: '2024-02-05',
    mediumUrl: 'https://medium.com/@yourusername/data-visualization',
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: 'Natural Language Processing',
    description: 'Advanced techniques for text analysis and language understanding.',
    date: '2024-01-30',
    mediumUrl: 'https://medium.com/@yourusername/nlp-techniques',
  },
];

const Notes = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto px-4 pt-32 pb-16"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 text-transparent bg-clip-text">
          Research Notes
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Exploring ideas and sharing insights in data science and machine learning.
        </p>
      </motion.div>

      <div className="space-y-6">
        {notes.map((note, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-start space-x-4">
              <div className="text-emerald-600 dark:text-emerald-400">
                {note.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    {note.title}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {note.date}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {note.description}
                </p>
                <a
                  href={note.mediumUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Read on Medium
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Notes;