import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Check, Cpu, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ImageGenerator: React.FC<{ onIntersect: (isVisible: boolean) => void }> = ({ onIntersect }) => {
  const [images, setImages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('Flux.1'); // Default model Flux.1
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);  
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageGeneratorRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const latestImageRef = useRef<HTMLDivElement>(null);


  const handleClickOutside = (event: MouseEvent) => {
    if (
      imageGeneratorRef.current && !imageGeneratorRef.current.contains(event.target as Node) &&
      menuRef.current && !menuRef.current.contains(event.target as Node)
    ) {
      setMenuOpen(false); // Close menu if click is outside image generator or menu
    }
  }; 
  const detailedPrompts = {
  	"A Realistic Cat": "A highly detailed and realistic depiction of a cat with fur texture and lifelike eyes.",
  	"An Astronaut on Moon": "An astronaut standing on the surface of the moon with Earth visible in the background.",
  	"A Beautiful Girl": "A portrait of a beautiful girl with intricate details in her hair and eyes.",
  	"Handsome Men": "A strikingly handsome and realistic man with strong, masculine features, including a sharp jawline and expressive eyes, gazing directly into the camera. The portrait shot captures impressive realism with highly detailed textures and lifelike skin tones. The composition evokes the cinematic quality of a Hasselblad camera, with exceptional color resolution and a professional-grade depth of field. The man is depicted with a confident and magnetic presence, creating a captivating and visually stunning portrayal."
	};

  const loadingMessages = [
  	"Understanding prompt...",
  	"Making dynamics...",
  	"Edge correcting...",
  	"Improving colors...",
  	"Adding depth...",
  	"Blurring background...",
  	"Enhancing sharpness...",
  	"Generating textures...",
  	"Combining elements...",
  	"Adjusting lighting...",
  	"Rendering shadows...",
  	"Fixing distortions...",
  	"Optimizing details...",
  	"Refining composition...",
  	"Adding contrast...",
  	"Applying styles...",
  	"Customizing gradients...",
  	"Scaling image...",
  	"Shaping curves...",
  	"Creating layers...",
  	"Balancing highlights...",
  	"Adding filters...",
  	"Cloning objects...",
  	"Combining layers...",
  	"Synchronizing colors...",
  	"Adjusting tones...",
  	"Applying effects...",
  	"Rendering background...",
  	"Smoothing edges...",
  	"Generating reflections...",
  	"Mapping coordinates...",
  	"Rendering shapes...",
  	"Optimizing textures...",
  	"Adding borders...",
  	"Creating gradients...",
  	"Applying effects...",
  	"Synchronizing shades...",
  	"Rendering complex structures...",
 	 "Adding shadows...",
  	"Combining overlays...",
  	"Fixing alignment...",
  	"Generating gradients...",
  	"Enhancing features...",
  	"Refining details...",
  	"Integrating elements...",
  	"Balancing contrast...",
  	"Generating variations...",
  	"Applying transformations...",
  	"Rendering intricate designs...",
  	"Adding patterns...",
  	"Optimizing composition...",
  	"Blending layers...",
  	"Creating unique styles...",
  	"Scaling objects...",
  	"Shaping edges...",
  	"Generating previews...",
  	"Applying advanced corrections...",
  	"Customizing visuals...",
  	"Rendering dynamic visuals...",
  	"Fixing imperfections...",
  	"Adding reflections...",
  	"Creating interactive elements...",
  	"Smoothing textures...",
  	"Combining visual elements..."
	];

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

  useEffect(() => {
  	const interval = setInterval(() => {
    		setCurrentMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
 	}, 5000); // 10-second intervals

  	return () => clearInterval(interval);
  }, []);
	
	
  useEffect(() => {
  	if (latestImageRef.current) {
    		latestImageRef.current.scrollIntoView({ behavior: 'smooth' });
  	}
  }, [images]);


  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const closeMenu = () => setMenuOpen(false);

  const selectModel = (model: string) => {
    setSelectedModel(model);
    closeMenu();
  };

  const generateImage = async () => {
  setIsGenerating(true);
  const modelId = selectedModel === 'Flux.1 Pro' ? 1 : 0;
  
  try {
    const response = await fetch('https://jahanzebahmed22.pythonanywhere.com/image_generation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: input, model: modelId}) // Include Model in Request..
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
    setIsGenerating(false);
  }
};
const handleImageClick = (src: string) => { setSelectedImage(src); setIsModalOpen(true); }; 
const handleCloseModal = () => { setIsModalOpen(false); setSelectedImage(null); };
const handleDownload = (src: string) => { const link = document.createElement('a'); link.href = src; link.download = 'generated-image.png'; document.body.appendChild(link); link.click(); document.body.removeChild(link); };
	

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
              onClick={() => navigate('/contact')}
            >
              Try Chatbot
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
                  onClick={() => selectModel('Flux.1')}
                >
                  <span>Flux.1</span>
                  {selectedModel === 'Flux.1' && <Check className="w-4 h-4 text-emerald-500 ml-2" />}
                </button>
                <button
                  className="flex items-center justify-between text-gray-800 dark:text-white mb-2"
                  onClick={() => selectModel('Flux.1 Pro')}
                >
                  <span>Flux-1.1 Pro</span>
                  {selectedModel === 'Flux.1 Pro' && <Check className="w-4 h-4 text-emerald-500 ml-2" />}
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
            <div 
  		key={index} 
  		ref={index === 0 ? latestImageRef : null} 
  		className="relative mb-2" 
  		onClick={() => handleImageClick(img)}
	    >
  	    	<img 
    			src={img} 
    			alt={`Generated ${index}`} 
    			className="w-full rounded-lg" 
  	    	/>
  	   	<div 
    			className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
  		>
    			<button
      				onClick={(e) => {
        				e.stopPropagation();
       		 			handleDownload(img);
      				}}
      				className="bg-white text-black py-2 px-4 rounded-full"
    			>
      				Download Image
    			</button>
  		</div>
	     </div>
          ))}
        </div> 
	      
        {isGenerating && (
  		<div className="flex items-center space-x-3 justify-center">
    			<div className="loader"></div>
    			<motion.div
      				key={currentMessageIndex}
      				initial={{ opacity: 0 }}
      				animate={{ opacity: 1 }}
      				exit={{ opacity: 0 }}
      				transition={{ duration: 0.5 }} // Smooth transition effect
      				className="text-gray-600 dark:text-gray-300 text-center"
    			>
      				{loadingMessages[currentMessageIndex]}
    			</motion.div>
  		</div>
	)}
	{messages.length > 0 && (
  		<motion.div
    			initial={{ y: -20, opacity: 0 }}
    			animate={{ y: 0, opacity: 1 }}
    			exit={{ y: -20, opacity: 0 }}
    			transition={{ duration: 0.5 }} // Smooth transition
    			className="text-gray-600 dark:text-gray-300 text-center space-y-2"
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
	    disabled={isGenerating}
          />
          <button
  		className={`p-3 rounded-full flex items-center justify-center 
    			bg-black dark:bg-white hover:opacity-50 active:opacity-100 
    			${isGenerating ? 'opacity-30 cursor-not-allowed' : ''}`}
  		onClick={generateImage}
  		disabled={isGenerating}
	>
  		<ArrowUp className="w-5 h-5 text-white dark:text-black" />
	</button>
        </div>
	<div className="flex flex-wrap justify-center gap-2 mb-4">
  		{Object.keys(detailedPrompts).map((tag, index) => (
    			<button
      				key={index}
      				onClick={() => setInput(detailedPrompts[tag])}
      				className="px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition"
    			>
      				{tag}
    			</button>
  		))}
	</div>
	<div className="text-center text-gray-600 dark:text-gray-300 mb-4">
  		AI Generated Image. Check for Mistakes.
	</div>
      </div>
     {/* Image Modal */}
     {isModalOpen && selectedImage && (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
         <div className="relative bg-white rounded-lg p-4 max-w-[90%] max-h-[90%] overflow-auto">
         {/* Close Button with dynamic background-aware color */}
            <button 
          	onClick={handleCloseModal} 
        	className="absolute top-2 right-2 p-2 rounded-full"
        	style={{
          		color: selectedImage ? 'white' : 'black',
          		backgroundColor: 'rgba(0,0,0,0.5)',
        	}}
      	    >
        	✕
     	    </button>
      	    {/* Image with proper aspect ratio and dimensions */}
            <motion.img 
        	src={selectedImage} 
        	alt="Popup Image" 
        	className="rounded-lg max-w-full max-h-full object-contain"
        	initial={{ opacity: 0, scale: 0.8 }} 
        	animate={{ opacity: 1, scale: 1 }} 
        	exit={{ opacity: 0, scale: 0.8 }} 
      	    />
    	 </div>
       </div>
      )}
    </motion.div>
  );
};

export default ImageGenerator;
