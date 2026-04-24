import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    title: "Real-time Interview Simulation",
    desc: "Experience intelligent, adaptive interview questions tailored to your resume and responses.",
    icon: "🧠",
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Instant Evaluation",
    desc: "Get detailed feedback, skill ratings, and actionable insights instantly after your interview.",
    icon: "📊",
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Effortless Resume Upload",
    desc: "Upload your resume in seconds. No setup, no hassle — just seamless interview prep.",
    icon: "📄",
    color: "from-green-500 to-emerald-500"
  },
  {
    title: "Voice Recognition",
    desc: "Advanced speech-to-text technology captures your responses naturally and accurately.",
    icon: "🎙️",
    color: "from-orange-500 to-red-500"
  },
  {
    title: "Multi-Domain Support",
    desc: "Practice for technical, behavioral, HR, and industry-specific interview rounds.",
    icon: "🎯",
    color: "from-indigo-500 to-blue-500"
  },
  {
    title: "Progress Tracking",
    desc: "Monitor your improvement over time with detailed analytics and performance metrics.",
    icon: "📈",
    color: "from-teal-500 to-green-500"
  },
];

const steps = [
  {
    title: "Upload Resume",
    desc: "Quickly upload your resume in .docx format and get started instantly.",
    icon: "📂",
    step: "01"
  },
  {
    title: "Answer AI Questions",
    desc: "Speak naturally and answer AI-powered interview questions in real-time.",
    icon: "🎤",
    step: "02"
  },
  {
    title: "Receive Feedback",
    desc: "Get instant evaluation, skill ratings, and actionable advice for improvement.",
    icon: "✅",
    step: "03"
  },
  {
    title: "Improve & Repeat",
    desc: "Practice again with personalized questions based on your performance.",
    icon: "🔄",
    step: "04"
  },
];

const testimonials = [
  {
    name: "Harshit Nakrani",
    role: "Backend Engineer",
    feedback: "Prepify made my interview prep so easy and personalized. The AI feedback is amazing!",
    rating: 5,
    avatar: "👨‍💻"
  },
  {
    name: "Jaydeep Ahir",
    role: "Data Scientist",
    feedback: "The real-time simulation feels just like a real interview. Highly recommend!",
    rating: 5,
    avatar: "👨🏻‍🔬"
  },
  {
    name: "Jihan Gajjar",
    role: "Front Engineer",
    feedback: "I was able to improve my answers dramatically after using Prepify. Fantastic tool!",
    rating: 5,
    avatar: "👨🏻‍💻"
  },
  {
    name: "Priyal Panchal",
    role: "UX Designer",
    feedback: "The feedback is incredibly detailed and helped me land my dream job!",
    rating: 5,
    avatar: "👩🏻‍🎨"
  },
  {
    name: "Vanshika Tilwani",
    role: "UI designer",
    feedback: "Best interview prep tool I've used. The AI questions are spot-on!",
    rating: 5,
    avatar: "👷🏻‍♀"
  },
  {
    name: "Kashyap Chauhan",
    role: "Marketing Manager",
    feedback: "Boosted my confidence significantly. The practice sessions are invaluable!",
    rating: 5,
    avatar: "👮🏻‍♂"
  },
];

const stats = [
  { number: "95%", label: "Success Rate" },
  { number:"90%", label: "Uptime" },
  { number: "24/7", label: "Available Anytime" },
  { numer:"⚡", label: "Fast Response" }
];

const Landing = () => {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const StarRating = ({ rating }) => (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, i) => (
        <span key={i} className="text-yellow-400 text-lg">
          {i < rating ? '★' : '☆'}
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-950 mt-5">
      {/* Enhanced Decorative Background */}
      <div className="absolute -top-20 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-32 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" />

      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-4 h-4 bg-blue-500 rounded-full animate-bounce opacity-60" />
      <div className="absolute top-40 left-20 w-6 h-6 bg-purple-500 rounded-full animate-bounce opacity-40" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-40 right-40 w-3 h-3 bg-green-500 rounded-full animate-bounce opacity-50" style={{ animationDelay: '2s' }} />

      {/* Enhanced Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 pt-32 text-center z-10">
        <div className="mb-6 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30 text-sm text-blue-600 dark:text-blue-400 font-medium">
          🚀 AI-Powered Interview Success
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
          Meet{" "}
          <span className="relative">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text animate-pulse">
              Prepify
            </span>
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-lg animate-pulse -z-10" />
          </span>
        </h1>
        <p className="text-xl md:text-3xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-12 font-light leading-relaxed">
          Your AI-powered interview coach that transforms practice into perfection with{" "}
          <span className="font-semibold text-purple-600 dark:text-purple-400">real-time feedback</span>,{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400">intelligent scoring</span>, and{" "}
          <span className="font-semibold text-green-600 dark:text-green-400">actionable insights</span>.
        </p>
        
        {/* Mode Selection Cards */}
        <div className="flex flex-col sm:flex-row gap-5 mb-12 max-w-2xl mx-auto">
          <button
            onClick={() => navigate("/mode-select?role=candidate")}
            className="group flex-1 flex flex-col items-center gap-3 px-8 py-7 bg-white/5 dark:bg-white/5 backdrop-blur-sm border-2 border-blue-500/30 rounded-3xl hover:border-blue-500 hover:bg-blue-500/10 transform hover:-translate-y-2 transition-all duration-300 shadow-xl hover:shadow-blue-500/20"
          >
            <span className="text-4xl group-hover:scale-110 transition-transform duration-300">🎯</span>
            <div className="text-center">
              <div className="text-lg font-black text-white">I'm a Candidate</div>
              <div className="text-sm text-gray-400 mt-1">Find jobs & practice interviews</div>
            </div>
            <span className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-full">Get Started →</span>
          </button>

          <button
            onClick={() => navigate("/mode-select?role=recruiter")}
            className="group flex-1 flex flex-col items-center gap-3 px-8 py-7 bg-white/5 dark:bg-white/5 backdrop-blur-sm border-2 border-emerald-500/30 rounded-3xl hover:border-emerald-500 hover:bg-emerald-500/10 transform hover:-translate-y-2 transition-all duration-300 shadow-xl hover:shadow-emerald-500/20"
          >
            <span className="text-4xl group-hover:scale-110 transition-transform duration-300">👔</span>
            <div className="text-center">
              <div className="text-lg font-black text-white">I'm a Recruiter</div>
              <div className="text-sm text-gray-400 mt-1">Post jobs & hire great talent</div>
            </div>
            <span className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-full">Get Started →</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                {stat.number? stat.number : "⚡"}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section 
        id="features" 
        data-animate
        className={`py-32 px-6 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900/90 dark:to-gray-900 relative z-10 transition-all duration-1000 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-2 bg-blue-500/10 rounded-full text-blue-600 dark:text-blue-400 font-medium mb-4">
            Why Choose Prepify
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 text-gray-900 dark:text-white">
            Powered by{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
              Advanced AI
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Experience the future of interview preparation with cutting-edge artificial intelligence
          </p>
        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-10 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transform hover:-translate-y-3 hover:scale-105 transition-all duration-500 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-3xl`} />
              <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-4xl mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-lg`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Enhanced How It Works Section */}
      <section 
        id="process"
        data-animate
        className={`py-32 px-6 relative z-10 transition-all duration-1000 delay-200 ${isVisible.process ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-2 bg-purple-500/10 rounded-full text-purple-600 dark:text-purple-400 font-medium mb-4">
            Simple Process
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 text-gray-900 dark:text-white">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Get started in minutes with our streamlined interview preparation process
          </p>
        </div>
        <div className="max-w-6xl mx-auto">
          {steps.map((step, i) => (
            <div key={i} className="relative mb-16 last:mb-0">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute left-1/2 top-32 w-px h-24 bg-gradient-to-b from-blue-500 to-purple-500 transform -translate-x-1/2" />
              )}
              <div className={`flex items-center gap-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className="flex-1">
                  <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                        {step.step}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{step.title}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">{step.desc}</p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center text-6xl hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section 
        id="testimonials"
        data-animate
        className={`py-32 px-6 bg-gradient-to-br from-blue-50 via-purple-50/30 to-pink-50/30 dark:from-gray-900 dark:via-gray-900/90 dark:to-gray-900 relative z-10 transition-all duration-1000 delay-300 ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-2 bg-green-500/10 rounded-full text-green-600 dark:text-green-400 font-medium mb-4">
            Success Stories
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 text-gray-900 dark:text-white">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join thousands of professionals who've transformed their interview skills
          </p>
        </div>
        
        {/* Featured Testimonial */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-12 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 text-center">
            <div className="text-8xl mb-6">{testimonials[currentTestimonial].avatar}</div>
            <div className="mb-4">
              <StarRating rating={testimonials[currentTestimonial].rating} />
            </div>
            <blockquote className="text-2xl text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
              "{testimonials[currentTestimonial].feedback}"
            </blockquote>
            <div>
              <div className="font-bold text-xl text-gray-900 dark:text-white">
                {testimonials[currentTestimonial].name}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {testimonials[currentTestimonial].role}
              </div>
            </div>
          </div>
          
          {/* Testimonial Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentTestimonial(i)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i === currentTestimonial ? 'bg-blue-600 w-8' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* All Testimonials Grid */}
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-8 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-3">{testimonial.avatar}</div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</div>
                </div>
              </div>
              <StarRating rating={testimonial.rating} />
              <p className="text-gray-600 dark:text-gray-300 mt-3 leading-relaxed">"{testimonial.feedback}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Enhanced About Section */}
      <section id="about" className="py-32 px-6 relative z-10 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-indigo-500/10 rounded-full text-indigo-600 dark:text-indigo-400 font-medium mb-6">
                About Prepify
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-8 text-gray-900 dark:text-white">
                Revolutionizing{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                  Interview Preparation
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                Prepify is your personal AI-powered interview coach, designed to transform the way you prepare for career opportunities. We combine cutting-edge artificial intelligence with proven interview techniques to deliver personalized, real-time coaching that adapts to your unique needs.
              </p>
              <div className="space-y-4">
                {[
                  "Real-time AI feedback and scoring",
                  "Industry-specific question databases", 
                  "Voice recognition and analysis",
                  "Progress tracking and analytics",
                  "24/7 availability for practice sessions"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-1">
                <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 h-96 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-4">🤖</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">AI-Powered</div>
                    <div className="text-gray-600 dark:text-gray-300">Next-generation interview coaching</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 relative z-10 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-2 bg-blue-500/10 rounded-full text-blue-600 dark:text-blue-400 font-medium mb-6">
            Get In Touch
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-8 text-gray-900 dark:text-white">Contact Us</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
            Have questions, feedback, or want to collaborate? Our team is here to help you succeed.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Email Us</h3>
              <p className="text-gray-600 dark:text-gray-300">Prepify.ai@gmail.com</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Live Chat</h3>
              <p className="text-gray-600 dark:text-gray-300">Available 24/7</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">GitHub</h3>
              <p className="text-gray-600 dark:text-gray-300">Open Source</p>
            </div>
          </div>
          <a
            href="mailto:Prepify.ai@gmail.com"
            className="inline-block px-12 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl text-xl font-bold shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-2 transition-all duration-300"
          >
            Send us a Message
          </a>
        </div>
      </section>

      {/* Enhanced Call to Action */}
      <section className="py-32 px-6 relative z-10 text-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10">
          <h2 className="text-5xl md:text-7xl font-black mb-8">Ready to Ace Your Interview?</h2>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed opacity-90">
            Join thousands of professionals who've transformed their careers with Prepify's AI-powered interview coaching.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center max-w-xl mx-auto">
            <button
              onClick={() => navigate("/mode-select?role=candidate")}
              className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-white text-blue-600 rounded-2xl text-lg font-bold shadow-2xl hover:shadow-white/25 transform hover:-translate-y-2 hover:scale-105 transition-all duration-300"
            >
              <span>🎯</span> I'm a Candidate
            </button>
            <button
              onClick={() => navigate("/mode-select?role=recruiter")}
              className="flex-1 flex items-center justify-center gap-3 px-8 py-5 border-2 border-white/40 text-white rounded-2xl text-lg font-bold hover:bg-white/10 transition-all duration-300"
            >
              <span>👔</span> I'm a Recruiter
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="py-16 bg-gray-900 dark:bg-black text-white relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                Prepify
              </h3>
              <p className="text-gray-400 leading-relaxed">
                AI-powered interview coaching that transforms practice into perfection.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#process" className="hover:text-white transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="mailto:Prepify.ai@gmail.com" className="hover:text-white transition-colors">Email</a></li>
                <li><a href="https://github.com/harshit-hm" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Prepify. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Built with</span>
              <div className="flex items-center space-x-2">
                <span className="text-red-400">❤️</span>
                <span className="text-gray-400 text-sm">by</span>
                <a
                  href="https://github.com/harshit-hm"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors text-sm"
                >
                  Prepify Team
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">·</span>
                <span className="text-gray-400 text-sm">Powered by</span>
                <span className="text-purple-400 font-medium text-sm">Gemini AI</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;