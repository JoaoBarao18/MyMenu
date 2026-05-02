import JoinPage from "./JoinPage";
import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import LoginPage from "./LoginPage";

function App() {

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Timer de 5 segundos
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5000);

    return () => clearTimeout(timer); // Limpa o timer se o user sair
  }, []);

  return (
    <main className="transition-all duration-1000 ease-in-out">
      {showSplash ? (
        <JoinPage key="splash" />
      ) : (
        <div className="animate-in fade-in duration-1000">
          <LoginPage key="login" />
        </div>
      )}
    </main>
  );
}

export default App;
