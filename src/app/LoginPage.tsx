import React, { useState } from "react";
import { Mail, User, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import LogoMyMenu from "../imports/IPhone171/LogoMyMenu.png"; // Certifica-te de que o caminho está correto
import { supabase } from "../supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    // É importante usar um try/catch ou verificar o erro logo aqui
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Para ele voltar para a tua app depois de ir ao site do Google
        redirectTo: 'http://localhost:5173/dashboard' 
      }
    });

    if (error) {
      toast.error("Error trying to log in with Google: " + error.message);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    // 3. CHAMA O SUPABASE
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      toast.error("Login Error: " + error.message);
    } else {
      toast.success("Login Successful!");
      console.log("User:", data.user);
      // Aqui podes redirecionar o utilizador se quiseres
    }

    setIsLoading(false);
  };

  return (

    <div className="bg-gradient-to-b from-[#fec356] relative h-[100dvh] overflow-hidden w-full flex flex-col items-center justify-center p-4 md:p-8 to-[#fffbed]" data-name="iPhone 17 - 1">
      
      {/* Imagem */}
      <div className="w-full flex items-center justify-center mb-6 md:mb-10">
        <img 
          src={LogoMyMenu} // (Ou o caminho que usaste)
          alt="Logótipo MyMenu" 
          className="w-[200px] md:w-[260px] h-auto object-contain transition-all" 
        />
      </div>

      {/* Login Card (Cresce em largura e altura no Tablet) */}
      <div className="bg-white border-5 border-[#4c1f03] border-solid w-full max-w-[368px] md:max-w-[500px] min-h-[500px] md:min-h-[620px] rounded-[27px] p-8 md:p-12 relative shadow-xl flex flex-col justify-center">
        <h1 className="font-['Quicksand',sans-serif] font-bold leading-[normal] text-[#4c1f03] text-[36px] md:text-[42px] text-center mb-8 md:mb-12">
          Log In
        </h1>

        {/* Formulário (Maior espaçamento vertical no Tablet) */}
        <form onSubmit={handleLogin} className="space-y-8 md:space-y-10">
          
          {/* Email Field */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4c1f03] size-5 md:size-6" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#f6f6f6] border-2 border-[#4c1f03] rounded-full py-4 md:py-5 pl-12 md:pl-14 pr-4 font-['Quicksand',sans-serif] text-[#4c1f03] md:text-lg focus:outline-none focus:ring-2 focus:ring-[#f60]"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4c1f03] size-5 md:size-6" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#f6f6f6] border-2 border-[#4c1f03] rounded-full py-4 md:py-5 pl-12 md:pl-14 pr-4 font-['Quicksand',sans-serif] text-[#4c1f03] md:text-lg focus:outline-none focus:ring-2 focus:ring-[#f60]"
            />
          </div>

          {/* Iniciar Button (Mais alto e largo no Tablet) */}
          <div className="flex justify-center">
            <button 
              type="submit"
              // 1. Desativa o botão se estiver a carregar (isLoading deve ser um useState)
              disabled={isLoading} 
              className={`w-2/3 bg-[#f60] flex items-center justify-center h-[55px] rounded-[47px] border-2 border-[#4c1f03] mt-8 transition-all duration-200 shadow-md
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#e65c00] active:scale-95 cursor-pointer hover:shadow-lg'}
              `}
            >
              <span className="font-['Gruppo',sans-serif] leading-[normal] text-[32px] text-white">
                {/* 2. Muda o texto conforme o estado */}
                {isLoading ? "Joining..." : "Log In"}
              </span>
            </button>
          </div>
        </form>

        {/* Register Text */}
        <div className="text-center mt-8 md:mt-12">
          <p className="font-['Quicksand',sans-serif] text-[#4c1f03] text-[16px] md:text-[18px]">
            Don't have an account?{" "}
            <Link 
              to="/register" className="font-bold underline cursor-pointer hover:text-[#f60] transition-colors">
              Register
            </Link>
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-4 md:gap-8 mt-6 md:mt-8">
          <button type="button" onClick={handleGoogleLogin} className="size-12 md:size-14 rounded-full border-2 border-[#4c1f03] flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer">
            <svg className="size-6 md:size-7" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>
        
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto py-8">
        <p className="font-['Inter',sans-serif] font-extralight italic text-[#4c1f03] text-[13px] md:text-[15px] text-center">
          © 2026 MyMenu. All rights reserved. <a href="/terms" className="hover:underline">
            Terms of use
          </a>
        </p>
      </div>
    </div>
  );
}
