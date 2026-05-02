import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { supabase } from "../../supabaseClient"; // Garante que o caminho está certo
import MainDashboard from "./MainDashboard";
// Teus componentes
import LoginPage from "./LoginPage"; 
import RegistarPage from "./RegisterPage";
import JoinPage from "./JoinPage";


function AuthHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    // Este "ouvinte" deteta quando o utilizador volta do Google com sucesso
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        toast.success("Login realizado com sucesso!");
        navigate("/dashboard"); // Para onde queres que ele vá
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return null; // Este componente não desenha nada, só "ouve"
}

function App() {
  const [isFinishedSplash, setIsFinishedSplash] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsFinishedSplash(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!isFinishedSplash) {
    return <JoinPage />;
  }

  return (
    <> {/* <--- Abre o Fragment aqui */}
      <Toaster position="top-center" richColors expand={false} closeButton />

      <Router>
        <AuthHandler />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistarPage />} />
          <Route path="/dashboard" element={<MainDashboard />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;