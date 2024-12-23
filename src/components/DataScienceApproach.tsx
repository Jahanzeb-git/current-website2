import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  LineChart, 
  Database, 
  Search, 
  GitBranch, 
  Code2, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const DataScienceApproach = () => {
  const [activeStep, setActiveStep] = useState(0);
  const { theme } = useTheme();
  const stepsRef = React.useRef([]);

  const steps = [
    {
      icon: Brain,
      title: "Problem Understanding",
      description: "Deep dive into business context and requirements. Define clear objectives and success metrics. Understand stakeholder needs and constraints.",
      details: "\u2022 Stakeholder interviews\n\u2022 Problem framing\n\u2022 Success criteria definition"
    },
    {
      icon: Database,
      title: "Data Collection & Cleaning",
      description: "Gather relevant data sources, assess data quality, and perform thorough cleaning. Handle missing values, outliers, and ensure data integrity.",
      details: "\u2022 Data source identification\n\u2022 Quality assessment\n\u2022 Data preprocessing"
    },
    {
      icon: Search,
      title: "Exploratory Data Analysis",
      description: "Uncover patterns, relationships, and insights through visualization and statistical analysis. Generate and validate hypotheses.",
      details: "\u2022 Statistical analysis\n\u2022 Data visualization\n\u2022 Pattern recognition"
    },
    {
      icon: GitBranch,
      title: "Feature Engineering",
      description: "Create meaningful features, transform variables, and select the most relevant attributes for modeling.",
      details: "\u2022 Feature creation\n\u2022 Dimensionality reduction\n\u2022 Feature selection"
    },
    {
      icon: Code2,
      title: "Model Development",
      description: "Select and implement appropriate machine learning algorithms. Tune parameters and validate model performance.",
      details: "\u2022 Algorithm selection\n\u2022 Model training\n\u2022 Hyperparameter tuning"
    },
    {
      icon: RefreshCw,
      title: "Iteration & Deployment",
      description: "Refine models based on feedback, prepare for deployment, and establish monitoring systems.",
      details: "\u2022 Model refinement\n\u2022 Performance monitoring\n\u2022 Deployment strategy"
    }
  ];

  useEffect(() => {
    const observerOptions = {
      threshold: 0.5 // Trigger when at least 50% of the section is in view
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const stepIndex = stepsRef.current.indexOf(entry.target);
            setActiveStep(stepIndex);
          }
        });
      },
      observerOptions
    );

    stepsRef.current.forEach(step => observer.observe(step));

    return () => {
      stepsRef.current.forEach(step => observer.unobserve(step));
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center mb-12">
        <h2 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          My Approach to Data Science
        </h2>
        <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Data science is a mix of curiosity, creativity, and systematic problem-solving. 
          Every project is unique, but here's my general approach to tackling data science challenges.
        </p>

        <div
          className={`flex items-start p-4 border rounded-lg shadow-sm mb-6 ${
            theme === 'dark' ? 'border-gray-700 bg-gray-800 text-gray-300' : 'border-gray-300 bg-gray-50 text-gray-800'
          }`}
        >
          <AlertCircle className={`h-5 w-5 mr-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`} />
          <p className="text-sm">
            Note: Data Science is inherently experimental. While this framework provides structure, each project may require different approaches and iterations.
          </p>
        </div>
      </div>

      <div className="space-y-12">
        {steps.map((step, index) => (
          <div 
            ref={el => stepsRef.current[index] = el}
            key={index}
            className={`flex gap-6 transition-all duration-300 transform
              ${activeStep === index ? 'scale-105' : 'scale-100'}
              hover:scale-105 cursor-pointer`}
          >
            <div className="flex-shrink-0 w-16">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  activeStep === index
                    ? theme === 'dark'
                      ? 'bg-blue-400'
                      : 'bg-blue-500'
                    : theme === 'dark'
                    ? 'bg-gray-700'
                    : 'bg-gray-200'
                }`}
              >
                <step.icon
                  className={`w-8 h-8 ${
                    activeStep === index ? 'text-white' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                />
              </div>
              {index < steps.length - 1 && (
                <div className={`w-1 h-20 mx-auto mt-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />
              )}
            </div>
            
            <div className="flex-grow">
              <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {step.title}
              </h3>
              <p className={`mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{step.description}</p>
              <div
                className={`p-4 rounded-lg transition-all duration-300 ${
                  activeStep === index
                    ? theme === 'dark'
                      ? 'bg-gray-800 text-gray-300'
                      : 'bg-gray-50 text-gray-700'
                    : 'opacity-0 max-h-0 overflow-hidden'
                }`}
              >
                {step.details.split('\n').map((detail, i) => (
                  <p key={i} className="mb-1">{detail}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataScienceApproach;



