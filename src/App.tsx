import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Notes from './pages/Notes';
import Contact from './pages/Contact';
import Documentation from './pages/Documentation'; // Import Documentation
import Chatbot from './components/chatbot'; // Import the Chatbot component
import { ThemeProvider, useTheme } from './context/ThemeContext';

function App() {
  const [isDocumentationOpen, setIsDocumentationOpen] = useState(false);

  const toggleDocumentation = () => {
    setIsDocumentationOpen(!isDocumentationOpen);
  };

  return (
    <ThemeProvider>
      <Router>
        <AppContent
          isDocumentationOpen={isDocumentationOpen}
          toggleDocumentation={toggleDocumentation}
        />
      </Router>
    </ThemeProvider>
  );
}

function AppContent({ isDocumentationOpen, toggleDocumentation }) {
  const location = useLocation();
  const { theme } = useTheme();

  // Define background images for light/dark mode
  const lightImage = "url('your-light-image-url')";
  const darkImage = "url('your-dark-image-url')";

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Light mode background */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${
          theme === 'light' ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ backgroundImage: lightImage }}
      />
      {/* Dark mode background */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${
          theme === 'dark' ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ backgroundImage: darkImage }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/chatbot" element={<Chatbot />} /> {/* Add Chatbot route */}
              <Route path="/documentation" element={<Documentation />} /> {/* Add Documentation route */}
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>

      {/* Modal for documentation */}
      {isDocumentationOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-4/5 max-w-3xl">
            <Documentation />
            <button
              className="absolute top-4 right-4 text-2xl text-gray-800 dark:text-white"
              onClick={toggleDocumentation}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
