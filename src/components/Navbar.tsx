import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ hide }) => {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => { 
    setIsVisible(!hide); 
  }, [hide]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navbarClasses = `fixed w-full top-0 z-50 px-4 py-4 transition-all duration-300 ${
    scrolled ? 'backdrop-blur-lg' : ''
  }`;

  const menuVariants = {
    closed: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 }
    },
    open: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2 }
    }
  };

  const linkVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    active: { scale: 1.1 }
  };

  return (
    <>
      <motion.nav 
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className={navbarClasses}
      >
        <div className="max-w-4xl mx-auto flex justify-between items-center md:justify-center">
          <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-lg rounded-full px-6 py-2 shadow-lg">
            <div className="hidden md:flex items-center space-x-8">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-emerald-100/80 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200'
                      : 'text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400'
                  }`
                }
              >
                <motion.span
                  variants={linkVariants}
                  initial="initial"
                  whileHover="hover"
                  animate={location.pathname === '/' ? 'active' : 'initial'}
                >
                  Work
                </motion.span>
              </NavLink>
              {/* Repeat for other links with the same animation pattern */}
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-emerald-100/80 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200'
                      : 'text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400'
                  }`
                }
              >
                <motion.span
                  variants={linkVariants}
                  initial="initial"
                  whileHover="hover"
                  animate={location.pathname === '/about' ? 'active' : 'initial'}
                >
                  About
                </motion.span>
              </NavLink>
              <NavLink
                to="/notes"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-emerald-100/80 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200'
                      : 'text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400'
                  }`
                }
              >
                <motion.span
                  variants={linkVariants}
                  initial="initial"
                  whileHover="hover"
                  animate={location.pathname === '/notes' ? 'active' : 'initial'}
                >
                  Notes
                </motion.span>
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-emerald-100/80 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200'
                      : 'text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400'
                  }`
                }
              >
                <motion.span
                  variants={linkVariants}
                  initial="initial"
                  whileHover="hover"
                  animate={location.pathname === '/contact' ? 'active' : 'initial'}
                >
                  Contact
                </motion.span>
              </NavLink>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </motion.button>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {isOpen ? (
                  <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 z-40 md:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="absolute right-4 top-20 w-56 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl p-4"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
            >
              <div className="flex flex-col space-y-2">
                <NavLink
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-emerald-100/80 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200'
                        : 'text-gray-600 dark:text-gray-300'
                    }`
                  }
                >
                  Work
                </NavLink>
                <NavLink
                  to="/about"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-emerald-100/80 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200'
                        : 'text-gray-600 dark:text-gray-300'
                    }`
                  }
                >
                  About
                </NavLink>
                <NavLink
                  to="/notes"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-emerald-100/80 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200'
                        : 'text-gray-600 dark:text-gray-300'
                    }`
                  }
                >
                  Notes
                </NavLink>
                <NavLink
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-emerald-100/80 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200'
                        : 'text-gray-600 dark:text-gray-300'
                    }`
                  }
                >
                  Contact
                </NavLink>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
