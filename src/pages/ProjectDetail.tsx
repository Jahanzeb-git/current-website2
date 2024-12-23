import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import React, { useState } from 'react';
import {
  Code2,
  ExternalLink,
  Github,
  LineChart,
  Database,
  Layers,
  ArrowRight,
  Brain,
  AlertCircle,
  Rocket,
} from 'lucide-react';
import DetailPopup from '../components/DetailPopup';

const technologies = [
  { name: 'Python', category: 'Language' },
  { name: 'TensorFlow', category: 'Framework' },
  { name: 'Scikit-learn', category: 'Library' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'Docker', category: 'Tool' },
  { name: 'AWS', category: 'Cloud' },
];

const metrics = [
  { label: 'Model Accuracy', value: '95%' },
  { label: 'Data Points', value: '50K+' },
  { label: 'Processing Time', value: '<2s' },
  { label: 'API Uptime', value: '99.9%' },
];

const approachContent = {
  'Data Collection': {
    description: 'Our comprehensive data collection process involves gathering and validating real estate data from multiple authoritative sources to ensure the highest quality input for our prediction model.',
    details: [
      'Integration with Multiple Listing Service (MLS) databases for real-time property listings',
      'Public records and tax assessor data collection for historical property information',
      'Demographic and neighborhood data aggregation from census and local sources',
      'Economic indicators and market trends from financial institutions'
    ],
    benefits: [
      'Comprehensive dataset covering all relevant property aspects',
      'Real-time data updates for accurate predictions',
      'High-quality, validated data sources',
      'Rich historical context for trend analysis'
    ]
  },
  'Model Development': {
    description: 'Our sophisticated model development approach combines cutting-edge machine learning techniques with domain expertise to create a robust and accurate prediction system.',
    details: [
      'Implementation of ensemble learning combining multiple algorithms',
      'Deep neural networks for complex pattern recognition',
      'Gradient boosting for feature importance and prediction refinement',
      'Regular model retraining with new data'
    ],
    benefits: [
      'High accuracy in diverse market conditions',
      'Ability to capture complex market relationships',
      'Continuous improvement through learning',
      'Robust performance across different property types'
    ]
  },
  'Validation': {
    description: 'Our rigorous validation process ensures the model maintains high accuracy and reliability across different market conditions and property types.',
    details: [
      'Cross-validation using historical transaction data',
      'Real-world testing with active property listings',
      'Performance benchmarking against human experts',
      'Continuous monitoring and evaluation'
    ],
    benefits: [
      'Verified accuracy across different scenarios',
      'Reliable performance in real-world conditions',
      'Transparent validation metrics',
      'Early detection of model drift'
    ]
  }
};

const ProjectDetail = () => {
  const [selectedApproach, setSelectedApproach] = useState<string | null>(null);
  const [headerRef, headerInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [approachRef, approachInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [techRef, techInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [resultsRef, resultsInView] = useInView({ triggerOnce: true, threshold: 0.2 });

const handleApproachClick = (title: string) => {
    setSelectedApproach(title);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto px-4 pt-32 pb-16"
    >
      {/* Header Section */}
      <motion.div
        ref={headerRef}
        initial={{ y: 50, opacity: 0 }}
        animate={headerInView ? { y: 0, opacity: 1 } : {}}
        className="mb-16"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 text-transparent bg-clip-text">
            Real Estate Price Predictor
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            AI-powered real estate valuation model for accurate property pricing
          </p>
          <div className="flex gap-4">
            <motion.a
              href="#demo"
              className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-colors shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Live Demo
            </motion.a>
            <motion.a
              href="#github"
              className="inline-flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-full transition-colors shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github className="w-5 h-5 mr-2" />
              Source Code
            </motion.a>
          </div>
        </div>

        {/* Problem & Objective */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
            initial={{ x: -20, opacity: 0 }}
            animate={headerInView ? { x: 0, opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            <AlertCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mb-4" />
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Problem Statement</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Real estate agents struggled with accurate property valuation, leading to pricing inefficiencies and longer market times. Traditional methods were time-consuming and often inaccurate.
            </p>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
            initial={{ x: 20, opacity: 0 }}
            animate={headerInView ? { x: 0, opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            <Rocket className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mb-4" />
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Objective</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Develop an ML-powered solution that provides instant, accurate property valuations within a 95% confidence interval, considering multiple market factors.
            </p>
          </motion.div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={headerInView ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                {metric.value}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{metric.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Approach Section */}
      <motion.div
        ref={approachRef}
        className="mb-16"
        initial={{ y: 50, opacity: 0 }}
        animate={approachInView ? { y: 0, opacity: 1 } : {}}
      >
        <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Approach</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Database className="w-8 h-8" />,
              title: 'Data Collection',
              description: 'Gathered historical property data from multiple sources including MLS listings and public records.',
            },
            {
              icon: <Brain className="w-8 h-8" />,
              title: 'Model Development',
              description: 'Implemented ensemble learning combining gradient boosting and neural networks.',
            },
            {
              icon: <LineChart className="w-8 h-8" />,
              title: 'Validation',
              description: 'Rigorous testing and validation using cross-validation and real-world data.',
            },
          ].map((step, index) => (
            <motion.div
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={approachInView ? { x: 0, opacity: 1 } : {}}
              transition={{ delay: index * 0.2 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => handleApproachClick(step.title)}
            >
              <div className="text-emerald-600 dark:text-emerald-400 mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Technologies Section */}
      <motion.div
        ref={techRef}
        className="mb-16"
        initial={{ y: 50, opacity: 0 }}
        animate={techInView ? { y: 0, opacity: 1 } : {}}
      >
        <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Technologies Used</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={techInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg flex items-center"
            >
              <Code2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-3" />
              <div>
                <h3 className="font-bold text-gray-800 dark:text-white">{tech.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{tech.category}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Results Section */}
      <motion.div
        ref={resultsRef}
        className="mb-16"
        initial={{ y: 50, opacity: 0 }}
        animate={resultsInView ? { y: 0, opacity: 1 } : {}}
      >
        <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Results & Impact</h2>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Performance Metrics</h3>
              <ul className="space-y-4">
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <ArrowRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2" />
                  95% prediction accuracy within ±5% margin
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <ArrowRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2" />
                  Reduced valuation time from hours to seconds
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <ArrowRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2" />
                  20% improvement in pricing accuracy
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Business Impact</h3>
              <ul className="space-y-4">
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <ArrowRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2" />
                  30% reduction in time-to-sale
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <ArrowRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2" />
                  Increased client satisfaction by 40%
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <ArrowRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2" />
                  Adopted by 100+ real estate agencies
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Next Steps */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={resultsInView ? { y: 0, opacity: 1 } : {}}
        transition={{ delay: 0.2 }}
        className="bg-emerald-50 dark:bg-emerald-900/30 p-8 rounded-xl shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Next Steps</h2>
        <ul className="space-y-4">
          <li className="flex items-center text-gray-600 dark:text-gray-300">
            <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2" />
            Expand model to include rental price predictions
          </li>
          <li className="flex items-center text-gray-600 dark:text-gray-300">
            <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2" />
            Integrate with more data sources for enhanced accuracy
          </li>
          <li className="flex items-center text-gray-600 dark:text-gray-300">
            <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2" />
            Develop mobile application for on-the-go valuations
          </li>
        </ul>
      </motion.div>
      <DetailPopup
        isOpen={selectedApproach !== null}
        onClose={() => setSelectedApproach(null)}
        title={selectedApproach || ''}
        content={selectedApproach ? approachContent[selectedApproach as keyof typeof approachContent] : {
          description: '',
          details: [],
          benefits: []
        }}
      />
    </motion.div>
  );
};

export default ProjectDetail;
