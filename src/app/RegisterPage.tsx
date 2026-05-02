import React, { useState } from "react";
import { Mail, User, Lock } from "lucide-react";
import { Link,useNavigate} from "react-router-dom";
import { toast } from "sonner";
import LogoMyMenu from "../imports/IPhone171/LogoMyMenu.png";
import { supabase } from "../supabaseClient";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

    const handleGoogleLogin = async () => {
    // É importante usar um try/catch ou verificar o erro logo aqui
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Para ele voltar para a tua app depois de ir ao site do Google
        redirectTo: 'http://localhost:5173/UserPreferences' 
      }
    });

    if (error) {
      toast.error("Erro ao tentar entrar com o Google: " + error.message);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !fullName) {
      toast.error("Por favor preencha todos os campos");
      return;
    }

    setIsLoading(true);

    // 1. CHAMA O SIGNUP DO SUPABASE
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        // Estes dados vão para o 'auth.users' e podem ser usados para a tua tabela 'Users'
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      toast.error("Erro no registo: " + error.message);
    } else {
      toast.success("Registo feito! Verifica o teu email para confirmar.");
      console.log("Utilizador registado:", data.user);

      navigate("/UserPreferences");
    }

    setIsLoading(false);
  };

  return (
    <div className="bg-gradient-to-b from-[#fec356] to-[#fffbed] relative h-[100dvh] w-full flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden">
      
      {/* Imagem Logo */}
      <div className="w-full flex items-center justify-center mb-4 md:mb-6">
        <img 
          src={LogoMyMenu} 
          alt="Logótipo MyMenu" 
          className="w-[180px] md:w-[240px] h-auto object-contain transition-all" 
        />
      </div>

      {/* Register Card */}
      <div className="bg-white border-5 border-[#4c1f03] border-solid w-full max-w-[368px] md:max-w-[500px] rounded-[27px] p-8 md:p-10 shadow-xl flex flex-col justify-center">
        <h1 className="font-['Quicksand',sans-serif] font-bold text-[#4c1f03] text-[32px] md:text-[38px] text-center mb-6 md:mb-8">
          Criar Conta
        </h1>

        <form onSubmit={handleRegister} className="space-y-6 md:space-y-8">
          
          {/* Nome Field */}
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4c1f03] size-5 md:size-6" />
            <input
              type="text"
              placeholder="Nome Completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#f6f6f6] border-2 border-[#4c1f03] rounded-full py-3 md:py-4 pl-12 md:pl-14 pr-4 font-['Quicksand',sans-serif] text-[#4c1f03] focus:outline-none focus:ring-2 focus:ring-[#f60]"
            />
          </div>

          {/* Email Field */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4c1f03] size-5 md:size-6" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#f6f6f6] border-2 border-[#4c1f03] rounded-full py-3 md:py-4 pl-12 md:pl-14 pr-4 font-['Quicksand',sans-serif] text-[#4c1f03] focus:outline-none focus:ring-2 focus:ring-[#f60]"
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
              className="w-full bg-[#f6f6f6] border-2 border-[#4c1f03] rounded-full py-3 md:py-4 pl-12 md:pl-14 pr-4 font-['Quicksand',sans-serif] text-[#4c1f03] focus:outline-none focus:ring-2 focus:ring-[#f60]"
            />
          </div>

          {/* Register Button */}
          <div className="flex justify-center">
            <button 
              type="submit"
              disabled={isLoading}
              className={`w-2/3 bg-[#f60] flex items-center justify-center h-[55px] rounded-[47px] border-2 border-[#4c1f03] mt-4 transition-all duration-200 shadow-md
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#e65c00] active:scale-95 cursor-pointer hover:shadow-lg'}
              `}
            >
              <span className="font-['Gruppo',sans-serif] text-[28px] text-white">
                {isLoading ? "A registar..." : "Registar"}
              </span>
            </button>
          </div>
        </form>

        <div className="flex justify-center gap-4 md:gap-8 mt-6 md:mt-8">
          <button  type="button" onClick={handleGoogleLogin} className="size-12 md:size-14 rounded-full border-2 border-[#4c1f03] flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer">
            <svg className="size-6 md:size-7" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>
    
        </div>

        <div className="text-center mt-6">
          <p className="font-['Quicksand',sans-serif] text-[#4c1f03]">
            Já tens conta?{" "}
            <Link 
              to="/login" className="font-bold underline cursor-pointer hover:text-[#f60]">
              Inicia sessão
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}