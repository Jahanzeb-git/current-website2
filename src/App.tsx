import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Notes from './pages/Notes';
import Contact from './pages/Contact';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import ProjectDetail from './pages/ProjectDetail';
import ProjectDetail2 from './pages/ProjectDetail2';
import Chat from './pages/Chat';
import ChatBot from './components/ChatBot/ChatBot';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const { theme } = useTheme();

  // Health check function to wake up the server
  const performHealthCheck = async () => {
    try {
      console.log('🔄 Performing server health check...');
      const startTime = Date.now();
      
      const response = await fetch('https://jahanzebahmed22.pythonanywhere.com/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const healthData = await response.json();
      
      // Log health check results in a clear, formatted way
      console.log('✅ Server Health Check Successful');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`🌐 Response Time: ${responseTime}ms`);
      console.log(`📊 Server Status: ${healthData.status.toUpperCase()}`);
      console.log(`⏰ Timestamp: ${healthData.timestamp}`);
      console.log(`🔄 Service Uptime: ${healthData.service_uptime_formatted} (${healthData.service_uptime_seconds}s)`);
      console.log('');
      console.log('💾 Database Status:');
      console.log(`   Status: ${healthData.database.status}`);
      console.log(`   Path: ${healthData.database.path}`);
      console.log(`   Sessions: ${healthData.database.sessions_count}`);
      console.log(`   Memory Entries: ${healthData.database.memory_entries_count}`);
      console.log('');
      console.log('🧠 Knowledge Base:');
      console.log(`   Total Chunks: ${healthData.knowledge_base.total_chunks}`);
      console.log(`   Vector Index: ${healthData.knowledge_base.vector_index_built ? 'Built ✅' : 'Not Built ❌'}`);
      console.log('');
      console.log('🤖 AI Models:');
      console.log(`   Embedding Model: ${healthData.models.embedding_model}`);
      console.log(`   LLM Model: ${healthData.models.llm_model}`);
      console.log(`   Vector Dimension: ${healthData.models.vector_dimension}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🚀 Server is now active and ready for chat interactions!');

    } catch (error) {
      console.error('❌ Server Health Check Failed');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error(`🔥 Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('⚠️  Server may be in idle state or experiencing issues');
      console.error('💡 The server will likely wake up on the first chat interaction');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
  };

  // Perform health check on app mount (page load/refresh)
  useEffect(() => {
    performHealthCheck();
  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const lightImage = "url('https://images.unsplash.com/photo-1614854262318-831574f15f1f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";
  const darkImage = "url('https://images.unsplash.com/photo-1647346425804-34383b95644b?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";

  const noNavbarFooterRoutes = ['/chat'];
  const shouldShowNavbarFooter = !noNavbarFooterRoutes.includes(location.pathname);
  const shouldShowChatBot = !noNavbarFooterRoutes.includes(location.pathname);

  return (
    <div className="relative min-h-screen flex flex-col">
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${
          theme === 'light' ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ backgroundImage: lightImage }}
      />
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${
          theme === 'dark' ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ backgroundImage: darkImage }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        {shouldShowNavbarFooter && <Navbar />}

        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/projects/ai-powered-data-science" element={<ProjectDetail />} />
              <Route path="/projects/neural-network-visualizer" element={<ProjectDetail2 />} />
              <Route path="/not-found" element={<div>404 - Page Not Found</div>} />
              <Route path="/chat" element={<Chat />} />
            </Routes>
          </AnimatePresence>
        </main>

        {shouldShowNavbarFooter && <Footer />}
        {shouldShowChatBot && <ChatBot />}
      </div>
    </div>
  );
}

export default App;