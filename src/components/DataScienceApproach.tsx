import React, { useState } from 'react';
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
import { 
  Alert,
  AlertDescription
} from "@/components/ui/alert"

const DataScienceApproach = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      icon: Brain,
      title: "Problem Understanding",
      description: "Deep dive into business context and requirements. Define clear objectives and success metrics. Understand stakeholder needs and constraints.",
      details: "• Stakeholder interviews\n• Problem framing\n• Success criteria definition"
    },
    {
      icon: Database,
      title: "Data Collection & Cleaning",
      description: "Gather relevant data sources, assess data quality, and perform thorough cleaning. Handle missing values, outliers, and ensure data integrity.",
      details: "• Data source identification\n• Quality assessment\n• Data preprocessing"
    },
    {
      icon: Search,
      title: "Exploratory Data Analysis",
      description: "Uncover patterns, relationships, and insights through visualization and statistical analysis. Generate and validate hypotheses.",
      details: "• Statistical analysis\n• Data visualization\n• Pattern recognition"
    },
    {
      icon: GitBranch,
      title: "Feature Engineering",
      description: "Create meaningful features, transform variables, and select the most relevant attributes for modeling.",
      details: "• Feature creation\n• Dimensionality reduction\n• Feature selection"
    },
    {
      icon: Code2,
      title: "Model Development",
      description: "Select and implement appropriate machine learning algorithms. Tune parameters and validate model performance.",
      details: "• Algorithm selection\n• Model training\n• Hyperparameter tuning"
    },
    {
      icon: RefreshCw,
      title: "Iteration & Deployment",
      description: "Refine models based on feedback, prepare for deployment, and establish monitoring systems.",
      details: "• Model refinement\n• Performance monitoring\n• Deployment strategy"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">My Approach to Data Science</h2>
        <p className="text-lg text-gray-600 mb-8">
          Data science is a mix of curiosity, creativity, and systematic problem-solving. 
          Every project is unique, but here's my general approach to tackling data science challenges.
        </p>
        
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Note: Data Science is inherently experimental. While this framework provides structure,
            each project may require different approaches and iterations.
          </AlertDescription>
        </Alert>
      </div>

      <div className="space-y-12">
        {steps.map((step, index) => (
          <div 
            key={index}
            className={`flex gap-6 transition-all duration-300 transform
              ${activeStep === index ? 'scale-105' : 'scale-100'}
              hover:scale-105 cursor-pointer`}
            onMouseEnter={() => setActiveStep(index)}
          >
            <div className="flex-shrink-0 w-16">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center
                ${activeStep === index ? 'bg-blue-500' : 'bg-gray-200'}
                transition-colors duration-300`}>
                <step.icon 
                  className={`w-8 h-8 
                    ${activeStep === index ? 'text-white' : 'text-gray-600'}`}
                />
              </div>
              {index < steps.length - 1 && (
                <div className="w-1 h-20 bg-gray-200 mx-auto mt-2" />
              )}
            </div>
            
            <div className="flex-grow">
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600 mb-3">{step.description}</p>
              <div className={`bg-gray-50 p-4 rounded-lg transition-all duration-300
                ${activeStep === index ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                {step.details.split('\n').map((detail, i) => (
                  <p key={i} className="mb-1 text-gray-700">{detail}</p>
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
