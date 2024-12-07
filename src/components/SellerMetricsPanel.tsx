import React, { useEffect, useState } from 'react';

interface SellerMetricProps {
    name: string;
    value: string;
}

const SellerMetric: React.FC<SellerMetricProps> = ({ name, value }) => (
    <div className="flex justify-between p-4 border-b">
        <span className="text-gray-600">{name}</span>
        <span className="font-semibold">{value}</span>
    </div>
);

const SellerMetricsPanel: React.FC = () => {
    const [metrics, setMetrics] = useState({
        totalSales: 'R$ 0,00',
        averageWeeklySales: 'R$ 0,00',
        highestSaleDate: '-',
        highestSaleValue: 'R$ 0,00',
        totalCommission: 'R$ 0,00',
        goalAchieved: '0%',
    });

    useEffect(() => {
        const fetchSellerMetrics = async () => {
            const userId = localStorage.getItem("userId"); // Obtém o userId do localStorage

            if (!userId) {
                console.error("ID do usuário não encontrado");
                return;
            }

            try {
                const response = await fetch(`/api/seller-metrics/${userId}`);
                if (!response.ok) throw new Error('Erro ao buscar métricas do vendedor');
                const data = await response.json();
                setMetrics(data);
            } catch (error) {
                console.error('Erro ao buscar métricas do vendedor:', error);
            }
        };

        fetchSellerMetrics();
    }, []);

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Métricas Individuais do Vendedor</h2>
            <div className="bg-white rounded-lg shadow-lg">
                <SellerMetric name="Faturamento" value={metrics.totalSales} />
                <SellerMetric name="Média Semanal" value={metrics.averageWeeklySales} />
                <SellerMetric name="Dia com Maior Venda" value={metrics.highestSaleDate} />
                <SellerMetric name="Valor da Maior Venda" value={metrics.highestSaleValue} />
                <SellerMetric name="Comissão" value={metrics.totalCommission} />
                <SellerMetric name="Meta Atingida" value={metrics.goalAchieved} />
            </div>
        </div>
    );
};

export default SellerMetricsPanel;
