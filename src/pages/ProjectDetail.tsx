import React from 'react';
import { motion } from 'framer-motion';

const ProjectDetails: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-100 flex flex-col items-center px-4 py-8"
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      <header
        className="w-full bg-blue-600 text-white p-4 mb-8 shadow-md text-center"
        style={{ borderRadius: '8px' }}
      >
        <h1 className="text-3xl font-bold">Project Title</h1>
        <p className="text-lg italic">A brief description of the project</p>
      </header>

      <section className="w-full max-w-4xl mb-6">
        <h2 className="text-2xl font-semibold mb-4">Problem Statement</h2>
        <p>The real-world issue or challenge addressed by the project.</p>
      </section>

      <section className="w-full max-w-4xl mb-6">
        <h2 className="text-2xl font-semibold mb-4">Objective</h2>
        <p>The main goal or achievement aimed for in the project.</p>
      </section>

      <section className="w-full max-w-4xl mb-6">
        <h2 className="text-2xl font-semibold mb-4">Approach</h2>
        <p>Techniques and tools used, with a workflow overview.</p>
      </section>

      <section className="w-full max-w-4xl mb-6">
        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
        <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
          <li>Feature 1: Description</li>
          <li>Feature 2: Description</li>
        </ul>
      </section>

      <section className="w-full max-w-4xl mb-6">
        <h2 className="text-2xl font-semibold mb-4">Data Details</h2>
        <p>Information about the dataset, including source and key insights.</p>
      </section>

      <section className="w-full max-w-4xl mb-6">
        <h2 className="text-2xl font-semibold mb-4">Technologies Used</h2>
        <p>Programming languages, libraries, and tools.</p>
      </section>

      <section className="w-full max-w-4xl mb-6">
        <h2 className="text-2xl font-semibold mb-4">Results and Impact</h2>
        <p>Performance metrics and visualizations.</p>
      </section>

      <section className="w-full max-w-4xl mb-6">
        <h2 className="text-2xl font-semibold mb-4">Challenges Faced</h2>
        <p>Obstacles encountered and solutions implemented.</p>
      </section>

      <section className="w-full max-w-4xl mb-6">
        <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
        <p>Potential improvements and future applications.</p>
      </section>

      <footer className="w-full max-w-4xl mt-8 flex justify-between">
        <a
          href="#"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          style={{ textDecoration: 'none' }}
        >
          Demo
        </a>
        <a
          href="#"
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
          style={{ textDecoration: 'none' }}
        >
          Source Code
        </a>
      </footer>
    </motion.div>
  );
};

export default ProjectDetails;
