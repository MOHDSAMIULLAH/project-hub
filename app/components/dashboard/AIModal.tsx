'use client';

import { X, Sparkles } from 'lucide-react';
import type { AITaskSuggestion } from '@/types';

interface AIModalProps {
  loading: boolean;
  suggestions: AITaskSuggestion[];
  onClose: () => void;
  onAddSuggestion: (suggestion: AITaskSuggestion) => void;
}

export default function AIModal({ loading, suggestions, onClose, onAddSuggestion }: AIModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-bold text-gray-800">AI Task Suggestions</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mb-4"></div>
            <p className="text-gray-600">Analyzing project and generating tasks...</p>
          </div>
        ) : suggestions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No suggestions available</p>
          </div>
        ) : (
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-2">{suggestion.title}</h4>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          suggestion.priority === 'high'
                            ? 'bg-red-100 text-red-800'
                            : suggestion.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {suggestion.priority.charAt(0).toUpperCase() + suggestion.priority.slice(1)}{' '}
                        Priority
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                        ~{suggestion.estimatedHours}h
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onAddSuggestion(suggestion)}
                    className="ml-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-semibold"
                  >
                    Add Task
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
