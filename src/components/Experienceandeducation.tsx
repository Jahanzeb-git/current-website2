import React from 'react';
import { motion } from 'framer-motion';
import { Building2, GraduationCap, Calendar, BookOpen, Briefcase, ArrowDown } from 'lucide-react';

const TimelineEntry = ({ title, institution, period, details, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="relative z-10"
  >
    <div className="flex flex-col">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h3>
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mt-1">
        <Building2 className="w-4 h-4" />
        <span>{institution}</span>
      </div>
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mt-1">
        <Calendar className="w-4 h-4" />
        <span>{period}</span>
      </div>
      <div className="mt-3 space-y-2">
        {details.map((detail, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: delay + 0.1 * idx }}
            className="flex items-start gap-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2" />
            <span className="text-gray-600 dark:text-gray-300">{detail}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
);

const AnimatedConnector = () => (
  <div className="relative my-4 mx-auto w-0.5 h-16">
    <motion.div
      initial={{ height: 0 }}
      whileInView={{ height: '100%' }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 bg-gradient-to-b from-emerald-500 to-emerald-300"
    />
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      whileInView={{ opacity: 1, y: [0, 20, 0] }}
      viewport={{ once: true }}
      transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
      className="absolute -bottom-4 left-1/2 -translate-x-1/2"
    >
      <ArrowDown className="w-6 h-6 text-emerald-500" />
    </motion.div>
  </div>
);

export const EducationSection = () => {
  const educationData = {
    current: {
      title: "Bachelor of Science Computer Science",
      institution: "Hamdard University of Pakistan",
      period: "2022 - Present",
      details: [
        "Major in Computer Science",
        "Minor in Artificial Intelligence",
        "Focus on modern software development"
      ]
    },
    previous: {
      title: "High School Intermediate",
      institution: "High School",
      period: "2020 - 2022",
      details: [
        "Major in Engineering",
        "Strong foundation in mathematics",
        "Technical skills development"
      ]
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-16"
    >
      <div className="flex items-center gap-3 mb-8">
        <GraduationCap className="w-8 h-8 text-emerald-500" />
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Education</h2>
      </div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="relative bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
      >
        <TimelineEntry {...educationData.current} delay={0.2} />
        <AnimatedConnector />
        <TimelineEntry {...educationData.previous} delay={0.6} />
      </motion.div>
    </motion.div>
  );
};

export const ExperienceSection = () => {
  const experienceData = {
    current: {
      title: "Data Scientist",
      institution: "Tech Inovation Labs",
      period: "2023 - Present",
      details: [
        "Led development of ML models improving customer retention by 45%",
        "Managed a team of 5 data scientists across 3 time zones",
        "Implemented automated ML pipeline reducing deployment time by 60%",
        "Collaborated with product teams to integrate AI solutions"
      ]
    },
    previous: {
      title: "Junior Developer",
      institution: "Startup",
      period: "2022 - 2023",
      details: [
        "Full-stack development",
        "Agile methodology",
        "Rapid prototyping",
        "Client communication"
      ]
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-16"
    >
      <div className="flex items-center gap-3 mb-8">
        <Briefcase className="w-8 h-8 text-emerald-500" />
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Experience</h2>
      </div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="relative bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
      >
        <TimelineEntry {...experienceData.current} delay={0.2} />
        <AnimatedConnector />
        <TimelineEntry {...experienceData.previous} delay={0.6} />
      </motion.div>
    </motion.div>
  );
};

export default { EducationSection, ExperienceSection };
