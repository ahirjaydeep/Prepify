import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResumeUpload = () => {
  const [candidateName, setCandidateName] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [filePreview, setFilePreview] = useState(null);

  const navigate = useNavigate();
  const candidateId = localStorage.getItem("userId") || null;
  const pendingJobId = localStorage.getItem("pendingJobId") || null;
  const pendingJobTitle = localStorage.getItem("pendingJobTitle") || null;
  const userName = localStorage.getItem("userName") || "";

  // Pre-fill name from stored identity
  useEffect(() => {
    if (userName) setCandidateName(userName);
  }, []);

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const validateForm = () => {
    const errors = {};

    if (!candidateName.trim()) {
      errors.name = "Please enter your full name";
    } else if (candidateName.trim().length < 2) {
      errors.name = "Name must be at least 2 characters long";
    }

    if (!resumeFile) {
      errors.file = "Please upload your resume";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("candidate", candidateName.trim());
    formData.append("file", resumeFile);
    if (pendingJobId) formData.append("jobId", pendingJobId);
    if (candidateId) formData.append("candidateId", candidateId);

    try {
      setLoading(true);
      setUploadProgress(10);

      const response = await axios.post(
        `${import.meta.env.VITE_SEVER}api/v1/interview/start-interview`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            // Real upload progress tracking
            const percent = Math.round(
              (progressEvent.loaded * 80) / (progressEvent.total || 1)
            );
            setUploadProgress(Math.max(10, percent));
          },
        }
      );

      setUploadProgress(100);

      const { interviewId } = response.data.data;

      // Store interviewId for the Interview page to use
      localStorage.setItem("interviewId", interviewId);
      // Clean up job context after starting
      localStorage.removeItem("pendingJobId");
      localStorage.removeItem("pendingJobTitle");

      // Short delay so the user sees 100% before navigating
      setTimeout(() => {
        navigate("/interview");
      }, 600);
    } catch (error) {
      console.error("Error starting interview:", error);
      const serverMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      setFormErrors({ submit: serverMessage });
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (file) => {
    if (!file) return;

    const allowedExtensions = [".docx", ".pdf", ".txt"];
    const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

    if (allowedExtensions.includes(fileExt)) {
      setResumeFile(file);
      setFilePreview({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + " MB",
        type: fileExt === ".docx" ? "Word Document" : fileExt === ".pdf" ? "PDF Document" : "Text File",
      });
      setFormErrors((prev) => ({ ...prev, file: null }));
    } else {
      setFormErrors((prev) => ({
        ...prev,
        file: "Only .docx, .pdf, and .txt files are allowed",
      }));
      setResumeFile(null);
      setFilePreview(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setResumeFile(null);
    setFilePreview(null);
    const input = document.getElementById("resumeInput");
    if (input) input.value = "";
  };

  const tips = [
    { icon: "✨", text: "Ensure your resume is up-to-date" },
    { icon: "🎯", text: "Include relevant skills and experience" },
    { icon: "📝", text: "Use clear formatting and bullet points" },
    { icon: "🚀", text: "Highlight your key achievements" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-hidden relative pt-20 pb-8 px-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-400 opacity-20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-400 opacity-20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-indigo-400 opacity-10 rounded-full blur-2xl animate-bounce"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="w-full max-w-2xl mx-auto relative z-10">
        {/* Main Card */}
        <div
          className={`bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-xl rounded-3xl border border-gray-200 dark:border-gray-800 border-opacity-50 shadow-2xl overflow-hidden transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-8 scale-95"
          }`}
        >
          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-8 text-center overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-10" />
            <div className="relative z-10">
              <div className="inline-block p-4 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm mb-6 group hover:scale-110 transition-transform duration-300">
                <div className="text-5xl animate-bounce">🧠</div>
              </div>
              <h1 className="text-4xl font-black mb-3">Start Your AI Interview</h1>
              <p className="text-blue-100 text-lg max-w-md mx-auto leading-relaxed">
                Upload your resume and let our AI create personalized interview questions just for you
              </p>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-24 h-24 bg-white bg-opacity-10 rounded-full blur-xl animate-pulse" />
            <div
              className="absolute bottom-4 left-4 w-16 h-16 bg-purple-300 bg-opacity-20 rounded-full blur-lg animate-pulse"
              style={{ animationDelay: "1s" }}
            />
          </div>

          {/* Job Context Banner */}
          {pendingJobTitle && (
            <div className="mx-8 mt-6 px-5 py-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3">
              <span className="text-2xl">💼</span>
              <div>
                <p className="text-sm font-bold text-emerald-400">Interviewing for a specific role</p>
                <p className="text-white font-semibold">{pendingJobTitle}</p>
                <p className="text-emerald-300/70 text-xs mt-0.5">AI questions will be tailored to this job description</p>
              </div>
            </div>
          )}

          {/* Form Section */}
          <div className="p-8 space-y-8">
            <div className="space-y-6">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  <span className="text-lg">👤</span>
                  <span>Your Full Name</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => {
                      setCandidateName(e.target.value);
                      setFormErrors((prev) => ({ ...prev, name: null }));
                    }}
                    placeholder="Enter your full name"
                    className={`w-full px-6 py-4 rounded-2xl border-2 transition-all duration-300 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:scale-105 ${
                      formErrors.name
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:border-blue-500"
                    } focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20`}
                  />
                  {candidateName && !formErrors.name && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                {formErrors.name && (
                  <p className="text-red-500 text-sm flex items-center space-x-1">
                    <span>⚠️</span>
                    <span>{formErrors.name}</span>
                  </p>
                )}
              </div>

              {/* File Upload Area */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  <span className="text-lg">📄</span>
                  <span>Resume Upload (.docx, .pdf, .txt)</span>
                </label>

                {!resumeFile ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragActive(true);
                    }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={handleDrop}
                    onClick={() => {
                      const input = document.getElementById("resumeInput");
                      if (input) input.click();
                    }}
                    className={`relative flex flex-col items-center justify-center w-full h-48 border-4 border-dashed rounded-2xl cursor-pointer transition-all duration-300 group ${
                      dragActive
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105"
                        : formErrors.file
                        ? "border-red-400 bg-red-50 dark:bg-red-900/10"
                        : "border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                    }`}
                  >
                    <div className="text-center space-y-4 pointer-events-none">
                      <div
                        className={`text-6xl transition-all duration-300 ${
                          dragActive ? "animate-bounce scale-110" : "group-hover:animate-bounce"
                        }`}
                      >
                        {dragActive ? "🎯" : "📁"}
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                          {dragActive ? "Drop your resume here!" : "Click to upload or drag & drop"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Supports:{" "}
                          <span className="font-medium text-blue-600">.docx, .pdf, .txt</span>
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                          Max file size: 10MB
                        </p>
                      </div>
                    </div>

                    <input
                      id="resumeInput"
                      type="file"
                      accept=".docx,.pdf,.txt"
                      className="hidden"
                      onChange={(e) => handleFileChange(e.target.files[0])}
                    />
                  </div>
                ) : (
                  /* File Preview */
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-300 dark:border-green-600 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white text-xl">
                          📄
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            {filePreview?.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {filePreview?.type} • {filePreview?.size}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {formErrors.file && (
                  <p className="text-red-500 text-sm flex items-center space-x-1">
                    <span>⚠️</span>
                    <span>{formErrors.file}</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="space-y-4">
                {formErrors.submit && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <p className="text-red-600 dark:text-red-400 text-sm flex items-center space-x-2">
                      <span>❌</span>
                      <span>{formErrors.submit}</span>
                    </p>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="relative w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold py-5 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:hover:transform-none disabled:cursor-not-allowed overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative flex items-center justify-center space-x-3">
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        <span className="text-lg">Processing Resume...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl group-hover:animate-bounce">🚀</span>
                        <span className="text-lg">Start My AI Interview</span>
                        <svg
                          className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </>
                    )}
                  </div>

                  {/* Real upload progress bar */}
                  {loading && uploadProgress > 0 && (
                    <div
                      className="absolute bottom-0 left-0 h-1 bg-white bg-opacity-50 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  )}
                </button>
              </div>
            </div>

            {/* Tips Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800/30">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center space-x-2">
                <span className="text-xl">💡</span>
                <span>Resume Tips for Better Results</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tips.map((tip, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 bg-opacity-50 rounded-xl p-3 hover:scale-105 transition-transform duration-200"
                  >
                    <span className="text-lg">{tip.icon}</span>
                    <span>{tip.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Notice */}
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span>Your resume is processed securely and deleted from our servers immediately after parsing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;