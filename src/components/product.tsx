import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Code, Sparkles, ExternalLink, MessageSquare, Zap } from 'lucide-react';

const ProductShowcase: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 pt-20 pb-32"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500/10 rounded-full text-blue-400 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                <span>Introducing DeepThink AI</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                Your AI Companion for Complex Reasoning
              </h1>
              
              <p className="text-lg text-gray-300">
                Experience the power of advanced AI reasoning and code generation. DeepThink helps you solve complex problems, generate high-quality code, and think through challenging scenarios.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  href="https://deepthinks.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-all duration-300 transform hover:scale-105"
                >
                  Try DeepThink Now
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
                
                <button className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-gray-600 hover:border-blue-400 text-gray-300 hover:text-white font-medium transition-all duration-300">
                  Watch Demo
                </button>
              </div>
            </motion.div>

            {/* Right Column - Feature Image */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative"
            >
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80"
                  alt="AI Visualization"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent mix-blend-overlay" />
              </div>
              
              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 p-4 bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-700"
              >
                <Brain className="w-6 h-6 text-blue-400" />
              </motion.div>
              
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-4 -left-4 p-4 bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-700"
              >
                <Code className="w-6 h-6 text-cyan-400" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="container mx-auto px-4 py-20 bg-gray-800/50"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Reasoning</h3>
              <p className="text-gray-400">Tackle complex problems with AI-powered reasoning capabilities.</p>
            </div>

            <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Code Generation</h3>
              <p className="text-gray-400">Generate high-quality code across multiple programming languages.</p>
            </div>

            <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Natural Conversations</h3>
              <p className="text-gray-400">Engage in natural, context-aware conversations with AI.</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Think Deeper?</h2>
          <p className="text-gray-300 text-lg">
            Join thousands of developers and professionals who are already using DeepThink to enhance their problem-solving capabilities.
          </p>
          <a
            href="https://deepthinks.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium transition-all duration-300 transform hover:scale-105"
          >
            Get Started with DeepThink
            <Zap className="w-4 h-4 ml-2" />
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductShowcase;
