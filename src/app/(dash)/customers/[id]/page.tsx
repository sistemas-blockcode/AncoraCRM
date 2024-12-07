'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Customer {
  id: number;
  name: string;
  birthDate: string;
  cpf: string;
  phoneNumber: string;
  loyaltyCard: {
    id: number;
    stamps: number;
  };
}

interface HistoryEntry {
  id: number;
  stampsAdded: number;
  dateAdded: string;
  user: {
    name: string;
  };
}

export default function CustomerDetailsPage() {
  const params = useParams();
  const id = params?.id as string | undefined; // Corrige o tipo de `id`
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`/api/customers/${id}`)
      .then((response) => setCustomer(response.data))
      .catch((error) => {
        console.error('Erro ao buscar cliente:', error);
        alert('Não foi possível carregar os dados do cliente.');
      });
  }, [id]);

  const fetchHistory = async () => {
    if (!customer?.loyaltyCard.id) return;

    setIsHistoryModalOpen(true);

    try {
      const response = await axios.get(`/api/loyalty-cards/${customer.loyaltyCard.id}/history`);
      setHistory(response.data);
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      alert('Não foi possível carregar o histórico do cartão.');
    }
  };

  const handleStampClick = async (index: number) => {
    if (!customer) return;

    const isAddingStamp = index >= customer.loyaltyCard.stamps;
    const newStamps = isAddingStamp ? index + 1 : index;

    try {
      await axios.put(`/api/loyalty-cards/${customer.loyaltyCard.id}`, {
        stamps: newStamps,
      });

      setCustomer((prev) =>
        prev ? { ...prev, loyaltyCard: { ...prev.loyaltyCard, stamps: newStamps } } : null
      );
    } catch (error) {
      console.error('Erro ao atualizar as marcas do cartão:', error);
      alert('Não foi possível atualizar as marcas.');
    }
  };

  const handleClearCard = async () => {
    if (!customer) return;

    try {
      await axios.put(`/api/loyalty-cards/${customer.loyaltyCard.id}`, {
        stamps: 0,
      });

      setCustomer((prev) =>
        prev ? { ...prev, loyaltyCard: { ...prev.loyaltyCard, stamps: 0 } } : null
      );
    } catch (error) {
      console.error('Erro ao limpar o cartão de fidelidade:', error);
      alert('Não foi possível limpar o cartão.');
    }
  };

  if (!id) {
    return <p className="p-6 text-gray-600">Erro: ID inválido ou não fornecido.</p>;
  }

  if (!customer) {
    return <p className="p-6 text-gray-600">Carregando informações do cliente...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Detalhes do Cliente</h1>
      <div className="p-6 bg-white border-[1.2px] rounded-3xl shadow space-y-2">
        <p className="text-zinc-600 text-sm">
          <strong>Nome:</strong> {customer.name}
        </p>
        <p className="text-zinc-600 text-sm">
          <strong>CPF:</strong> {customer.cpf}
        </p>
        <p className="text-zinc-600 text-sm">
          <strong>Data de Nascimento:</strong> {new Date(customer.birthDate).toLocaleDateString()}
        </p>
        <p className="text-zinc-600 text-sm">
          <strong>Telefone:</strong> {customer.phoneNumber}
        </p>
      </div>
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold mb-4">Cartão de Fidelidade</h2>
          <div className="flex space-x-4">
            <button
              onClick={handleClearCard}
              className="group relative flex justify-center py-2 px-6 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-t from-red-700 to-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              Limpar
            </button>
            <button
              onClick={fetchHistory}
              className="group relative flex justify-center py-2 px-6 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-t from-blue-700 to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              Histórico
            </button>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-3 p-4 bg-white border-[1.2px] rounded-3xl shadow">
          {[...Array(10)].map((_, index) => (
            <button
              key={index}
              onClick={() => handleStampClick(index)}
              className={`w-50 h-16 flex items-center justify-center rounded-lg border-[1.2px] text-sm font-medium ${
                index < customer.loyaltyCard.stamps
                  ? 'bg-gradient-to-t from-green-600 to-green-400 text-white border-green-600'
                  : 'bg-zinc-200 text-zinc-400 border-zinc-300'
              }`}
            >
              {index < customer.loyaltyCard.stamps ? '✓' : ''}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={() => router.push('/cartao-fidelidade')}
        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-t from-blue-700 to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2"
      >
        Voltar
      </button>
      {isHistoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4 overflow-y-auto"
            style={{ maxHeight: '400px' }}
          >
            <h2 className="text-xl font-semibold">Histórico de Marcas</h2>
            {history.length > 0 ? (
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
                <thead>
                  <tr>
                    <th className="py-3 px-4 text-left text-gray-600 font-semibold">Data</th>
                    <th className="py-3 px-4 text-left text-gray-600 font-semibold">Marcas</th>
                    <th className="py-3 px-4 text-left text-gray-600 font-semibold">Usuário</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry) => (
                    <tr key={entry.id} className="border-t border-gray-200">
                      <td className="py-3 px-4">{new Date(entry.dateAdded).toLocaleDateString()}</td>
                      <td className="py-3 px-4">{entry.stampsAdded}</td>
                      <td className="py-3 px-4">{entry.user.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">Nenhum histórico encontrado para este cliente.</p>
            )}
            <button
              onClick={() => setIsHistoryModalOpen(false)}
              className="mt-4 bg-gray-400 text-white px-6 py-2 rounded-xl font-semibold hover:bg-gray-500 transition w-full"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
