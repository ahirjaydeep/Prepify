import React, { useState, useEffect, useRef } from "react";
import { Mic, Send, MessageSquare, Bot, User, Waves } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Interview = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]); // { role: "ai" | "user", text: string }
  const [listening, setListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [typedMessage, setTypedMessage] = useState("");
  const [interviewId] = useState(() => localStorage.getItem("interviewId"));
  const messagesEndRef = useRef(null);

  // Guard: if no interviewId, redirect back to upload page
  useEffect(() => {
    if (!interviewId) {
      navigate("/start-interview", { replace: true });
    }
  }, [interviewId, navigate]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speak = (text) => {
    window.speechSynthesis.cancel(); // cancel any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser. Please use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;

    let finalTranscript = "";
    let debounceTimer = null;
    let isSpeaking = false;

    recognition.onstart = () => {
      setListening(true);
      isSpeaking = true;
    };

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) finalTranscript += result[0].transcript + " ";
      }

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        isSpeaking = false;
        recognition.stop();
      }, 3000);
    };

    recognition.onend = () => {
      if (isSpeaking) {
        recognition.start();
      } else {
        setListening(false);
        const trimmed = finalTranscript.trim();
        if (trimmed) handleUserMessage(trimmed);
      }
    };

    recognition.onerror = (e) => {
      console.error("Speech Recognition Error:", e.error);
      setListening(false);
    };

    recognition.start();
  };

  const handleUserMessage = async (message) => {
    if (!interviewId) return;

    // Optimistically add user message
    const userMsg = { role: "user", text: message };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setTypedMessage("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SEVER}api/v1/interview/continue-interview`,
        { interviewId, userMessage: message }
      );
      const aiText = res.data.data.aiMessage;
      setMessages((prev) => [...prev, { role: "ai", text: aiText }]);
      speak(aiText);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "❌ Something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendText = () => {
    const trimmed = typedMessage.trim();
    if (trimmed && !isLoading) handleUserMessage(trimmed);
  };

  if (!interviewId) return null; // redirect in progress

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-black">
      {/* Floating Background Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-32 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-indigo-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse" />

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[30vh] px-6 text-center z-10 pt-32 pb-4">
        <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text mb-4">
          Interview Session
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl">
          Speak naturally or type your answers.{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            Prepify
          </span>{" "}
          will guide you with real-time AI feedback and scoring.
        </p>
      </section>

      {/* Chat Panel */}
      <div className="relative max-w-5xl mx-auto px-6 py-8 z-10">
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-800/60 overflow-hidden">
          
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-gray-100/70 to-white/40 dark:from-gray-800/60 dark:to-gray-900/50 backdrop-blur-lg border-b border-gray-200/30 dark:border-gray-700/50 p-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 dark:text-white text-lg">
                  Conversation
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Real-time interview transcript
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                {messages.length} messages
              </span>
              {/* End Interview button */}
              <button
                onClick={() => {
                  window.speechSynthesis.cancel();
                  localStorage.removeItem("interviewId");
                  navigate("/");
                }}
                className="text-xs px-4 py-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-all duration-200 font-medium"
              >
                End Interview
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="h-[460px] overflow-y-auto p-8 space-y-6 scrollbar-thin scrollbar-thumb-gray-400/30 dark:scrollbar-thumb-gray-600/40 scrollbar-track-transparent">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 space-y-4">
                <div className="text-6xl">🤖</div>
                <p className="text-lg font-medium">Your interview is ready!</p>
                <p className="text-sm max-w-xs">
                  Click <strong>Start Speaking</strong> or type in the box below to begin. The AI interviewer will greet you with the first question.
                </p>
                <button
                  onClick={() => handleUserMessage("Hello, I'm ready to start the interview.")}
                  className="mt-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  🚀 Begin Interview
                </button>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 shadow-blue-500/25"
                        : "bg-gradient-to-r from-gray-600 to-gray-700 shadow-gray-700/30"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User className="w-6 h-6 text-white" />
                    ) : (
                      <Bot className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] px-6 py-4 rounded-3xl backdrop-blur-sm shadow-xl transition-all duration-300 ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-lg shadow-blue-600/25"
                        : "bg-white/90 dark:bg-gray-800/80 dark:text-gray-100 text-gray-800 rounded-tl-lg border border-gray-100/50 dark:border-gray-700/50"
                    }`}
                  >
                    <p className="leading-relaxed font-medium whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))
            )}

            {/* AI typing indicator */}
            {isLoading && (
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center shadow-lg">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="px-6 py-4 bg-white/90 dark:bg-gray-800/80 rounded-3xl rounded-tl-lg border border-gray-100/50 dark:border-gray-700/50 shadow-xl">
                  <div className="flex space-x-2 items-center h-6">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Controls */}
          <div className="sticky bottom-0 p-6 border-t border-gray-200/30 dark:border-gray-700/50 bg-gradient-to-r from-white/90 via-gray-50/70 to-white/90 dark:from-gray-900/70 dark:via-gray-950/80 dark:to-gray-900/70 backdrop-blur-xl">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Mic Button */}
              <button
                onClick={startListening}
                disabled={isLoading || listening}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold shadow-xl transition-all duration-300 ${
                  listening
                    ? "bg-gradient-to-r from-red-500 to-pink-600 text-white animate-pulse"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/25 hover:shadow-2xl transform hover:-translate-y-1"
                } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
              >
                {listening ? (
                  <Waves className="w-5 h-5 animate-pulse" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
                {listening ? "Listening..." : "Start Speaking"}
              </button>

              {/* Text Input */}
              <div className="flex flex-1 gap-2">
                <input
                  type="text"
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  placeholder="Type your response..."
                  onKeyDown={(e) => e.key === "Enter" && handleSendText()}
                  className="flex-1 px-6 py-4 rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/70 bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg dark:text-gray-100 transition-all"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendText}
                  disabled={isLoading || !typedMessage.trim()}
                  className="px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
