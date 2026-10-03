import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import StudentInputForm from '../components/StudentInputForm';
import LoadingAnimation from '../components/LoadingAnimation';
import PredictionCard from '../components/PredictionCard';
import { predictStudent } from '../services/api';
import { AlertCircle } from 'lucide-react';

const Prediction = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [studentInput, setStudentInput] = useState(null);
  const [error, setError] = useState(null);

  const handleFormSubmit = async (formData, selectedModel) => {
    setError(null);
    setLoading(true);
    setStudentInput(formData);

    try {
      // Execute prediction with selected ML model
      const response = await predictStudent(formData, selectedModel);

      // Brief animation sync delay for visual engagement
      setTimeout(() => {
        if (response && response.success) {
          setResult(response);
        } else {
          setError(response?.message || 'Inference engine encountered an unexpected response.');
        }
        setLoading(false);
      }, 2200);
    } catch (err) {
      console.error('Prediction API call failed:', err);
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to connect to CEREBRO inference backend. Please ensure server is running.');
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Error notification banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 text-rose-300 flex items-center gap-3 backdrop-blur-xl"
          >
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <div className="text-xs">
              <strong className="font-bold">Inference Error:</strong> {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Flow: Input Form | Loading Animation | Result Display */}
      {loading ? (
        <LoadingAnimation active={loading} />
      ) : result ? (
        <PredictionCard
          result={result}
          studentInput={studentInput}
          onReset={handleReset}
          onNavigateAnalytics={() => navigate('/analytics')}
        />
      ) : (
        <StudentInputForm onSubmit={handleFormSubmit} isLoading={loading} />
      )}
    </div>
  );
};

export default Prediction;
