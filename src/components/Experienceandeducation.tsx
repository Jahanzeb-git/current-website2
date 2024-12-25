import React from 'react';
import { motion } from 'framer-motion';
import { Building2, GraduationCap, Calendar, BookOpen, Briefcase, ArrowRight } from 'lucide-react';

const TimelineItem = ({ data, isLeft, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className={`flex w-full ${isLeft ? 'justify-start' : 'justify-end'} mb-8`}
  >
    <div className={`w-5/12 ${!isLeft && 'order-1'}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
      >
        <div className="flex items-center gap-2 mb-4">
          {data.type === 'education' ? (
            <GraduationCap className="w-6 h-6 text-emerald-500" />
          ) : (
            <Briefcase className="w-6 h-6 text-emerald-500" />
          )}
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">{data.title}</h3>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-2">
          <Building2 className="w-4 h-4" />
          <span>{data.institution}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-4">
          <Calendar className="w-4 h-4" />
          <span>{data.period}</span>
        </div>

        {data.details.map((detail, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + (index * 0.1) }}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-2"
          >
            <ArrowRight className="w-4 h-4 text-emerald-500" />
            <span>{detail}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </motion.div>
);

const TimelineLine = () => (
  <motion.div
    initial={{ height: 0 }}
    whileInView={{ height: '100%' }}
    viewport={{ once: true }}
    transition={{ duration: 1 }}
    className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-gradient-to-b from-emerald-500 to-emerald-300 h-full"
  />
);

export const EducationSection = () => {
  const education = [
    {
      type: 'education',
      title: 'Bachelor of Science Computer Science',
      institution: 'Hamdard University of Pakistan',
      period: '2022 - Present',
      details: [
        'Major in Computer Science',
        'Minor in Artificial Intelligence',
        'Focus on modern software development'
      ]
    },
    {
      type: 'education',
      title: 'High School Intermediate',
      institution: 'High School',
      period: '2020 - 2022',
      details: [
        'Major in Engineering',
        'Strong foundation in mathematics',
        'Technical skills development'
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-16"
    >
      <div className="flex items-center gap-3 mb-12">
        <BookOpen className="w-8 h-8 text-emerald-500" />
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Education</h2>
      </div>

      <div className="relative">
        <TimelineLine />
        {education.map((item, index) => (
          <TimelineItem
            key={index}
            data={item}
            isLeft={index % 2 === 0}
            delay={index * 0.2}
          />
        ))}
      </div>
    </motion.div>
  );
};

export const ExperienceSection = () => {
  const experience = [
    {
      type: 'experience',
      title: 'Frontend Developer',
      institution: 'Tech Company',
      period: '2023 - Present',
      details: [
        'Building modern web applications',
        'Leading frontend architecture',
        'Mentoring junior developers'
      ]
    },
    {
      type: 'experience',
      title: 'Junior Developer',
      institution: 'Startup',
      period: '2022 - 2023',
      details: [
        'Full-stack development',
        'Agile methodology',
        'Rapid prototyping'
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-16"
    >
      <div className="flex items-center gap-3 mb-12">
        <Briefcase className="w-8 h-8 text-emerald-500" />
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Experience</h2>
      </div>

      <div className="relative">
        <TimelineLine />
        {experience.map((item, index) => (
          <TimelineItem
            key={index}
            data={item}
            isLeft={index % 2 === 0}
            delay={index * 0.2}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default { EducationSection, ExperienceSection };
