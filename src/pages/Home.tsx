import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ProjectCard from '../components/ProjectCard';
import { useTheme } from '../context/ThemeContext';
import Ai from '../Assets/images/Ai.jpg';
import nural from '../Assets/images/nural.jpg';

const completedProjects = [
  {
    title: 'AI-Powered Data Science',
    description:
      'Advanced data analysis platform using machine learning algorithms for predictive analytics.',
    image: Ai, // Use the imported image 
    tags: ['Python', 'TensorFlow', 'React', 'AWS'],
    demoUrl: 'https://demo.example.com',
    sourceUrl: 'https://github.com',
  },
  {
    title: 'Neural Network Visualizer',
    description:
      'Interactive visualization tool for understanding neural network architectures and data flow.',
    image: nural, // Use the Imported image
    tags: ['D3.js', 'Python', 'TypeScript'],
    demoUrl: 'https://demo.example.com',
    sourceUrl: 'https://github.com',
  },
];

const inProgressProjects = [
  {
    title: 'Quantum Computing Research',
    description:
      'Exploring quantum algorithms for optimization problems in data science.',
    image:
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80',
    tags: ['Quantum', 'Python', 'Research'],
    status: 'Research Phase',
  },
  {
    title: 'Sustainable AI Platform',
    description:
      'Developing an energy-efficient AI platform for environmental data analysis.',
    image:
      'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&q=80',
    tags: ['Green AI', 'Cloud', 'Sustainability'],
    status: 'Development',
  },
];

const LazyProgressMilestones = React.lazy(() =>
  import('../components/ProgressMilestones')
);
const LazyTestimonials = React.lazy(() =>
  import('../components/Testimonials')
);

const Home = () => {
  const { theme } = useTheme();
  const [headerRef, headerInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [projectsRef, projectsInView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`max-w-6xl mx-auto px-4 pt-32 pb-16 min-h-screen ${
        theme === 'dark' ? 'dark:bg-dark-bg' : 'bg-light-bg'
      }`}
    >
      {/* Header Section */}
      <motion.div
        ref={headerRef}
        initial={{ y: 20, opacity: 0 }}
        animate={headerInView ? { y: 0, opacity: 1 } : {}}
        className="text-center mb-20"
      >
        <h1 className="text-6xl font-bold mb-8 text-gray-800 dark:text-white">
          I am Jahanzeb.
        </h1>
        <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-4">
          Data Scientist & AI Enthusiast
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Welcome to my portfolio! I turn complex data into practical solutions.
        </p>
      </motion.div>

      {/* Projects Section */}
      <motion.section
        ref={projectsRef}
        initial={{ opacity: 0 }}
        animate={projectsInView ? { opacity: 1 } : {}}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-12 text-gray-800 dark:text-white">
          Featured Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {completedProjects.map((project, index) => (
            <React.memo key={index}>
              <ProjectCard project={project} />
            </React.memo>
          ))}
        </div>
      </motion.section>

      {/* Lazy-Loaded Sections */}
      <Suspense fallback={<div>Loading...</div>}>
        <LazyProgressMilestones />
        <LazyTestimonials />
      </Suspense>
    </motion.div>
  );
};

export default Home;
