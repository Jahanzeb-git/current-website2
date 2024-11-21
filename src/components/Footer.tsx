import React, { useState } from 'react';
import { Github, Linkedin, MessageSquare, Code, Cloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Footer = () => {
  const [showColophon, setShowColophon] = useState(false);

  const socialLinks = [
    { icon: <Github className="w-5 h-5" />, url: 'https://github.com/Jahanzeb-git', label: 'GitHub' },
    { icon: <Linkedin className="w-5 h-5" />, url: 'https://www.linkedin.com/in/2024-jahanzebahmed/', label: 'LinkedIn' },
    { icon: <MessageSquare className="w-5 h-5" />, url: 'https://wa.me/', label: 'WhatsApp' },
  ];

  const colophonInfo = [
    { icon: <Code className="w-5 h-5" />, label: 'React + Vite', description: 'For code' },
    { icon: <Github className="w-5 h-5" />, label: 'GitHub', description: 'For version control' },
    { icon: <Cloud className="w-5 h-5" />, label: 'Netlify', description: 'For deployment' },
  ];

  return (
    <footer className="w-full py-6 px-4 transition-colors duration-700">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            © 2024 Jahanzeb Ahmed
          </p>
          <span className="text-gray-400">•</span>
          <button
            onClick={() => setShowColophon(true)}
            className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
          >
            Colophon
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          {socialLinks.map((link, index) => (
            <motion.a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              {link.icon}
            </motion.a>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showColophon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setShowColophon(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md mx-4 shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                Colophon
              </h3>
              <div className="space-y-4">
                {colophonInfo.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="text-emerald-600 dark:text-emerald-400">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {item.label}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowColophon(false)}
                className="mt-6 w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;
