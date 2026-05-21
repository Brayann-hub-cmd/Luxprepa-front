import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import Concours from "./Concours";
import VerifyCode from "./Code";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register"element={<Register />} />
        <Route path="/concours"element={<Concours />} />
        <Route path="/verify"element={<VerifyCode />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
