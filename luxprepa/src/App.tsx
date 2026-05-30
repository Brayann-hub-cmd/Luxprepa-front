import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ConcoursPage from "./pages/Concours";
import VerifyCode from "./pages/Code";
import Dashboard from "./Dashboard";
import Matieres from "./pages/Matiere";
import Sessions from "./pages/Session";
import Navbar from "./components/navbar";

function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/concours" element={<ConcoursPage />} />
        <Route path="/verify" element={<VerifyCode />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/matieres" element={<Matieres />} />
         <Route path="/sessions" element={<Sessions />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
