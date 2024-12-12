import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings } from 'lucide-react'; // Replace with actual icon import

const ImageGeneration = () => {
  const [input, setInput] = useState("");
  const [images, setImages] = useState([]); // Stores generated images
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // Menu state
  const [processingMessageIndex, setProcessingMessageIndex] = useState(0);

  // Mock collage placeholder (replace with actual collage images)
  const placeholderCollage = [
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
  ];

  const processingMessages = [
    "Analyzing prompt...",
    "Adding structure...",
    "Refining details...",
    "Finalizing image...",
  ];

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const closeMenu = () => setMenuOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);

    let messageInterval;
    try {
      // Start processing messages animation
      messageInterval = setInterval(() => {
        setProcessingMessageIndex((prev) => (prev + 1) % processingMessages.length);
      }, 1000);

      const response = await fetch("/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();
      const generatedImage = data.image; // Assuming the API returns the image URL

      setImages((prevImages) => [generatedImage, ...prevImages]);
    } catch (err) {
      setError("Something went wrong while generating the image. Please try again.");
    } finally {
      clearInterval(messageInterval);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-3xl w-full">
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
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute top-0 left-0 bg-gray-200 dark:bg-gray-700 w-64 p-4 rounded-lg shadow-lg z-20"
              style={{ top: "40px", left: "20px" }}
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
                onClick={closeMenu}
              >
                Try Chatbot
              </button>
              <button
                className="text-gray-800 dark:text-white font-semibold block mb-2"
                onClick={() => setShowTerms(true)}
              >
                Terms
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Heading and Description */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Image Generation</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Generate stunning images by entering a prompt below. Let your imagination come to life!
          </p>
        </div>

        {/* Chat Area */}
        <div className="relative bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden mb-4 h-96">
          {images.length === 0 ? (
            <div className="flex flex-wrap justify-center items-center h-full p-4 animate-pulse">
              {placeholderCollage.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Placeholder ${index + 1}`}
                  className="w-1/2 md:w-1/4 h-auto p-2"
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col-reverse h-full overflow-y-auto p-4">
              {images.map((image, index) => (
                <div key={index} className="relative mb-4">
                  <img
                    src={image}
                    alt={`Generated ${index + 1}`}
                    className="w-full rounded-lg shadow"
                  />
                  <div
                    className="absolute bottom-2 right-2 bg-gray-800 text-white text-xs py-1 px-2 rounded-lg cursor-pointer hover:bg-gray-600"
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = image;
                      a.download = `image-${index + 1}.png`;
                      a.click();
                    }}
                  >
                    Download Image
                  </div>
                </div>
              ))}
            </div>
          )}

          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 bg-opacity-75">
              <p className="text-gray-700 dark:text-gray-300">
                {processingMessages[processingMessageIndex]}
              </p>
            </div>
          )}
        </div>

        {/* User Input Field */}
        <form onSubmit={handleSubmit} className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Enter your image prompt..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Generate"}
          </button>
        </form>

        {/* Tags */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Quick prompts:</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {[
              "Sunset",
              "Portrait",
              "Fantasy World",
              "Modern Art",
            ].map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full cursor-pointer text-sm"
                onClick={() => setInput(tag)}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>
            Note: The AI may not always produce perfect results. If something seems off, try rephrasing your prompt for better output.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageGeneration;


