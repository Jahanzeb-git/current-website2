import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  Brain,
  LineChart,
  Database,
  Search,
  GitBranch,
  Code2,
  RefreshCw,
  AlertCircle,
  ChevronDown
} from 'lucide-react';

const DataScienceApproach = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Memoize steps data to prevent unnecessary re-renders
  const steps = useMemo(() => [
    {
      icon: Brain,
      title: "Problem Understanding",
      description: "Deep dive into business context and requirements. Define clear objectives and success metrics. Understand stakeholder needs and constraints.",
      details: [
        "Stakeholder interviews and requirement gathering",
        "Problem framing and objective definition",
        "Success criteria and KPI establishment",
        "Constraint identification and risk assessment"
      ],
      color: "from-purple-500 to-indigo-600"
    },
    {
      icon: Database,
      title: "Data Collection & Cleaning",
      description: "Gather relevant data sources, assess data quality, and perform thorough cleaning. Handle missing values, outliers, and ensure data integrity.",
      details: [
        "Data source identification and acquisition",
        "Data quality assessment and profiling",
        "Missing value imputation strategies",
        "Outlier detection and treatment"
      ],
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Search,
      title: "Exploratory Data Analysis",
      description: "Uncover patterns, relationships, and insights through visualization and statistical analysis. Generate and validate hypotheses.",
      details: [
        "Statistical summary and distribution analysis",
        "Correlation and relationship discovery",
        "Interactive data visualization",
        "Hypothesis generation and testing"
      ],
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: GitBranch,
      title: "Feature Engineering",
      description: "Create meaningful features, transform variables, and select the most relevant attributes for modeling.",
      details: [
        "Feature creation and transformation",
        "Dimensionality reduction techniques",
        "Feature selection and ranking",
        "Domain-specific feature engineering"
      ],
      color: "from-yellow-500 to-orange-600"
    },
    {
      icon: Code2,
      title: "Model Development",
      description: "Select and implement appropriate machine learning algorithms. Tune parameters and validate model performance.",
      details: [
        "Algorithm selection and comparison",
        "Model training and validation",
        "Hyperparameter optimization",
        "Cross-validation and performance metrics"
      ],
      color: "from-red-500 to-pink-600"
    },
    {
      icon: RefreshCw,
      title: "Iteration & Deployment",
      description: "Refine models based on feedback, prepare for deployment, and establish monitoring systems.",
      details: [
        "Model refinement and optimization",
        "Production deployment pipeline",
        "Performance monitoring and alerting",
        "Continuous improvement strategy"
      ],
      color: "from-indigo-500 to-purple-600"
    }
  ], []);

  // Optimized scroll to step function with debouncing
  const scrollToStep = useCallback((stepIndex: number) => {
    const targetElement = stepsRef.current[stepIndex];
    if (!targetElement) return;

    setIsScrolling(true);
    
    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Use requestAnimationFrame for smoother scrolling
    requestAnimationFrame(() => {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    });
    
    // Extended timeout to ensure smooth scrolling completion
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1500);
  }, []);

  // Optimized intersection observer with better performance
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-35% 0px -35% 0px',
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0] // Multiple thresholds for better accuracy
    };

    // Debounced callback to prevent excessive state updates
    let debounceTimer: ReturnType<typeof setTimeout>;
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      if (isScrolling) return;
      
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        // Find the entry with the highest intersection ratio
        let maxRatio = 0;
        let activeIndex = -1;
        
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            const stepIndex = stepsRef.current.indexOf(entry.target as HTMLDivElement);
            if (stepIndex !== -1) {
              maxRatio = entry.intersectionRatio;
              activeIndex = stepIndex;
            }
          }
        });
        
        // Only update if we found a valid active step
        if (activeIndex !== -1 && activeIndex !== activeStep) {
          setActiveStep(activeIndex);
        }
      }, 50); // 50ms debounce
    };

    observerRef.current = new IntersectionObserver(handleIntersect, observerOptions);
    const observer = observerRef.current;

    // Observe all step elements
    const currentRefs = stepsRef.current.filter(Boolean);
    currentRefs.forEach((step) => {
      if (step) observer.observe(step);
    });

    return () => {
      clearTimeout(debounceTimer);
      if (observer) {
        currentRefs.forEach((step) => {
          if (step) observer.unobserve(step);
        });
        observer.disconnect();
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isScrolling, activeStep]);

  // Memoized step component for better performance
  const StepComponent = useMemo(() => 
    ({ step, index, isActive }: { step: typeof steps[0], index: number, isActive: boolean }) => (
      <div
        ref={(el) => (stepsRef.current[index] = el)}
        className={`relative transition-all duration-300 ease-out py-8 lg:py-12 ${
          isActive ? 'opacity-100' : 'opacity-75'
        }`}
        style={{ willChange: isActive ? 'transform, opacity' : 'auto' }}
      >
        <div className={`flex flex-col lg:flex-row gap-6 lg:gap-10 p-6 lg:p-8 rounded-2xl border transition-all duration-300 ${
          isActive
            ? 'bg-white dark:bg-gray-800 shadow-xl dark:shadow-2xl border-gray-200 dark:border-gray-700 scale-[1.01]'
            : 'bg-gray-50 dark:bg-gray-900/50 shadow-md border-gray-100 dark:border-gray-800 hover:shadow-lg hover:bg-white dark:hover:bg-gray-800/70'
        }`}>
          
          {/* Icon and Number */}
          <div className="flex-shrink-0 lg:w-20">
            <div className="relative">
              <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg transition-all duration-300 ${
                isActive ? 'scale-105 shadow-2xl' : ''
              }`}>
                <step.icon className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
              </div>
              
              <div className="absolute -top-2 -right-2 w-7 h-7 lg:w-8 lg:h-8 rounded-full border-2 flex items-center justify-center text-xs lg:text-sm font-bold shadow-md bg-white border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200">
                {index + 1}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-grow space-y-4">
            <div>
              <h3 className="text-xl lg:text-2xl xl:text-3xl font-bold mb-3 text-gray-900 dark:text-white">
                {step.title}
              </h3>
              <p className="text-base lg:text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                {step.description}
              </p>
            </div>

            {/* Details List */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 p-4 lg:p-6 rounded-xl transition-all duration-300 border ${
              isActive
                ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 dark:from-blue-900/30 dark:to-indigo-900/30 dark:border-blue-800/30'
                : 'bg-gray-100 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
            }`}>
              {step.details.map((detail, i) => (
                <div key={i} className="flex items-start gap-3">
                  <ChevronDown className={`w-4 h-4 mt-1 flex-shrink-0 transition-colors duration-300 ${
                    isActive 
                      ? 'text-blue-500 dark:text-blue-400'
                      : 'text-gray-400 dark:text-gray-500'
                  }`} />
                  <span className={`text-sm font-medium transition-colors duration-300 ${
                    isActive 
                      ? 'text-gray-800 dark:text-gray-200'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ), []);

  return (
    <div>
      <div className="max-w-6xl mx-auto p-4 lg:p-6 xl:p-8">
        {/* Header Section */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 border border-transparent dark:border-blue-800/30">
            <LineChart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">
              Data Science Methodology
            </span>
          </div>
          
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            My Approach to Data Science
          </h2>
          
          <p className="text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed mb-8 text-gray-600 dark:text-gray-300">
            Data science is a blend of curiosity, creativity, and systematic problem-solving. 
            Every project is unique, but here's my structured approach to tackling complex data challenges.
          </p>

          {/* Optimized Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 rounded-full p-2 shadow-lg border bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToStep(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    activeStep === index
                      ? 'bg-blue-500 dark:bg-blue-400 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500'
                  }`}
                  aria-label={`Go to step ${index + 1}: ${steps[index].title}`}
                />
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="flex items-start p-4 lg:p-6 rounded-xl shadow-sm max-w-2xl mx-auto border bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/30">
            <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <p className="text-sm leading-relaxed text-amber-800 dark:text-amber-200">
              <strong>Note:</strong> Data Science is inherently experimental. While this framework provides structure, 
              each project may require different approaches, iterations, and adaptations.
            </p>
          </div>
        </div>

        {/* Steps Section */}
        <div className="space-y-6 lg:space-y-8">
          {steps.map((step, index) => (
            <StepComponent
              key={index}
              step={step}
              index={index}
              isActive={activeStep === index}
            />
          ))}
        </div>

        {/* Optimized Footer CTA */}
        <div className="text-center mt-16 lg:mt-20 p-6 lg:p-8 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl">
          <h3 className="text-xl lg:text-2xl font-bold mb-4">Ready to Transform Your Data?</h3>
          <p className="mb-6 max-w-2xl mx-auto text-sm lg:text-base text-blue-100">
            Let's collaborate to unlock insights from your data and drive meaningful business outcomes through strategic data science solutions.
          </p>
          <button className="px-6 lg:px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg bg-white text-blue-600 hover:bg-gray-100 hover:scale-105 active:scale-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600">
            Get in Touch
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataScienceApproach;