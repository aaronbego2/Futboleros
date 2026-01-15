import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import { AdminPage } from "./components/pages/AdminPage";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
