import "./App.css";
import { Routes, Route } from "react-router-dom";
import AbuseFormReport from "./pages/AbuseFormReport";
import Reports from "./pages/Reports";
import Header from "./components/Header";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<AbuseFormReport />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </>
  );
}

export default App;
