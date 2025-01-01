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
import ImageGeneration from './pages/ImgGen';
import Chatbot from './components/chatbot'; // Import the Chatbot component
import { ThemeProvider, useTheme } from './context/ThemeContext';
import ProjectDetail from './pages/ProjectDetail';
import ProjectDetail2 from './pages/ProjectDetail2';
import chat from './pages/Chat';
import projectnavigation from './component/projectnavigation';

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
  const lightImage = "url('https://i.imgur.com/jskuQDa.png')";
  const darkImage = "url('https://images.unsplash.com/photo-1647346425804-34383b95644b?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";

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
        {/* Conditionally render Navbar */}
        {location.pathname !== '/contact' && <Navbar />}
        
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/chatbot" element={<Chatbot />} /> {/* Add Chatbot route */}
              <Route path="/image-generation" element={<ImageGeneration />} />
              <Route path="/documentation" element={<Documentation />} /> {/* Add Documentation route */}
              <Route path="/projects/ai-powered-data-science" element={<ProjectDetail />} />
              <Route path="/projects/neural-network-visualizer" element={<ProjectDetail2 />} />
              <Route path="/not-found" element={<div>404 - Page Not Found</div>} />
              <Route path="/chat" element={<chat />} />
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
