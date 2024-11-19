import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ProjectCard from '../components/ProjectCard';
import ProgressMilestones from '../components/ProgressMilestones';
import Testimonials from '../components/Testimonials';
import ExpandableText from '../components/ExpandableText';
import { useTheme } from '../context/ThemeContext';
import Ai from '../Assets/images/Ai.jpg';
import nural from '../Assets/images/nural.jpg';

const completedProjects = [
  {
    title: 'AI-Powered Data Science',
    description:
      'Advanced data analysis platform using machine learning algorithms for predictive analytics.',
    image: Ai,
    tags: ['Python', 'TensorFlow', 'React', 'AWS'],
    demoUrl: 'https://demo.example.com',
    sourceUrl: 'https://github.com',
  },
  {
    title: 'Neural Network Visualizer',
    description:
      'Interactive visualization tool for understanding neural network architectures and data flow.',
    image: nural,
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
      '',
    tags: ['Quantum', 'Python', 'Research'],
    status: 'Research Phase',
  },
  {
    title: 'Sustainable AI Platform',
    description:
      'Developing an energy-efficient AI platform for environmental data analysis.',
    image:
      '',
    tags: ['Green AI', 'Cloud', 'Sustainability'],
    status: 'Development',
  },
];

const Home = () => {
  const { theme } = useTheme();

  const expandableTextData = {
    title: 'My Approach to Data Science',
    body: `
      Data science blends curiosity, creativity, and problem-solving. I transform raw data into actionable insights through meticulous analysis and machine learning tools.
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

  useEffect(() => {
    const handleScroll = () => {
      const skillsSection = document.getElementById('skills-section');
      if (skillsSection) {
        const rect = skillsSection.getBoundingClientRect();
        setInView(rect.top <= window.innerHeight && rect.bottom >= 0);
      }
    };

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
      {/* Header Section */}
      <motion.div
        ref={headerRef}
        initial={{ y: 20, opacity: 0 }}
        animate={headerInView ? { y: 0, opacity: 1 } : {}}
        transition={{ delay: 0.2 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-800 dark:text-white">
          I am Jahanzeb
        </h1>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-4">
          Data Scientist & AI Enthusiast
        </h2>
        <p className="text-md md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Welcome to my portfolio! I turn complex data into clear, practical
          solutions using machine learning and data analysis.
        </p>
      </motion.div>

      {/* Completed Projects */}
      <motion.section
        ref={projectsRef}
        initial={{ opacity: 0 }}
        animate={projectsInView ? { opacity: 1 } : {}}
        className="mb-20"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 dark:text-white">
          Featured Projects
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {completedProjects.map((project, index) => (
            <ProjectCard key={index} project={project} />
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
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 dark:text-white">
          In Progress
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {inProgressProjects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              animate={inProgressInView ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: index * 0.2 }}
              className="group bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg md:text-xl font-bold mb-2 text-gray-800 dark:text-white">
                  {project.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300"
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

      {/* Expandable Text */}
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
