import React, { useState } from "react";
import { Mail, User, Lock } from "lucide-react";
import { toast } from "sonner";
import LogoMyMenu from "../imports/IPhone171/LogoMyMenu.png"; // Certifica-te de que o caminho está correto
import { supabase } from "../supabaseClient";

export default function JoinPage() {
  return (
    <div className="bg-gradient-to-b from-[#fec356] to-[#fffbed] h-[100dvh] w-full flex items-center justify-center overflow-hidden animate-in fade-in duration-700">
      <div className="flex flex-col items-center">
        <img 
          src={LogoMyMenu} 
          alt="Logótipo MyMenu" 
          className="w-[220px] md:w-[280px] h-auto object-contain animate-pulse" 
        />
      </div>
    </div>
  );
}

