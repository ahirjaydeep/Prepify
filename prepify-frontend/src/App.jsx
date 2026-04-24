import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./Pages/Landingpage";
import Interview from "./Pages/Interview";
import Header from "./Components/Header";
import ResumeUpload from "./Pages/Resumeuplod";
import ModeSelect from "./Pages/ModeSelect";
import CandidateDashboard from "./Pages/CandidateDashboard";
import RecruiterDashboard from "./Pages/RecruiterDashboard";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/mode-select" element={<ModeSelect />} />
        <Route path="/candidate" element={<CandidateDashboard />} />
        <Route path="/recruiter" element={<RecruiterDashboard />} />
        <Route path="/start-interview" element={<ResumeUpload />} />
        <Route path="/interview" element={<Interview />} />
      </Routes>
    </Router>
  );
}

export default App;