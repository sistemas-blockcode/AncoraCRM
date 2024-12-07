'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Pencil, Trash, User, Eye, EyeOff } from 'lucide-react';
import Modal from '@/components/modal';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  name: string;
  role: string;
  phone: string;
  profilePicture?: string;
}

const formatPhone = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '').slice(0, 11);
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phone;
};

const formatCPF = (cpf: string) => {
  const cleaned = cpf.replace(/\D/g, '').slice(0, 11);
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export default function UsuarioPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    phone: '',
    email: '',
    profession: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast(); // Hook de toast

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users/getUsers');
        if (!response.ok) throw new Error('Erro ao buscar usuários');
        const usersData = await response.json();
        setUsers(usersData); // Atualiza o estado com os dados recebidos
      } catch (error) {
        console.error(error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os usuários.',
          variant: 'destructive',
        });
      }
    };

    fetchUsers();
    setIsMounted(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCPF = formatCPF(e.target.value);
    setFormData((prevData) => ({ ...prevData, cpf: formattedCPF }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhone(e.target.value);
    setFormData((prevData) => ({ ...prevData, phone: formattedPhone }));
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Erro',
        description: 'As senhas não coincidem!',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/users/createUsers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.profession,
          phone: formData.phone,
          cpf: formData.cpf,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao registrar usuário');
      }

      const newUser = await response.json();
      setUsers((prevUsers) => [...prevUsers, newUser]); // Adiciona o novo usuário à lista
      setIsModalOpen(false); // Fecha o modal
      setFormData({
        name: '',
        cpf: '',
        phone: '',
        email: '',
        profession: '',
        password: '',
        confirmPassword: '',
      });

      toast({
        title: 'Sucesso',
        description: 'Usuário registrado com sucesso!',
        variant: 'success',
      });
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      toast({
        title: 'Erro',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

    try {
      const response = await fetch('/api/users/deleteUser', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId }),
      });

      if (!response.ok) throw new Error('Erro ao excluir usuário');
      
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));

      toast({
        title: 'Sucesso',
        description: 'Usuário excluído com sucesso!',
        variant: 'success',
      });
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      toast({
        title: 'Erro',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  };

  if (!isMounted) return null;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Usuários</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-t from-red-700 to-red-500 text-white rounded-lg font-medium transition"
        >
          Adicionar Usuário
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-6">Adicionar Usuário</h2>
        <form onSubmit={handleAddUser} className="space-y-6">
          
          <div className="grid grid-cols-1">
            <input
              type="text"
              name="name"
              placeholder="Nome Completo"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="border border-gray-300 p-4 rounded-lg w-full"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="phone"
              placeholder="Telefone"
              value={formData.phone}
              onChange={handlePhoneChange}
              maxLength={15}
              required
              className="border border-gray-300 p-4 rounded-lg w-full"
            />
            <input
              type="text"
              name="cpf"
              placeholder="CPF"
              value={formData.cpf}
              onChange={handleCPFChange}
              maxLength={14}
              required
              className="border border-gray-300 p-4 rounded-lg w-full"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="border border-gray-300 p-4 rounded-lg w-full"
            />
            <select
              name="profession"
              value={formData.profession}
              onChange={handleInputChange}
              required
              className="border border-gray-300 p-4 rounded-lg w-full bg-white"
            >
              <option value="">Selecione a Profissão</option>
              <option value="ADMINISTRADOR">Administrador</option>
              <option value="GERENTE">Gerente</option>
              <option value="ANALISTA">Analista</option>
              <option value="COLABORADOR">Colaborador</option>
              <option value="VENDEDOR">Vendedor</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Senha"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="border border-gray-300 p-4 rounded-lg w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirmar Senha"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="border border-gray-300 p-4 rounded-lg w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="submit"
              className="bg-green-600 text-white px-7 py-2 rounded-xl font-semibold hover:bg-green-700 transition"
            >
              Confirmar
            </button>
            <button
              type="button"
              onClick={() =>
                setFormData({
                  name: '',
                  cpf: '',
                  phone: '',
                  email: '',
                  profession: '',
                  password: '',
                  confirmPassword: '',
                })
              }
              className="bg-zinc-400 text-white px-7 py-2 rounded-xl font-semibold hover:bg-zinc-500 transition"
            >
              Resetar
            </button>
          </div>
        </form>
      </Modal>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
          <thead>
            <tr>
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">Foto</th>
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">Nome Completo</th>
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">Cargo</th>
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">Telefone</th>
              <th className="py-3 px-4 text-center text-gray-600 font-semibold">Editar</th>
              <th className="py-3 px-4 text-center text-gray-600 font-semibold">Excluir</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-gray-200">
                <td className="py-3 px-4">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 text-gray-600">
                      <User size={20} />
                    </div>
                  )}
                </td>
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4">{user.role}</td>
                <td className="py-3 px-4">{formatPhone(user.phone)}</td>
                <td className="py-3 px-4 text-center">
                  <Link href={`/editar/${user.id}`}>
                    <button className="text-blue-500 hover:text-blue-700">
                      <Pencil size={18} />
                    </button>
                  </Link>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
