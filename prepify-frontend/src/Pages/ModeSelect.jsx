import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const ModeSelect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role"); // "candidate" | "recruiter"
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 80);
    // If user already has an identity, redirect directly
    const existingRole = localStorage.getItem("userRole");
    const existingName = localStorage.getItem("userName");
    if (existingRole && existingName) {
      navigate(existingRole === "recruiter" ? "/recruiter" : "/candidate", { replace: true });
    }
  }, []);

  if (!roleParam || !["candidate", "recruiter"].includes(roleParam)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <p>Invalid mode. <a href="/" className="text-blue-400 underline">Go Home</a></p>
      </div>
    );
  }

  const isRecruiter = roleParam === "recruiter";

  const handleContinue = () => {
    if (!name.trim() || name.trim().length < 2) {
      setError("Please enter your full name (at least 2 characters)");
      return;
    }
    const userId = "user_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("userId", userId);
    localStorage.setItem("userName", name.trim());
    localStorage.setItem("userRole", roleParam);
    navigate(isRecruiter ? "/recruiter" : "/candidate", { replace: true });
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 relative overflow-hidden ${isRecruiter ? "bg-gradient-to-br from-emerald-950 via-gray-950 to-teal-950" : "bg-gradient-to-br from-blue-950 via-gray-950 to-purple-950"}`}>
      {/* Glow blobs */}
      <div className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse ${isRecruiter ? "bg-emerald-500" : "bg-blue-500"}`} />
      <div className={`absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse ${isRecruiter ? "bg-teal-500" : "bg-purple-500"}`} />

      <div className={`relative z-10 w-full max-w-md transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl">
          {/* Icon */}
          <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center text-4xl shadow-lg ${isRecruiter ? "bg-gradient-to-br from-emerald-500 to-teal-600" : "bg-gradient-to-br from-blue-500 to-purple-600"}`}>
            {isRecruiter ? "👔" : "🎯"}
          </div>

          <h1 className="text-3xl font-black text-white text-center mb-2">
            {isRecruiter ? "Recruiter Mode" : "Candidate Mode"}
          </h1>
          <p className="text-gray-400 text-center mb-8 text-sm">
            {isRecruiter
              ? "Post jobs, review applicants, and view interview transcripts."
              : "Browse jobs, apply, and practice with AI-powered interviews."}
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Your Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                placeholder={isRecruiter ? "e.g. Sarah Johnson" : "e.g. John Smith"}
                className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                autoFocus
              />
              {error && <p className="mt-2 text-red-400 text-sm">⚠️ {error}</p>}
            </div>

            <button
              onClick={handleContinue}
              className={`w-full py-4 rounded-2xl font-bold text-white text-lg shadow-lg transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 ${isRecruiter ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-emerald-500/30 hover:shadow-2xl" : "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-blue-500/30 hover:shadow-2xl"}`}
            >
              Continue as {isRecruiter ? "Recruiter" : "Candidate"} →
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full py-3 rounded-2xl font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm"
            >
              ← Back to Home
            </button>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-4">
          Your session is stored locally. No account needed.
        </p>
      </div>
    </div>
  );
};

export default ModeSelect;
