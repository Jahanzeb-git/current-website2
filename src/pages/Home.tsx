import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ProjectCard from '../components/ProjectCard';
import ProgressMilestones from '../components/ProgressMilestones';
import Testimonials from '../components/Testimonials';
import ExpandableText from '../components/ExpandableText';
import { useTheme } from '../context/ThemeContext';

const completedProjects = [
  {
    title: 'AIA-Powered Data Science',
    description:
      'Advanced data analysis platform using machine learning algorithms for predictive analytics.',
    image:
      'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&q=80',
    tags: ['Python', 'TensorFlow', 'React', 'AWS'],
    demoUrl: 'https://demo.example.com',
    sourceUrl: 'https://github.com',
  },
  {
    title: 'Neural Network Visualizer',
    description:
      'Interactive visualization tool for understanding neural network architectures and data flow.',
    image:
      'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80',
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

const Home = () => {
  const { theme } = useTheme();

  const expandableTextData = {
    title: 'My Approach to Data Science',
    body: `
      For me, data science is a mix of curiosity, creativity, and problem-solving. It’s not just about numbers but about asking the right questions, finding hidden patterns, and turning raw data into real solutions. I begin by fully understanding your goals because this clarity is key to meaningful insights. I take pride in cleaning and structuring data, ensuring it's solid before analysis begins, as a strong foundation is essential for accurate results. Once the data is ready, I dive deep into it, testing hypotheses and experimenting to uncover valuable insights using tools like machine learning and statistical models. My focus is on transforming data into practical, actionable insights that you can apply right away — not just numbers, but real solutions. I also believe that data science is always evolving, and so is my process. I constantly refine models and strategies to adapt to new data and changing needs. Ultimately, I aim to make complex problems simpler and deliver solutions that drive real-world impact. Every project is an opportunity to learn and create something meaningful.
    `,
  };

  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [projectsRef, projectsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [inProgressRef, inProgressInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [inView, setInView] = useState(false); // To track if the element is in view

  const handleScroll = () => {
    const skillsSection = document.getElementById('skills-section');
    if (skillsSection) {
      const rect = skillsSection.getBoundingClientRect();
      if (rect.top <= window.innerHeight && rect.bottom >= 0) {
        setInView(true); // Element is in view
      }
    }
  };

  // Adding the scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`max-w-6xl mx-auto px-4 pt-32 pb-16 bg-cover bg-center min-h-screen ${
        theme === 'dark' ? 'dark:bg-dark-bg' : 'bg-light-bg'
      }`}
    >
      <motion.div
        ref={headerRef}
        initial={{ y: 20, opacity: 0 }}
        animate={headerInView ? { y: 0, opacity: 1 } : {}}
        transition={{ delay: 0.2 }}
        className="text-center mb-20"
      >
        <h1 className="text-6xl font-bold mb-8 text-gray-800 dark:text-white">
          I am Jahanzeb.
        </h1>
        <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-4">
          Data Scientist & AI Enthusiast
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Welcome to my portfolio! I turn complex data into clear, practical
          solutions. With a passion for machine learning and data analysis, I
          help businesses grow and innovate by making data work for them.
        </p>
      </motion.div>

      {/* Completed Projects */}

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
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </motion.section>

      {/* Progress Milestones */}
      <ProgressMilestones />

      {/* In Progress Projects */}

      <motion.section
        ref={inProgressRef}
        initial={{ opacity: 0 }}
        animate={inProgressInView ? { opacity: 1 } : {}}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-12 text-gray-800 dark:text-white">
          In Progress
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {inProgressProjects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              animate={inProgressInView ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: index * 0.2 }}
              className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 z-10" />
              <div className="absolute top-4 right-4 z-20">
                <span className="px-4 py-2 bg-emerald-500/90 text-white rounded-full text-sm font-medium">
                  {project.status}
                </span>
              </div>
              <div className="aspect-video overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <h3 className="text-2xl font-bold mb-2 text-white">
                  {project.title}
                </h3>
                <p className="text-gray-200 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 text-sm bg-white/20 text-white rounded-full backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Additional Info Section */}

      <ExpandableText
        title={expandableTextData.title}
        body={expandableTextData.body}
      />

      {/* Testimonials */}
      <Testimonials />
    </motion.div>
  );
};

export default Home;
