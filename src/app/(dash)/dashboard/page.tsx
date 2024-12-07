import { TrendingUp, DollarSign, BarChart2, CheckCircle, XCircle, Users } from 'lucide-react';
import CardsDash from "@/components/cards-dash";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Conversão */}
        <CardsDash
          icon={<TrendingUp size={22} className="text-green-600" />}
          title="Conversão"
          value="15%"
          change="+5%"
          changeDescription="desde o último mês"
          changeColor="text-green-500"
        />

        {/* Faturamento */}
        <CardsDash
          icon={<DollarSign size={22} className="text-green-600" />}
          title="Faturamento"
          value="$15,340.00"
          change="+10%"
          changeDescription="desde o último mês"
          changeColor="text-green-500"
        />

        {/* Ticket Médio */}
        <CardsDash
          icon={<BarChart2 size={22} className="text-green-600" />}
          title="Ticket Médio"
          value="$234.50"
          change="+3%"
          changeDescription="desde o último mês"
          changeColor="text-green-500"
        />

        {/* Total de Atendimento */}
        <CardsDash
          icon={<Users size={22} className="text-green-600" />}
          title="Total de Atendimento"
          value="120"
          change="+15%"
          changeDescription="desde o último mês"
          changeColor="text-green-500"
        />

        {/* Vendas Finalizadas */}
        <CardsDash
          icon={<CheckCircle size={22} className="text-green-600" />}
          title="Vendas Finalizadas"
          value="80"
          change="+12%"
          changeDescription="desde o último mês"
          changeColor="text-green-500"
        />

        {/* Vendas Perdidas */}
        <CardsDash
          icon={<XCircle size={22} className="text-red-600" />}
          title="Vendas Perdidas"
          value="40"
          change="-5%"
          changeDescription="desde o último mês"
          changeColor="text-red-500"
        />
      </div>
    </div>
  );
}
