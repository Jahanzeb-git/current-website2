import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Check, Cpu, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ImageGenerator: React.FC<{ onIntersect: (isVisible: boolean) => void }> = ({ onIntersect }) => {
  const [images, setImages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>('Stable Diffusion');
  const [messages, setMessages] = useState<string[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);  
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageGeneratorRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleClickOutside = (event: MouseEvent) => {
    if (
      imageGeneratorRef.current && !imageGeneratorRef.current.contains(event.target as Node) &&
      menuRef.current && !menuRef.current.contains(event.target as Node)
    ) {
      setMenuOpen(false); // Close menu if click is outside image generator or menu
    }
  }; 
	
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => onIntersect(entry.isIntersecting),
      { threshold: 0.5 }
    );

    if (imageGeneratorRef.current) {
      observer.observe(imageGeneratorRef.current);
    }

    return () => {
      if (imageGeneratorRef.current) {
        observer.unobserve(imageGeneratorRef.current);
      }
    };
  }, [onIntersect]);

  useEffect(() => {
    const storedImages = sessionStorage.getItem('generatedImages');
    if (storedImages) {
      setImages(JSON.parse(storedImages));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('generatedImages', JSON.stringify(images));
  }, [images]);

  useEffect(() => {
    if (imageContainerRef.current) {
      imageContainerRef.current.scrollTop = imageContainerRef.current.scrollHeight;
    }
  }, [images]);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const closeMenu = () => setMenuOpen(false);

  const selectModel = (model: string) => {
    setSelectedModel(model);
    closeMenu();
  };

  const generateImage = async () => {
  setMessages((prev) => [...prev, 'Generating image...']);
  
  try {
    const response = await fetch('https://jahanzebahmed22.pythonanywhere.com/image_generation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: input })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    if (!result.output) {
      throw new Error('Invalid response format: Missing output');
    }
    
    const base64Image = `data:image/png;base64,${result.output}`;
    setImages((prev) => [base64Image, ...prev]);
    
  } catch (error) {
    console.error('Image generation failed:', error);
    setMessages((prev) => [...prev, `Image generation failed: ${error.message}`]);
  } finally {
    setMessages((prev) => [...prev, 'Generation complete.']);
  }
};


  return (
    <motion.div
      ref={imageGeneratorRef}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-8 relative ${menuOpen ? 'backdrop-blur-sm' : ''}`}
    >
      {/* Settings Icon */}
      <div
        className="absolute top-4 left-4 text-2xl text-gray-800 dark:text-white cursor-pointer"
        onClick={toggleMenu}
      >
        <Settings />
      </div>

      {/* Sliding Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute top-0 left-0 bg-gray-200 dark:bg-gray-700 w-64 p-4 rounded-lg shadow-lg z-20"
            style={{ top: '40px', left: '20px' }}
          >
            {/* Close Icon */}
            <button
              className="absolute top-2 right-2 text-gray-800 dark:text-white text-lg"
              onClick={closeMenu}
            >
              ✕
            </button>
            <button
              className="text-gray-800 dark:text-white text-lg font-semibold block mb-4"
              onClick={() => navigate('/documentation')}
            >
              Documentation
            </button>
            <button
              className="text-gray-800 dark:text-white text-lg font-semibold block mb-4"
              onClick={() => navigate('/image-generation')}
            >
              Try Image Generation
            </button>
            <div>
              <button
                className="text-gray-800 dark:text-white font-semibold block mb-2"
                onClick={closeMenu}
              >
                Change Model
              </button>
              <div className="ml-4">
                <button
                  className="flex items-center justify-between text-gray-800 dark:text-white mb-2"
                  onClick={() => selectModel('Stable Diffusion')}
                >
                  <span>Stable Diffusion</span>
                  {selectedModel === 'Stable Diffusion' && <Check className="w-4 h-4 text-emerald-500 ml-2" />}
                </button>
                <button
                  className="flex items-center justify-between text-gray-800 dark:text-white mb-2"
                  onClick={() => selectModel('DALL-E')}
                >
                  <span>DALL-E</span>
                  {selectedModel === 'DALL-E' && <Check className="w-4 h-4 text-emerald-500 ml-2" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">
        Generate Images
      </h2>

      <div className="space-y-4 relative">
        <div
          ref={imageContainerRef}
          className="h-64 overflow-y-auto bg-transparent p-4 rounded-lg"
        >
          {images.map((img, index) => (
            <div key={index} className="mb-2">
              <img src={img} alt={`Generated ${index}`} className="w-full rounded-lg" />
            </div>
          ))}
        </div>
        {messages.length > 0 && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="text-gray-600 dark:text-gray-300 text-center"
          >
            {messages.map((msg, index) => (
              <p key={index}>{msg}</p>
            ))}
          </motion.div>
        )}
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your image..."
            className="flex-grow p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
          />
          <button
            className="p-3 rounded-full flex items-center justify-center 
              bg-black dark:bg-white hover:opacity-50 active:opacity-100"
            onClick={generateImage}
          >
            <ArrowUp className="w-5 h-5 text-white dark:text-black" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ImageGenerator;
