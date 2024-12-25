import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Building2, GraduationCap, Award, ArrowUpRight } from 'lucide-react';

const EducationSection = React.forwardRef((props, ref) => {
  const education = [
    {
      degree: "Masters of Science in Financial Engineering",
      institution: "Worldquant University",
      period: "2022 - 2024",
      achievements: [
        "Specialized in quantitative finance and algorithmic trading",
        "Research focus on ML applications in market prediction",
        "GPA: 3.8/4.0"
      ]
    },
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "Example University",
      period: "2018 - 2022",
      achievements: [
        "Major in Data Science and AI",
        "Minor in Mathematics",
        "Dean's List: All semesters"
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      className="mt-16 mb-16"
      initial="hidden"
      animate={props.inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <motion.div 
        className="flex items-center gap-3 mb-8"
        variants={itemVariants}
      >
        <GraduationCap className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          Education
        </h2>
      </motion.div>
      
      <div className="space-y-8">
        {education.map((edu, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="relative"
          >
            <div className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    {edu.degree}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mt-2">
                    <Building2 className="w-4 h-4" />
                    <span>{edu.institution}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mt-1">
                    <Calendar className="w-4 h-4" />
                    <span>{edu.period}</span>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                >
                  View Details
                  <ArrowUpRight className="w-4 h-4" />
                </motion.button>
              </div>
              
              <motion.div
                className="mt-4 space-y-2"
              >
                {edu.achievements.map((achievement, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={props.inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    className="flex items-center gap-2"
                  >
                    <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">{achievement}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
});

const ExperienceSection = React.forwardRef((props, ref) => {
  const experiences = [
    {
      role: "Senior Data Scientist",
      company: "Tech Innovation Labs",
      period: "2020 - Present",
      location: "Remote",
      type: "Full-time",
      achievements: [
        "Led development of ML models improving customer retention by 45%",
        "Managed a team of 5 data scientists across 3 time zones",
        "Implemented automated ML pipeline reducing deployment time by 60%",
        "Collaborated with product teams to integrate AI solutions"
      ],
      skills: ["Python", "TensorFlow", "AWS", "Docker", "MLOps"]
    },
    {
      role: "Data Scientist",
      company: "Data Analytics Co",
      period: "2018 - 2020",
      location: "Hybrid",
      type: "Full-time",
      achievements: [
        "Developed predictive models with 92% accuracy",
        "Optimized data processing reducing costs by 35%",
        "Created automated reporting dashboards",
        "Mentored junior data scientists"
      ],
      skills: ["Python", "SQL", "Tableau", "Scikit-learn", "Git"]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      className="mb-16"
      initial="hidden"
      animate={props.inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <motion.div 
        className="flex items-center gap-3 mb-8"
        variants={itemVariants}
      >
        <Building2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          Experience
        </h2>
      </motion.div>

      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="relative"
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                      {exp.role}
                    </h3>
                    <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm">
                      {exp.type}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mt-2 text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span>{exp.company}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{exp.period}</span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {exp.achievements.map((achievement, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={props.inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.3 + (i * 0.1) }}
                        className="flex items-start gap-2"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-2 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300">{achievement}</span>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div 
                    className="mt-4 flex flex-wrap gap-2"
                    initial={{ opacity: 0 }}
                    animate={props.inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.5 }}
                  >
                    {exp.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
});

export { EducationSection, ExperienceSection };
