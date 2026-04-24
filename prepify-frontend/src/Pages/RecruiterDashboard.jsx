import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_SEVER;

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName") || "Recruiter";

  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newJob, setNewJob] = useState({ jobTitle: "", jobDescription: "" });
  const [formError, setFormError] = useState("");

  // Selected job panel
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobInterviews, setJobInterviews] = useState([]);
  const [interviewsLoading, setInterviewsLoading] = useState(false);

  // Transcript modal
  const [transcript, setTranscript] = useState(null);
  const [transcriptCandidate, setTranscriptCandidate] = useState("");

  // Selecting a candidate
  const [selecting, setSelecting] = useState(null);

  useEffect(() => {
    if (!userId) { navigate("/mode-select?role=recruiter", { replace: true }); return; }
    fetchMyJobs();
  }, [userId]);

  const fetchMyJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API}api/v1/job/recruiter-jobs`, { recruiterClerkID: userId });
      setMyJobs(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchJobInterviews = async (job) => {
    setSelectedJob(job);
    setJobInterviews([]);
    setInterviewsLoading(true);
    try {
      const res = await axios.post(`${API}api/v1/interview/by-job`, { jobId: job._id });
      setJobInterviews(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch interviews:", err);
    } finally {
      setInterviewsLoading(false);
    }
  };

  const handleCreateJob = async () => {
    if (!newJob.jobTitle.trim()) { setFormError("Job title is required"); return; }
    if (!newJob.jobDescription.trim() || newJob.jobDescription.trim().length < 20) {
      setFormError("Please provide a detailed job description (at least 20 characters)"); return;
    }
    setCreating(true);
    try {
      const res = await axios.post(`${API}api/v1/job/create`, {
        jobTitle: newJob.jobTitle.trim(),
        jobDescription: newJob.jobDescription.trim(),
        recruiterClerkID: userId,
      });
      setMyJobs((prev) => [res.data.data, ...prev]);
      setNewJob({ jobTitle: "", jobDescription: "" });
      setShowCreateForm(false);
      setFormError("");
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to create job. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleCloseJob = async (jobId) => {
    try {
      await axios.post(`${API}api/v1/job/close`, { jobId });
      setMyJobs((prev) => prev.map((j) => j._id === jobId ? { ...j, open: false } : j));
      if (selectedJob?._id === jobId) setSelectedJob((prev) => ({ ...prev, open: false }));
    } catch (err) {
      console.error("Failed to close job:", err);
    }
  };

  const handleSelectCandidate = async (interview) => {
    setSelecting(interview._id);
    try {
      await axios.post(`${API}api/v1/job/select-candidate`, {
        clerkID: interview.candidateId,
        jobId: selectedJob._id,
      });
      // Update local job state
      setMyJobs((prev) => prev.map((j) =>
        j._id === selectedJob._id
          ? { ...j, selectedCandidates: [...(j.selectedCandidates || []), interview.candidateId] }
          : j
      ));
      setSelectedJob((prev) => ({
        ...prev,
        selectedCandidates: [...(prev.selectedCandidates || []), interview.candidateId],
      }));
    } catch (err) {
      console.error("Failed to select candidate:", err);
    } finally {
      setSelecting(null);
    }
  };

  const signOut = () => {
    ["userId", "userName", "userRole"].forEach((k) => localStorage.removeItem(k));
    navigate("/");
  };

  const isSelected = (interview) =>
    (selectedJob?.selectedCandidates || []).includes(interview.candidateId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-emerald-950/20 to-gray-950 text-white pt-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-lg">👔</div>
          <div>
            <h1 className="text-2xl font-black text-white">Recruiter Dashboard</h1>
            <p className="text-gray-400 text-sm">Welcome back, <span className="text-emerald-400 font-semibold">{userName}</span></p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { setShowCreateForm(true); setSelectedJob(null); }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transform hover:-translate-y-0.5 transition-all"
          >
            + Post a Job
          </button>
          <button onClick={signOut} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all text-sm">
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-16 flex gap-6">
        {/* Left: Job List */}
        <div className="w-full lg:w-2/5 xl:w-1/3 flex-shrink-0">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-3xl font-black text-emerald-400">{myJobs.filter((j) => j.open).length}</div>
              <div className="text-gray-400 text-xs mt-1">Active Jobs</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-3xl font-black text-blue-400">
                {myJobs.reduce((a, j) => a + (j.candidatesApplied?.length || 0), 0)}
              </div>
              <div className="text-gray-400 text-xs mt-1">Total Applicants</div>
            </div>
          </div>

          <h2 className="text-lg font-bold text-white mb-4">My Job Postings</h2>

          {loading ? (
            <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="bg-white/5 rounded-2xl p-5 animate-pulse h-24" />)}</div>
          ) : myJobs.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <div className="text-5xl mb-3">📭</div>
              <p className="font-semibold">No jobs posted yet</p>
              <button onClick={() => setShowCreateForm(true)} className="mt-4 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all">
                Post Your First Job
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myJobs.map((job) => (
                <button
                  key={job._id}
                  onClick={() => { setShowCreateForm(false); fetchJobInterviews(job); }}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 ${selectedJob?._id === job._id ? "bg-emerald-500/10 border-emerald-500/50" : "bg-white/5 border-white/10 hover:border-emerald-500/30 hover:bg-white/8"}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white truncate">{job.jobTitle}</h3>
                      <p className="text-gray-400 text-xs mt-1 line-clamp-2">{job.jobDescription}</p>
                    </div>
                    <span className={`flex-shrink-0 text-xs px-2.5 py-1 rounded-full font-semibold ${job.open ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"}`}>
                      {job.open ? "Open" : "Closed"}
                    </span>
                  </div>
                  <div className="flex gap-4 mt-3 text-xs text-gray-500">
                    <span>👥 {job.candidatesApplied?.length || 0} applied</span>
                    <span>✅ {job.selectedCandidates?.length || 0} selected</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Detail Panel */}
        <div className="flex-1 min-w-0">
          {/* Create Job Form */}
          {showCreateForm && (
            <div className="bg-white/5 border border-emerald-500/30 rounded-3xl p-8">
              <h2 className="text-2xl font-black text-white mb-6">Post a New Job</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Job Title</label>
                  <input
                    type="text"
                    value={newJob.jobTitle}
                    onChange={(e) => { setNewJob((p) => ({ ...p, jobTitle: e.target.value })); setFormError(""); }}
                    placeholder="e.g. Senior React Developer"
                    className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Job Description</label>
                  <textarea
                    value={newJob.jobDescription}
                    onChange={(e) => { setNewJob((p) => ({ ...p, jobDescription: e.target.value })); setFormError(""); }}
                    placeholder="Describe the role, responsibilities, required skills, experience level, tech stack, etc. The AI interviewer will use this to generate tailored questions."
                    rows={8}
                    className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none"
                  />
                  <p className="text-gray-500 text-xs mt-1">💡 More detail = better AI interview questions for candidates</p>
                </div>
                {formError && <p className="text-red-400 text-sm">⚠️ {formError}</p>}
                <div className="flex gap-3">
                  <button
                    onClick={handleCreateJob}
                    disabled={creating}
                    className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50"
                  >
                    {creating ? "Posting..." : "Post Job →"}
                  </button>
                  <button
                    onClick={() => { setShowCreateForm(false); setFormError(""); setNewJob({ jobTitle: "", jobDescription: "" }); }}
                    className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Job Applicants Panel */}
          {selectedJob && !showCreateForm && (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-white">{selectedJob.jobTitle}</h2>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2 max-w-lg">{selectedJob.jobDescription}</p>
                </div>
                {selectedJob.open && (
                  <button
                    onClick={() => handleCloseJob(selectedJob._id)}
                    className="flex-shrink-0 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all text-sm font-medium"
                  >
                    Close Job
                  </button>
                )}
              </div>

              <h3 className="text-lg font-bold text-white mb-4">
                Applicants ({selectedJob.candidatesApplied?.length || 0})
              </h3>

              {interviewsLoading ? (
                <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="bg-white/5 rounded-2xl p-5 animate-pulse h-20" />)}</div>
              ) : selectedJob.candidatesApplied?.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <div className="text-5xl mb-3">👥</div>
                  <p>No candidates have applied yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(selectedJob.candidatesApplied || []).map((candidateId) => {
                    const interview = jobInterviews.find((iv) => iv.candidateId === candidateId);
                    const hasInterviewed = !!interview && interview.transcript?.length > 0;
                    const selected = (selectedJob.selectedCandidates || []).includes(candidateId);

                    return (
                      <div
                        key={candidateId}
                        className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${selected ? "bg-emerald-500/10 border-emerald-500/40" : "bg-white/5 border-white/10"}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-xl flex items-center justify-center text-lg">
                            {hasInterviewed ? "🎤" : "👤"}
                          </div>
                          <div>
                            <p className="font-semibold text-white">
                              {interview?.candidate || "Anonymous Candidate"}
                              {selected && <span className="ml-2 text-xs text-emerald-400 font-bold">✅ Selected</span>}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {hasInterviewed
                                ? `Interviewed · ${interview.transcript.length} exchanges · ${new Date(interview.createdAt).toLocaleDateString()}`
                                : "Applied · No interview yet"}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 flex-shrink-0">
                          {hasInterviewed && (
                            <button
                              onClick={() => { setTranscript(interview.transcript); setTranscriptCandidate(interview.candidate); }}
                              className="px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-all text-xs font-semibold"
                            >
                              View Transcript
                            </button>
                          )}
                          {!selected && (
                            <button
                              onClick={() => handleSelectCandidate({ ...interview, candidateId })}
                              disabled={selecting === (interview?._id)}
                              className="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all text-xs font-semibold disabled:opacity-50"
                            >
                              {selecting === interview?._id ? "..." : "Select"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Empty state */}
          {!selectedJob && !showCreateForm && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-600">
              <div className="text-6xl mb-4">👈</div>
              <p className="text-lg font-semibold">Select a job to view applicants</p>
              <p className="text-sm mt-1">or post a new job to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Transcript Modal */}
      {transcript && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setTranscript(null)}>
          <div className="bg-gray-900 border border-white/10 rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
              <h2 className="text-xl font-black text-white">🎤 Interview Transcript — {transcriptCandidate}</h2>
              <button onClick={() => setTranscript(null)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>
            <div className="overflow-y-auto flex-1 space-y-3 pr-2">
              {transcript.map((line, i) => {
                const isCandidate = line.startsWith("Candidate:");
                return (
                  <div key={i} className={`flex gap-3 ${isCandidate ? "flex-row-reverse" : ""}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm ${isCandidate ? "bg-blue-600" : "bg-gray-700"}`}>
                      {isCandidate ? "👤" : "🤖"}
                    </div>
                    <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${isCandidate ? "bg-blue-600/20 border border-blue-500/30 text-blue-100 rounded-tr-sm" : "bg-white/5 border border-white/10 text-gray-300 rounded-tl-sm"}`}>
                      {line.replace(/^(Candidate:|Interviewer:)\s*/, "")}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
