import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code, Database, BarChart2, Cpu, Cloud, Search, 
  Filter, ChevronDown, Sparkles, Zap, Star
} from 'lucide-react';

// --- DATA (Unchanged) ---
const toolCategories = [
    {
        id: 'programming',
        title: 'Programming Languages',
        icon: <Code className="w-6 h-6" />,
        gradient: 'from-blue-500 to-purple-600',
        tools: [
            { name: 'Python', proficiency: 'Advanced', years: 5, description: 'NumPy, Pandas, Scikit-learn', },
            { name: 'R', proficiency: 'Intermediate', years: 3, description: 'tidyverse, ggplot2', },
            { name: 'Julia', proficiency: 'Basic', years: 1, description: 'Data analysis, Scientific computing', }
        ]
    },
    {
        id: 'databases',
        title: 'Databases & SQL',
        icon: <Database className="w-6 h-6" />,
        gradient: 'from-emerald-500 to-teal-600',
        tools: [
            { name: 'PostgreSQL', proficiency: 'Expert', years: 6, description: 'Complex queries, Optimization', },
            { name: 'MongoDB', proficiency: 'Advanced', years: 4, description: 'NoSQL, Aggregation pipeline', },
            { name: 'Redis', proficiency: 'Intermediate', years: 2, description: 'Caching, Real-time analytics', }
        ]
    },
    {
        id: 'visualization',
        title: 'Visualization',
        icon: <BarChart2 className="w-6 h-6" />,
        gradient: 'from-pink-500 to-rose-600',
        tools: [
            { name: 'Tableau', proficiency: 'Advanced', years: 4, description: 'Dashboard creation, Story-telling', },
            { name: 'Power BI', proficiency: 'Advanced', years: 3, description: 'Business reporting', },
            { name: 'D3.js', proficiency: 'Intermediate', years: 2, description: 'Custom visualizations', }
        ]
    },
    {
        id: 'ml',
        title: 'Machine Learning',
        icon: <Cpu className="w-6 h-6" />,
        gradient: 'from-violet-500 to-indigo-600',
        tools: [
            { name: 'TensorFlow', proficiency: 'Advanced', years: 3, description: 'Deep learning, Neural networks', },
            { name: 'PyTorch', proficiency: 'Intermediate', years: 2, description: 'Computer vision', },
            { name: 'scikit-learn', proficiency: 'Expert', years: 4, description: 'ML algorithms', }
        ]
    },
    {
        id: 'cloud',
        title: 'Cloud & DevOps',
        icon: <Cloud className="w-6 h-6" />,
        gradient: 'from-sky-500 to-cyan-600',
        tools: [
            { name: 'AWS', proficiency: 'Advanced', years: 4, description: 'SageMaker, EC2, S3', },
            { name: 'Docker', proficiency: 'Advanced', years: 3, description: 'Containerization', },
            { name: 'Git', proficiency: 'Expert', years: 5, description: 'Version control', }
        ]
    },
    {
        id: 'analytics',
        title: 'Data Analytics',
        icon: <Sparkles className="w-6 h-6" />,
        gradient: 'from-amber-500 to-orange-600',
        tools: [
            { name: 'Excel', proficiency: 'Expert', years: 7, description: 'Advanced formulas, Pivot tables', },
            { name: 'Google Analytics', proficiency: 'Advanced', years: 4, description: 'Web analytics, Conversion tracking', },
            { name: 'Jupyter', proficiency: 'Advanced', years: 4, description: 'Interactive computing', }
        ]
    }
];

const proficiencyLevels = ['All', 'Expert', 'Advanced', 'Intermediate', 'Basic'];
const proficiencyStyles = {
    'Expert': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
    'Advanced': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    'Intermediate': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    'Basic': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
};

const proficiencyWidth = {
    'Expert': '100%',
    'Advanced': '80%',
    'Intermediate': '60%',
    'Basic': '40%',
}

// --- MOTION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

const toolVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
};

// --- CHILD COMPONENTS ---

const ToolItem = React.memo(({ tool, categoryGradient }) => (
  <motion.div
    variants={toolVariants}
    layout
    className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50"
  >
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex-grow">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-gray-800 dark:text-white flex items-center">
            {tool.name}
            {tool.proficiency === 'Expert' && <Star className="w-4 h-4 ml-2 text-yellow-400 fill-current" />}
            {tool.proficiency === 'Advanced' && <Zap className="w-4 h-4 ml-2 text-blue-400 fill-current" />}
          </h4>
          <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${proficiencyStyles[tool.proficiency]}`}>
            {tool.proficiency}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {tool.description}
        </p>
      </div>
      <div className="flex-shrink-0 w-full sm:w-48">
        <div className="flex items-center">
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <motion.div 
              className={`h-2.5 rounded-full bg-gradient-to-r ${categoryGradient}`}
              style={{ width: proficiencyWidth[tool. proficiency] }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <span className="ml-3 text-sm text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
            {tool.years}+ yrs
          </span>
        </div>
      </div>
    </div>
  </motion.div>
));

const CategoryCard = React.memo(({ category, isExpanded, onToggle, filteredTools }) => {
  return (
    <motion.div
      variants={cardVariants}
      layout
      transition={{ layout: { duration: 0.4, type: "spring" } }}
      className={`
        relative overflow-hidden rounded-2xl group
        bg-white dark:bg-gray-800/80
        border border-gray-200 dark:border-gray-700
        transition-shadow duration-300
        ${isExpanded ? 'col-span-full shadow-2xl z-20' : 'shadow-lg hover:shadow-xl'}
      `}
      style={{ willChange: 'transform' }} // GPU acceleration hint
    >
      {/* Animated gradient glow effect on hover */}
      <motion.div 
        className={`absolute -inset-4 bg-gradient-to-r ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-400 blur-3xl`}
        style={{ willChange: 'opacity' }}
      />
      
      {/* Main Content */}
      <div className="relative">
        {/* Header */}
        <motion.header
          layout
          onClick={onToggle}
          className="p-6 cursor-pointer"
          initial={false}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div 
                layout
                className={`relative p-3 rounded-xl bg-gradient-to-br ${category.gradient} text-white shadow-lg`}
              >
                {category.icon}
                <div className={`absolute -inset-1 rounded-xl bg-gradient-to-br ${category.gradient} blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300`}/>
              </motion.div>
              <div>
                <motion.h3 layout="position" className="text-xl font-bold text-gray-800 dark:text-white">
                  {category.title}
                </motion.h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            <motion.div className="flex items-center space-x-2" layout>
              <div className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700/50">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {filteredTools.length}
                </span>
              </div>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="p-2"
              >
                <ChevronDown className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </motion.div>
            </motion.div>
          </div>
        </motion.header>

        {/* Expanded content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.section
              key="content"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                visible: { opacity: 1, height: 'auto', transition: { staggerChildren: 0.07, when: "beforeChildren" } },
                hidden: { opacity: 0, height: 0 },
                exit: { opacity: 0, height: 0 }
              }}
              className="px-6 pb-6"
              style={{ overflow: 'hidden' }}
            >
              <div className="grid gap-3 pt-2">
                {filteredTools.map(tool => (
                  <ToolItem key={tool.name} tool={tool} categoryGradient={category.gradient} />
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

// --- MAIN COMPONENT ---
const ToolsAndTechnologies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [proficiencyFilter, setProficiencyFilter] = useState('All');
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const toggleCategory = useCallback((categoryId) => {
    setExpandedCategory(prev => (prev === categoryId ? null : categoryId));
  }, []);
  
  const filteredCategories = useMemo(() => {
    return toolCategories.map(category => {
      const filteredTools = category.tools.filter(tool => {
        const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             tool.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesProficiency = proficiencyFilter === 'All' || tool.proficiency === proficiencyFilter;
        return matchesSearch && matchesProficiency;
      });
      return { ...category, filteredTools };
    }).filter(category => category.filteredTools.length > 0);
  }, [searchTerm, proficiencyFilter]);

  const hasResults = filteredCategories.length > 0;

  return (
    <section className="mb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-black dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4"
        >
          Tools & Technologies
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
        >
          An interactive showcase of my technical skills. Click on any category to expand and explore.
        </motion.p>
      </div>

      {/* Search and Filter Controls */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12"
      >
        <div className="relative group w-full sm:w-auto">
          <Search className={`
            absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300
            ${isSearchFocused ? 'text-blue-500 w-5 h-5' : 'text-gray-400 w-4 h-4'}
          `} />
          <input
            type="text"
            placeholder="Search tools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={`
              w-full sm:w-72 pl-11 pr-4 py-3 rounded-xl border-2 transition-all duration-300
              bg-white dark:bg-gray-800
              ${isSearchFocused 
                ? 'border-blue-500 shadow-lg shadow-blue-500/20 ring-4 ring-blue-500/10' 
                : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
              }
              text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
              focus:outline-none
            `}
          />
        </div>
        
        <div className="relative group w-full sm:w-auto">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={proficiencyFilter}
            onChange={(e) => setProficiencyFilter(e.target.value)}
            className="
              w-full sm:w-48 pl-11 pr-8 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700
              bg-white dark:bg-gray-800
              hover:border-gray-400 dark:hover:border-gray-500
              focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none
              text-gray-800 dark:text-white transition-all duration-300
              appearance-none cursor-pointer
            "
          >
            {proficiencyLevels.map(level => (
              <option key={level} value={level} className="bg-white dark:bg-gray-800 text-black dark:text-white">
                {level === 'All' ? 'All Proficiencies' : level}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none"/>
        </div>
      </motion.div>

      {/* Categories Grid */}
      <AnimatePresence>
        {hasResults ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            layout
          >
            {filteredCategories.map(category => (
              <CategoryCard
                key={category.id}
                category={category}
                isExpanded={expandedCategory === category.id}
                onToggle={() => toggleCategory(category.id)}
                filteredTools={category.filteredTools}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No Tools Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter criteria.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ToolsAndTechnologies;
