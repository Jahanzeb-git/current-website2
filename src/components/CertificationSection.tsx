import React, { useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Award, Calendar, BookOpen } from 'lucide-react';

interface Certification {
  id: string;
  thumbnail: string;
  institutionLogo: string;
  title: string;
  description: string;
  institution: string;
  date: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  buildTowardDegree: boolean;
  skills: string[];
  verificationUrl: string;
  courseraLogo?: boolean;
}

interface CertificationSectionProps {
  inView: boolean;
}

const certifications: Certification[] = [
  {
    id: '1',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&crop=center&q=80',
    institutionLogo: 'https://logos-world.net/wp-content/uploads/2020/09/IBM-Logo.png',
    title: 'IBM Data Science Professional Certificate',
    description: 'Comprehensive program covering data science fundamentals, machine learning, and practical applications using industry-standard tools and techniques.',
    institution: 'IBM',
    date: '2023',
    level: 'Intermediate',
    buildTowardDegree: true,
    skills: ['Python', 'Machine Learning', 'SQL', 'Jupyter', 'Plotly', 'Data Wrangling', 'EDA', 'Pandas'],
    verificationUrl: 'https://www.coursera.org/professional-certificates/ibm-data-science',
    courseraLogo: true,
  },
  {
    id: '2',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&crop=center&q=80',
    institutionLogo: 'https://logos-world.net/wp-content/uploads/2020/09/Google-Logo.png',
    title: 'Google Advanced Data Analytics Certificate',
    description: 'Advanced analytics program focusing on statistical analysis, predictive modeling, and business intelligence using Google tools and methodologies.',
    institution: 'Google',
    date: '2023',
    level: 'Intermediate',
    buildTowardDegree: true,
    skills: ['R', 'Tableau', 'BigQuery', 'Statistical Analysis', 'Predictive Modeling', 'Data Visualization', 'Business Intelligence'],
    verificationUrl: 'https://www.coursera.org/professional-certificates/google-advanced-data-analytics',
    courseraLogo: true,
  },
];

// Memoized image component for performance
const OptimizedImage = memo<{
  src: string;
  alt: string;
  className: string;
  loading?: 'lazy' | 'eager';
}>(({ src, alt, className, loading = 'lazy' }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  if (imageError) {
    return (
      <div className={`${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}>
        <span className="text-gray-400 text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {!imageLoaded && (
        <div className={`${className} bg-gray-200 dark:bg-gray-700 animate-pulse`} />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        loading={loading}
        onLoad={handleImageLoad}
        onError={handleImageError}
        decoding="async"
      />
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

// Memoized logo component
const InstitutionLogo = memo<{
  src: string;
  alt: string;
  institution: string;
}>(({ src, alt, institution }) => {
  const [logoError, setLogoError] = useState(false);

  const handleLogoError = useCallback(() => {
    setLogoError(true);
  }, []);

  if (logoError) {
    // Fallback to text logo with institution colors
    const getInstitutionColors = (inst: string) => {
      switch (inst.toLowerCase()) {
        case 'ibm':
          return 'bg-blue-600 text-white';
        case 'google':
          return 'bg-red-500 text-white';
        default:
          return 'bg-gray-600 text-white';
      }
    };

    return (
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${getInstitutionColors(institution)}`}>
        {institution.substring(0, 3).toUpperCase()}
      </div>
    );
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className="w-10 h-10 object-contain rounded-lg"
      loading="lazy"
      onError={handleLogoError}
    />
  );
});

InstitutionLogo.displayName = 'InstitutionLogo';

const CertificationCard = memo<{ 
  certification: Certification; 
  index: number; 
  inView: boolean;
}>(({ certification, index, inView }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleVerificationClick = useCallback(() => {
    if (certification.verificationUrl) {
      window.open(certification.verificationUrl, '_blank', 'noopener,noreferrer');
    }
  }, [certification.verificationUrl]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 will-change-transform"
      whileHover={{ y: -8 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-600/5 dark:from-emerald-400/10 dark:to-teal-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Thumbnail */}
      <div className="relative h-48 sm:h-52 overflow-hidden">
        <OptimizedImage
          src={certification.thumbnail}
          alt={certification.title}
          className={`w-full h-full object-cover transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
          loading={index < 2 ? 'eager' : 'lazy'}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Institution Logo */}
        <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
          <InstitutionLogo
            src={certification.institutionLogo}
            alt={certification.institution}
            institution={certification.institution}
          />
        </div>

        {/* Coursera Logo */}
        {certification.courseraLogo && (
          <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
            <svg className="w-4 h-4 inline-block mr-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.374 2.389v1.615c3.596.289 6.452 3.146 6.741 6.741h1.615c-.297-4.64-3.99-8.333-8.356-8.356zm0 3.231v1.615c1.904.289 3.406 1.791 3.695 3.695h1.615c-.297-2.948-2.362-5.013-5.31-5.31zM8.032 10.068L5.5 7.536 4.086 8.95l2.532 2.532L4.086 14.014 5.5 15.428l2.532-2.532 2.532 2.532 1.414-1.414-2.532-2.532 2.532-2.532L10.564 7.536 8.032 10.068z"/>
            </svg>
            Coursera
          </div>
        )}

        {/* Level Badge */}
        <div className="absolute bottom-4 left-4">
          <span className="bg-emerald-600 dark:bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
            {certification.level}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight">
            {certification.title}
          </h3>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>{certification.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="w-4 h-4 flex-shrink-0" />
              <span>{certification.institution}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
          {certification.description}
        </p>

        {/* Build Toward Degree Tag */}
        {certification.buildTowardDegree && (
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              Builds toward degree
            </span>
          </div>
        )}

        {/* Skills */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Skills gained:</h4>
          <div className="flex flex-wrap gap-2">
            {certification.skills.slice(0, 6).map((skill, skillIndex) => (
              <span
                key={skillIndex}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors cursor-default"
              >
                {skill}
              </span>
            ))}
            {certification.skills.length > 6 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-md font-medium">
                +{certification.skills.length - 6} more
              </span>
            )}
          </div>
        </div>

        {/* Verify Button */}
        <motion.button
          className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleVerificationClick}
          aria-label={`Verify ${certification.title}`}
        >
          <ExternalLink className="w-4 h-4 flex-shrink-0" />
          <span>Verify Certification</span>
        </motion.button>
      </div>
    </motion.div>
  );
});

CertificationCard.displayName = 'CertificationCard';

const CertificationSection: React.FC<CertificationSectionProps> = ({ inView }) => {
  return (
    <motion.section
      className="mb-16"
      initial={{ y: 50, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
      aria-labelledby="certifications-heading"
    >
      <div className="text-center mb-8 sm:mb-12">
        <h2 
          id="certifications-heading"
          className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-[#025A4E] to-teal-600 dark:from-emerald-400 dark:to-teal-400 text-transparent bg-clip-text"
        >
          Professional Certifications
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
          Continuously expanding my expertise through industry-recognized certification programs
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {certifications.map((certification, index) => (
          <CertificationCard
            key={certification.id}
            certification={certification}
            index={index}
            inView={inView}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default memo(CertificationSection);