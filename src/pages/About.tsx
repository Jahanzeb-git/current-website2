import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Brain,
  Database,
  LineChart,
  Download,
  ExternalLink,
  MapPin,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import profileImage from '../Assets/images/Me.png';
import { EducationSection, ExperienceSection } from '../components/Experienceandeducation';

  
const skills = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: 'Machine Learning',
    description:
      'Expert in developing and deploying ML models for real-world applications.',
  },
  {
    icon: <Database className="w-8 h-8" />,
    title: 'Data Analysis',
    description:
      'Advanced statistical analysis and visualization for actionable insights.',
  },
  {
    icon: <LineChart className="w-8 h-8" />,
    title: 'Business',
    description:
      'Transforming data insights into strategic business decisions.',
  },
];

const milestones = [
  {
    number: '01',
    title: 'Data-Driven Innovation',
    description:
      'Leading innovative data science projects that drive business growth.',
  },
  {
    number: '02',
    title: 'Machine Learning Excellence',
    description: 'Developing cutting-edge ML solutions for complex problems.',
  },
  {
    number: '03',
    title: 'Business Impact',
    description: 'Creating measurable business value through data science.',
  },
  {
    number: '04',
    title: 'Continuous Learning',
    description: 'Staying at the forefront of data science advancements.',
  },
];

const About = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [weather, setWeather] = useState(null);

  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const [skillsRef, skillsInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const [milestonesRef, milestonesInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const [educationRef, educationInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [experienceRef, experienceInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [certificationRef, certificationInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  
  useEffect(() => {
    async function fetchWeatherData() {
      try {
        const response = await fetch('https://jahanzebahmed22.pythonanywhere.com/weather', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ city: 'Karachi, Pakistan' }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const weatherData = await response.json();
        setWeather(weatherData);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    }

    fetchWeatherData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto px-4 pt-32 pb-16"
    >
      {/* Header Section */}
      <motion.div
        ref={headerRef}
        className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8"
        initial={{ y: 50, opacity: 0 }}
        animate={headerInView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className="md:w-1/2">
          <h1 className="text-6xl md:text-9xl font-extrabold mb-8 bg-gradient-to-r from-[#025A4E] to-teal-600 dark:from-emerald-400 dark:to-teal-400 text-transparent bg-clip-text">
            Hello.
          </h1>
          <h2 className="animate-fade-up duration-500 text-3xl md:text-5xl font-extrabold mb-8 bg-gradient-to-r from-[#025A4E] to-teal-600 dark:from-emerald-400 dark:to-teal-400 text-transparent bg-clip-text">
            <MapPin className="w-5 h-5 mr-2" />
            {weather ? (
              <span>
                Working remotely from {Math.round(weather.main.feels_like)}° Karachi, Pakistan
              </span>
            ) : (
              <span>Loading...</span>
            )}
          </h2>
          <div className="mb-6">
            <motion.div
              className={`text-gray-600 dark:text-gray-300 ${
                isExpanded ? '' : 'line-clamp-3'
              }`}
            >
              By day, I solve business problems with machine learning models
              that are as sophisticated as they are temperamental (but don't
              worry, I keep them in check). I turn raw data into stories that
              even your grandma could understand — if she were into algorithms
              and predictive models, of course. I’m not just here for the data
              crunching; I believe in bringing the human touch to the tech
              world, turning complex problems into practical, easy-to-understand
              solutions. My favorite hobbies include cleaning messy datasets
              (don't judge me, it’s therapeutic) and testing machine learning
              models until they finally agree with me. If you need someone who
              can mix creativity, logic, and a touch of humor into data-driven
              solutions, well, you’ve found the right person.
              {!isExpanded && '...'}
            </motion.div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center text-emerald-600 dark:text-emerald-400 mt-2 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
            >
              {isExpanded ? (
                <>
                  Show less <ChevronUp className="w-4 h-4 ml-1" />
                </>
              ) : (
                <>
                  Read more <ChevronDown className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
          <motion.a
            href="/resume.pdf"
            download
            className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-colors shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-5 h-5 mr-2" />
            Download Resume
          </motion.a>
        </div>
        <motion.div
          className="md:w-1/2 flex justify-center"
          whileHover={{ scale: 1.05 }}
        >
        <div className="w-64 h-64 rounded-lg overflow-hidden shadow-xl">
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
              style={{
              transform: "scale(1.36)", // Zoom the image itself
              objectPosition: "center",
              }}
            />
        </div>


        </motion.div>
      </motion.div>

      {/* Skills Section */}
      <motion.div
        ref={skillsRef}
        className="mb-16"
        initial={{ y: 50, opacity: 0 }}
        animate={skillsInView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
          Core Skills
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={skillsInView ? { x: 0, opacity: 1 } : {}}
              transition={{ delay: index * 0.2 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-emerald-600 dark:text-emerald-400 mb-4">
                {skill.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                {skill.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {skill.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Mission Statement */}
      <motion.div
        className="mb-16 text-center"
        initial={{ y: 50, opacity: 0 }}
        animate={skillsInView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          Let's collaborate if you're committed to
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {['Sustainability', 'Education', 'Equality', 'Data Neutrality'].map(
            (value, index) => (
              <motion.span
                key={index}
                initial={{ scale: 0 }}
                animate={skillsInView ? { scale: 1 } : {}}
                transition={{ delay: index * 0.1 }}
                className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 rounded-full"
              >
                {value}
              </motion.span>
            )
          )}
        </div>
      </motion.div>

      {/* Milestones Grid */}
      <motion.div
        ref={milestonesRef}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        initial={{ opacity: 0 }}
        animate={milestonesInView ? { opacity: 1 } : {}}
      >
        {milestones.map((milestone, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 0 }}
            animate={milestonesInView ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
          >
            <span className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
              {milestone.number}
            </span>
            <h3 className="text-lg font-bold mt-2 mb-2 text-gray-800 dark:text-white">
              {milestone.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {milestone.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Featured Image */}
      <motion.div
        className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer"
        onClick={() => setShowImage(true)}
        whileHover={{ scale: 1.02 }}
      >
        <img
          src="https://images.unsplash.com/photo-1608020932658-d0e19a69580b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Badshahi , Kerry"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-8">
          <h3 className="text-2xl font-bold text-white flex items-center">
            <MapPin className="mr-2 w-5 h-5 text-white" /> Faisal Mosque, Pakistan
          </h3>
        </div>

      </motion.div>
  
      {/* Education Section */}
      <EducationSection ref={educationRef} inView={educationInView} />

      {/* Experience Section */}
      <ExperienceSection ref={experienceRef} inView={experienceInView} />

      {/* New Sections */}
      <CertificationSection
        ref={certificationRef}
        inView={certificationInView}
      />

      {/* Fullscreen Image Modal */}
      {showImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setShowImage(false)}
        >
          <motion.img
            src="https://images.unsplash.com/photo-1590273466070-40c466b4432d?auto=format&fit=crop&q=80"
            alt="Torc Mountain, Kerry"
            className="max-w-full max-h-full object-contain rounded-lg"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

{/* Experience and Education section*/}
<expedu />

const CertificationSection = React.forwardRef((props, ref) => (
  <motion.div
    ref={ref}
    className="mb-16"
    initial={{ y: 50, opacity: 0 }}
    animate={props.inView ? { y: 0, opacity: 1 } : {}}
    transition={{ duration: 0.6 }}
  >
    <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
      Certification
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <CertificationCard
        imgSrc="https://via.placeholder.com/150"
        title="IBM Data Science Professional Certificate"
        text="IBM, 2023"
      />
      <CertificationCard
        imgSrc="https://via.placeholder.com/150"
        title="Google Data Analytics Certificate"
        text="Google, 2023"
      />
    </div>
  </motion.div>
));

const CertificationCard = ({ imgSrc, title, text }) => (
  <motion.div
    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex items-center"
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.3 }}
  >
    <img
      src={imgSrc}
      alt="Certification Thumbnail"
      className="w-32 h-32 rounded-lg mr-4" // Larger size
    />
    <div>
      <h3 className="text-xl font-bold text-gray-800 dark:text-white">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">{text}</p>
      <button className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-colors">
        Verify Certification
      </button>
    </div>
  </motion.div>
);
                              
export default About;
