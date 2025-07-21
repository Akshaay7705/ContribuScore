import React from 'react';
import { GitBranch, Github } from 'lucide-react';

export default function LoginForm() {
  const handleGitHubLogin = () => {
    // In a real app, this would redirect to GitHub OAuth
    // For demo purposes, we'll simulate the login
    window.location.href = import.meta.env.VITE_BACKEND_ROUTE + '/api/auth/github';
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <GitBranch className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome to PR Insight</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Analyze your GitHub contributions and track your pull request performance
            </p>
          </div>

          {/* GitHub Login Button */}
          <div className="space-y-6">
            <button
              onClick={handleGitHubLogin}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-3 group"
            >
              <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Continue with GitHub</span>
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                We'll access your public repositories and pull request data to provide insights
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Track pull request acceptance rates</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Analyze code review feedback</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Generate contribution insights</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Share your developer profile</span>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <p className="text-xs text-blue-800 dark:text-blue-300">
              <strong>Privacy:</strong> We only access public repository data and never store your GitHub credentials. 
              You can revoke access at any time from your GitHub settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}