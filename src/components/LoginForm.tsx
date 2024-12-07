'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import InputWithIcon from "@/components/input";
import { Loader2 } from "lucide-react"; 

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.error || "Erro no login");
      }
  
      // Salva o token como cookie e o userId no localStorage
      document.cookie = `token=${data.token}; path=/`;
      localStorage.setItem("userId", data.userId); // Salva o userId no localStorage
  
      // Exibe o toast de sucesso
      toast({
        title: "Login bem-sucedido",
        description: "Redirecionando para o dashboard.",
        duration: 3000,
        variant: "success",
      });
  
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Aguarda o toast antes de redirecionar
  
      router.push("/dashboard");
    } catch (err) {
      toast({
        title: "Erro no login",
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };  

  return (
    <form onSubmit={handleLogin} className="mt-8 space-y-6 w-full max-w-md">
      <div className="rounded-md shadow-sm space-y-5">
        <div className="relative">
          <p className="text-sm font-medium text-gray-600 mb-1">E-mail</p>
          <InputWithIcon
            placeholder="Digite seu e-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="relative mt-3">
          <p className="text-sm font-medium text-gray-600 mb-1">Senha</p>
          <InputWithIcon
            placeholder="Digite sua senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4">
        <div className="text-sm -mt-5">
          <a href="/esqueci-a-senha" className="font-medium text-red-600 hover:underline">
            Esqueceu a senha?
          </a>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-t from-red-700 to-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            "Entrar"
          )}
        </button>
      </div>
    </form>
  );
}
