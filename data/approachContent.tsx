export const approachContent = {
  dataCollection: {
    title: "Data Collection Process",
    content: (
      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">Data Sources</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
            <li>Multiple Listing Service (MLS) databases</li>
            <li>Public property records and tax assessments</li>
            <li>Geographic and demographic data from census</li>
            <li>Economic indicators from federal reserve</li>
            <li>Local market trends and statistics</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">Collection Methods</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
            <li>API integrations with real estate databases</li>
            <li>Automated web scraping of public records</li>
            <li>Direct partnerships with real estate agencies</li>
            <li>Regular updates from government databases</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">Data Processing</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
            <li>Automated data cleaning pipelines</li>
            <li>Standardization of different data formats</li>
            <li>Missing value imputation using advanced techniques</li>
            <li>Feature engineering for model input</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">Quality Assurance</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
            <li>Automated data validation checks</li>
            <li>Regular data quality audits</li>
            <li>Cross-reference verification with multiple sources</li>
            <li>Manual verification of outliers</li>
          </ul>
        </section>
      </div>
    )
  },
  modelDevelopment: {
    title: "Model Development Details",
    content: (
      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">Model Architecture</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
            <li>Ensemble of gradient boosting and neural networks</li>
            <li>Custom feature extraction layers</li>
            <li>Attention mechanisms for location importance</li>
            <li>Time-series components for market trends</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">Training Process</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
            <li>Distributed training on cloud infrastructure</li>
            <li>Custom loss function for price range prediction</li>
            <li>Dynamic learning rate scheduling</li>
            <li>Regular model retraining with new data</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">Optimization Techniques</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
            <li>Hyperparameter tuning using Bayesian optimization</li>
            <li>Model pruning for efficiency</li>
            <li>Quantization for deployment</li>
            <li>Ensemble weight optimization</li>
          </ul>
        </section>
      </div>
    )
  },
  validation: {
    title: "Validation Methodology",
    content: (
      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">Testing Framework</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
            <li>K-fold cross-validation</li>
            <li>Out-of-time validation</li>
            <li>Geographic segmentation tests</li>
            <li>Price range specific validation</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">Performance Metrics</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
            <li>Mean Absolute Percentage Error (MAPE)</li>
            <li>Root Mean Square Error (RMSE)</li>
            <li>R-squared value</li>
            <li>Confidence interval accuracy</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">Real-world Testing</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
            <li>A/B testing with real estate agents</li>
            <li>Comparison with human expert valuations</li>
            <li>Market feedback integration</li>
            <li>Long-term accuracy tracking</li>
          </ul>
        </section>
      </div>
    )
  }
};
