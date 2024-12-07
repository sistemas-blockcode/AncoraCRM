'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Customer {
  id: number;
  name: string;
  cpf: string;
  birthDate: string;
  phoneNumber: string;
  loyaltyCard: {
    id: number;
    stamps: number;
  };
}

export default function LoyaltyPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    birthDate: "",
    phoneNumber: "",
  });
  const [searchCPF, setSearchCPF] = useState(""); // Estado para o CPF pesquisado

  const router = useRouter();

  useEffect(() => {
    // Fetch customers from API
    axios.get("/api/customers").then((response) => {
      setCustomers(response.data);
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCPF(e.target.value); // Atualiza o CPF pesquisado
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/search?cpf=${searchCPF}`);
      setCustomers([response.data]); // Atualiza a lista com o cliente encontrado
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      alert("Cliente não encontrado.");
    }
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/customers", {
        name: formData.name,
        cpf: formData.cpf,
        birthDate: formData.birthDate,
        phoneNumber: formData.phoneNumber,
      });

      setCustomers((prev) => [...prev, response.data]);
      setIsAddModalOpen(false);
      setFormData({ name: "", cpf: "", birthDate: "", phoneNumber: "" });
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
    }
  };

  const handleViewCustomer = (id: number) => {
    router.push(`/customers/${id}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Cartões de Fidelidade</h1>

        {/* Barra de Pesquisa */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Pesquisar por CPF"
            value={searchCPF}
            onChange={handleSearchChange}
            className="border border-gray-300 p-2 rounded-lg w-64"
          />
          <button
            onClick={handleSearch}
            className="text-white font-semibold px-4 py-2 bg-gradient-to-t from-blue-700 to-blue-500 rounded-lg"
          >
            Buscar
          </button>
        </div>

        <button
          className="group relative flex justify-center py-2 px-6 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-t from-red-700 to-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2"
          onClick={() => setIsAddModalOpen(true)}
        >
          Adicionar Cliente
        </button>
      </div>

      {/* Table */}
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
        <thead>
          <tr>
            <th className="py-3 px-4 text-left text-gray-600 font-semibold">Nome</th>
            <th className="py-3 px-4 text-left text-gray-600 font-semibold">CPF</th>
            <th className="py-3 px-4 text-left text-gray-600 font-semibold">Data de Nascimento</th>
            <th className="py-3 px-4 text-left text-gray-600 font-semibold">Telefone</th>
            <th className="py-3 px-4 text-center text-gray-600 font-semibold">Visualizar</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="border-t border-gray-200">
              <td className="py-3 px-4">{customer.name}</td>
              <td className="py-3 px-4">{customer.cpf}</td>
              <td className="py-3 px-4">
                {new Date(customer.birthDate).toLocaleDateString()}
              </td>
              <td className="py-3 px-4">{customer.phoneNumber}</td>
              <td className="py-3 px-4 text-center">
                <button
                  onClick={() => handleViewCustomer(customer.id)}
                  className="text-white font-semibold py-2 px-10 bg-gradient-to-t from-blue-700 to-blue-500 rounded-lg"
                >
                  Visualizar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-6">Adicionar Cliente</h2>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Nome Completo"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="border border-gray-300 p-3 rounded-lg w-full"
              />
              <input
                type="text"
                name="cpf"
                placeholder="CPF"
                value={formData.cpf}
                onChange={handleInputChange}
                required
                className="border border-gray-300 p-3 rounded-lg w-full"
              />
              <input
                type="date"
                name="birthDate"
                placeholder="Data de Nascimento"
                value={formData.birthDate}
                onChange={handleInputChange}
                required
                className="border border-gray-300 p-3 rounded-lg w-full"
              />
              <input
                type="text"
                name="phoneNumber"
                placeholder="Número de Telefone"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                className="border border-gray-300 p-3 rounded-lg w-full"
              />
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-gray-400 text-white px-6 py-2 rounded-xl font-semibold hover:bg-gray-500 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-green-700 transition"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
