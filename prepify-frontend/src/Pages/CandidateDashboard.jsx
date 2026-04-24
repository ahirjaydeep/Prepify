import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_SEVER;

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName") || "Candidate";

  const [tab, setTab] = useState("browse"); // "browse" | "applications"
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [myInterviews, setMyInterviews] = useState([]); // [{jobId, createdAt}]
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null); // for detail modal
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!userId) { navigate("/mode-select?role=candidate", { replace: true }); return; }
    fetchData();
  }, [userId]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [jobsRes, appliedRes, interviewsRes] = await Promise.all([
        axios.get(`${API}api/v1/job/all`),
        axios.post(`${API}api/v1/job/applied-jobs`, { clerkID: userId }),
        axios.post(`${API}api/v1/interview/by-candidate`, { candidateId: userId }),
      ]);
      setJobs(jobsRes.data.data || []);
      const appliedIds = new Set((appliedRes.data.data || []).map((j) => j._id));
      setAppliedJobIds(appliedIds);
      setMyInterviews(interviewsRes.data.data || []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const handleApply = async (job) => {
    setApplyingId(job._id);
    try {
      await axios.post(`${API}api/v1/job/apply`, { clerkID: userId, jobId: job._id });
      setAppliedJobIds((prev) => new Set([...prev, job._id]));
    } catch (err) {
      console.error("Apply failed:", err);
    } finally {
      setApplyingId(null);
    }
  };

  const handleStartInterview = (job) => {
    localStorage.setItem("pendingJobId", job._id);
    localStorage.setItem("pendingJobTitle", job.jobTitle);
    navigate("/start-interview");
  };

  const hasInterviewedForJob = (jobId) =>
    myInterviews.some((iv) => iv.jobId === jobId || iv.jobId?._id === jobId || String(iv.jobId) === String(jobId));

  const filteredJobs = jobs.filter(
    (j) =>
      j.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.jobDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const appliedJobs = jobs.filter((j) => appliedJobIds.has(j._id));

  const signOut = () => {
    ["userId", "userName", "userRole", "interviewId", "pendingJobId", "pendingJobTitle"].forEach(
      (k) => localStorage.removeItem(k)
    );
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950/20 to-gray-950 text-white pt-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-lg">🎯</div>
            <div>
              <h1 className="text-2xl font-black text-white">Candidate Dashboard</h1>
              <p className="text-gray-400 text-sm">Welcome back, <span className="text-blue-400 font-semibold">{userName}</span></p>
            </div>
          </div>
        </div>
        <button onClick={signOut} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all text-sm">
          Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 mb-6">
        <div className="flex gap-2 bg-white/5 rounded-2xl p-1 w-fit">
          {[{ id: "browse", label: "🔍 Browse Jobs" }, { id: "applications", label: `📋 My Applications (${appliedJobIds.size})` }].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${tab === t.id ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-16">
        {/* Browse Tab */}
        {tab === "browse" && (
          <>
            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs by title or description..."
                className="w-full max-w-md px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white/5 rounded-3xl p-6 animate-pulse h-52" />
                ))}
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-24 text-gray-500">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-xl font-semibold">No open jobs found</p>
                <p className="text-sm mt-2">{searchQuery ? "Try a different search term" : "Check back later for new postings"}</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job) => {
                  const applied = appliedJobIds.has(job._id);
                  const interviewed = hasInterviewedForJob(job._id);
                  return (
                    <div
                      key={job._id}
                      className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:border-blue-500/40 hover:bg-white/8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 flex flex-col"
                    >
                      {/* Badge */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center text-2xl">💼</div>
                        {applied && (
                          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${interviewed ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-blue-500/20 text-blue-400 border border-blue-500/30"}`}>
                            {interviewed ? "✅ Interviewed" : "✓ Applied"}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">{job.jobTitle}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed flex-1 line-clamp-3">{job.jobDescription}</p>

                      <button
                        onClick={() => setSelectedJob(job)}
                        className="mt-3 text-xs text-blue-400 hover:text-blue-300 text-left transition-colors"
                      >
                        Read more →
                      </button>

                      <div className="mt-4 flex gap-2">
                        {!applied ? (
                          <button
                            onClick={() => handleApply(job)}
                            disabled={applyingId === job._id}
                            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-0.5 transition-all disabled:opacity-50"
                          >
                            {applyingId === job._id ? "Applying..." : "Apply Now"}
                          </button>
                        ) : !interviewed ? (
                          <button
                            onClick={() => handleStartInterview(job)}
                            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-green-500/25 transform hover:-translate-y-0.5 transition-all"
                          >
                            🎤 Start Interview
                          </button>
                        ) : (
                          <div className="flex-1 py-2.5 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 font-semibold text-sm text-center">
                            Interview Complete ✓
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Applications Tab */}
        {tab === "applications" && (
          <div>
            {loading ? (
              <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="bg-white/5 rounded-3xl p-6 animate-pulse h-28" />)}</div>
            ) : appliedJobs.length === 0 ? (
              <div className="text-center py-24 text-gray-500">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-xl font-semibold">No applications yet</p>
                <p className="text-sm mt-2">Browse jobs and apply to get started</p>
                <button onClick={() => setTab("browse")} className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all">
                  Browse Jobs
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {appliedJobs.map((job) => {
                  const interviewed = hasInterviewedForJob(job._id);
                  return (
                    <div key={job._id} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center justify-between hover:border-blue-500/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center text-2xl">💼</div>
                        <div>
                          <h3 className="font-bold text-white">{job.jobTitle}</h3>
                          <p className="text-gray-400 text-sm line-clamp-1 max-w-md">{job.jobDescription}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${interviewed ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"}`}>
                          {interviewed ? "✅ Interviewed" : "⏳ Pending Interview"}
                        </span>
                        {!interviewed && (
                          <button
                            onClick={() => handleStartInterview(job)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-sm hover:shadow-lg transition-all"
                          >
                            🎤 Interview
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
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedJob(null)}>
          <div className="bg-gray-900 border border-white/10 rounded-3xl p-8 max-w-lg w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-black text-white">{selectedJob.jobTitle}</h2>
              <button onClick={() => setSelectedJob(null)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>
            <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto mb-6">{selectedJob.jobDescription}</div>
            <div className="flex gap-3">
              {!appliedJobIds.has(selectedJob._id) ? (
                <button
                  onClick={() => { handleApply(selectedJob); setSelectedJob(null); }}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:shadow-lg transition-all"
                >
                  Apply Now
                </button>
              ) : !hasInterviewedForJob(selectedJob._id) ? (
                <button
                  onClick={() => { handleStartInterview(selectedJob); setSelectedJob(null); }}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold hover:shadow-lg transition-all"
                >
                  🎤 Start Interview
                </button>
              ) : (
                <div className="flex-1 py-3 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-400 font-semibold text-center">
                  Interview Complete ✓
                </div>
              )}
              <button onClick={() => setSelectedJob(null)} className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all font-medium">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateDashboard;
