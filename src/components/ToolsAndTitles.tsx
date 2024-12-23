import React, { useState, useEffect, useRef } from 'react';
import {
  Code, Database, BarChart2, Cpu, Cloud, Search, 
  ChevronDown, ChevronRight, Filter
} from 'lucide-react';

const toolCategories = [
  {
    title: 'Programming Languages',
    icon: <Code className="w-8 h-8" />,
    tools: [
      { name: 'Python', proficiency: 'Advanced', years: 5, description: 'NumPy, Pandas, Scikit-learn' },
      { name: 'R', proficiency: 'Intermediate', years: 3, description: 'tidyverse, ggplot2' },
      { name: 'Julia', proficiency: 'Basic', years: 1, description: 'Data analysis, Scientific computing' }
    ]
  },
  {
    title: 'Databases & SQL',
    icon: <Database className="w-8 h-8" />,
    tools: [
      { name: 'PostgreSQL', proficiency: 'Expert', years: 6, description: 'Complex queries, Optimization' },
      { name: 'MongoDB', proficiency: 'Advanced', years: 4, description: 'NoSQL, Aggregation pipeline' },
      { name: 'Redis', proficiency: 'Intermediate', years: 2, description: 'Caching, Real-time analytics' }
    ]
  },
  {
    title: 'Visualization',
    icon: <BarChart2 className="w-8 h-8" />,
    tools: [
      { name: 'Tableau', proficiency: 'Advanced', years: 4, description: 'Dashboard creation, Story-telling' },
      { name: 'Power BI', proficiency: 'Advanced', years: 3, description: 'Business reporting' },
      { name: 'D3.js', proficiency: 'Intermediate', years: 2, description: 'Custom visualizations' }
    ]
  },
  {
    title: 'Machine Learning',
    icon: <Cpu className="w-8 h-8" />,
    tools: [
      { name: 'TensorFlow', proficiency: 'Advanced', years: 3, description: 'Deep learning, Neural networks' },
      { name: 'PyTorch', proficiency: 'Intermediate', years: 2, description: 'Computer vision' },
      { name: 'scikit-learn', proficiency: 'Expert', years: 4, description: 'ML algorithms' }
    ]
  },
  {
    title: 'Cloud & DevOps',
    icon: <Cloud className="w-8 h-8" />,
    tools: [
      { name: 'AWS', proficiency: 'Advanced', years: 4, description: 'SageMaker, EC2, S3' },
      { name: 'Docker', proficiency: 'Advanced', years: 3, description: 'Containerization' },
      { name: 'Git', proficiency: 'Expert', years: 5, description: 'Version control' }
    ]
  }
];

const proficiencyLevels = ['All', 'Expert', 'Advanced', 'Intermediate', 'Basic'];

const CategoryCard = ({ category, isExpanded, onToggle, searchTerm, proficiencyFilter }) => {
  const matchingTools = category.tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProficiency = proficiencyFilter === 'All' || tool.proficiency === proficiencyFilter;
    return matchesSearch && matchesProficiency;
  });

  if ((searchTerm || proficiencyFilter !== 'All') && matchingTools.length === 0) return null;

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg overflow-hidden">
      <div
        onClick={onToggle}
        className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
      >
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            {category.icon}
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            {category.title}
          </h3>
        </div>
        {isExpanded ? 
          <ChevronDown className="w-5 h-5 text-gray-500" /> : 
          <ChevronRight className="w-5 h-5 text-gray-500" />
        }
      </div>
      
      {isExpanded && (
        <div className="border-t border-gray-100 dark:border-gray-700">
          {(searchTerm || proficiencyFilter !== 'All' ? matchingTools : category.tools).map((tool) => (
            <div 
              key={tool.name}
              className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-gray-800 dark:text-white">
                    {tool.name}
                  </h4>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-xs rounded-full">
                    {tool.proficiency}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {tool.description}
                </p>
              </div>
              <span className="ml-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {tool.years}+ years
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ToolsAndTechnologies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [proficiencyFilter, setProficiencyFilter] = useState('All');
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  const toggleCategory = (title) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  };

  useEffect(() => {
    if (searchTerm || proficiencyFilter !== 'All') {
      setExpandedCategories(new Set(toolCategories.map(cat => cat.title)));
    }
  }, [searchTerm, proficiencyFilter]);

  return (
    <section className="mb-20 max-w-4xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-0">
          Tools & Technologies
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="relative w-full sm:w-48">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={proficiencyFilter}
              onChange={(e) => setProficiencyFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
            >
              {proficiencyLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {toolCategories.map((category) => (
          <CategoryCard
            key={category.title}
            category={category}
            isExpanded={expandedCategories.has(category.title)}
            onToggle={() => toggleCategory(category.title)}
            searchTerm={searchTerm}
            proficiencyFilter={proficiencyFilter}
          />
        ))}
      </div>

      {toolCategories.every(category => 
        category.tools.every(tool => {
          const matchesSearch = !tool.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                              !tool.description.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesProficiency = proficiencyFilter !== 'All' && tool.proficiency !== proficiencyFilter;
          return matchesSearch || matchesProficiency;
        })
      ) && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No tools found matching your criteria.
        </div>
      )}
    </section>
  );
};

export default ToolsAndTechnologies;
