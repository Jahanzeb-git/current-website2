import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } rfrom 'react-intersection-observer';
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
  X,
} from 'lucide-react';

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
  dataCollection: {
    title: "Data Collection Process",
    content: (
      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">Data Sources</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
            <li>Multiple Listing Service (MLS) databases</li>
            <li>Public property records and tax assessments</li>
            <li>Geographic and demographic data from census</li>
            <li>Economic indicators from federal reserve</li>
            <li>Local market trends and statistics</li>
          </ul>
        </section>
        {/* ... Rest of data collection content ... */}
      </div>
    )
  },
  modelDevelopment: {
    title: "Model Development Details",
    content: (
      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">Model Architecture</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
            <li>Ensemble of gradient boosting and neural networks</li>
            <li>Custom feature extraction layers</li>
            <li>Attention mechanisms for location importance</li>
            <li>Time-series components for market trends</li>
          </ul>
        </section>
        {/* ... Rest of model development content ... */}
      </div>
    )
  },
  validation: {
    title: "Validation Methodology",
    content: (
      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">Testing Framework</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
            <li>K-fold cross-validation</li>
            <li>Out-of-time validation</li>
            <li>Geographic segmentation tests</li>
            <li>Price range specific validation</li>
          </ul>
        </section>
        {/* ... Rest of validation content ... */}
      </div>
    )
  }
};

const ProjectDetail = () => {
  const [selectedApproach, setSelectedApproach] = useState<keyof typeof approachContent | null>(null);
  const [headerRef, headerInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [approachRef, approachInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [techRef, techInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [resultsRef, resultsInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const ApproachCard = ({ icon, title, description, onClick }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg cursor-pointer"
      onClick={onClick}
    >
      <div className="text-emerald-600 dark:text-emerald-400 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">
        {description}
      </p>
    </motion.div>
  );

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
          <ApproachCard
            icon={<Database className="w-8 h-8" />}
            title="Data Collection"
            description="Gathered historical property data from multiple sources including MLS listings and public records."
            onClick={() => setSelectedApproach('dataCollection')}
          />
          <ApproachCard
            icon={<Brain className="w-8 h-8" />}
            title="Model Development"
            description="Implemented ensemble learning combining gradient boosting and neural networks."
            onClick={() => setSelectedApproach('modelDevelopment')}
          />
          <ApproachCard
            icon={<LineChart className="w-8 h-8" />}
            title="Validation"
            description="Rigorous testing and validation using cross-validation and real-world data."
            onClick={() => setSelectedApproach('validation')}
          />
        </div>
      </motion.div>

      {/* Results Section with GIF */}
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
                {metrics.map((metric, index) => (
                  <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                    <ArrowRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2" />
                    {metric.label}: {metric.value}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* GIF Visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 rounded-xl overflow-hidden shadow-lg"
        >
          <img
            src="https://assets.website-files.com/5e6c01bb5212506d6c119069/5e6c01bb52125431f911909b_90.gif"
            alt="Real Estate Price Prediction Visualization"
            className="w-full h-auto"
          />
        </motion.div>
      </motion.div>

      {/* Approach Popup */}
      <AnimatePresence>
        {selectedApproach && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedApproach(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {approachContent[selectedApproach].title}
                </h2>
                <button
                  onClick={() => setSelectedApproach(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
                {approachContent[selectedApproach].content}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectDetail;
