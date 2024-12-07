import React, { useEffect, useState } from 'react';

interface MetricCardProps {
    title: string;
    value: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value }) => (
    <div className="bg-white p-4 rounded-lg shadow-lg text-center">
        <p className="text-gray-600">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
    </div>
);

const GeneralMetricsPanel: React.FC = () => {
    const [metrics, setMetrics] = useState({
        approaches: '0',
        completedSales: '0',
        conversionRate: '0%',
        averageTicket: 'R$ 0,00',
    });

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await fetch('/api/general-metrics');
                if (!response.ok) throw new Error('Failed to fetch metrics');
                const data = await response.json();
                setMetrics({
                    approaches: data.totalApproaches.toString(),
                    completedSales: data.totalSales.toString(),
                    conversionRate: `${data.conversionRate}%`,
                    averageTicket: `R$ ${data.averageTicket.toFixed(2)}`,
                });
            } catch (error) {
                console.error('Error fetching metrics:', error);
            }
        };

        fetchMetrics();
    }, []);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard title="Abordagens" value={metrics.approaches} />
            <MetricCard title="Vendas Concluídas" value={metrics.completedSales} />
            <MetricCard title="Taxa de Conversão" value={metrics.conversionRate} />
            <MetricCard title="Ticket Médio" value={metrics.averageTicket} />
        </div>
    );
};

export default GeneralMetricsPanel;
