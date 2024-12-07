import React from 'react';

interface WeeklyMetrics {
    day: string;
    approaches: number;
    sales: number;
    itemsPerSale: number;
    conversionRate: number;
    ticketAverage: number;
}

const WeeklyMetricsTable: React.FC = () => {
    // Dados fictícios
    const weeklyMetrics: WeeklyMetrics[] = [
        { day: 'Segunda-feira', approaches: 40, sales: 10, itemsPerSale: 3, conversionRate: 25, ticketAverage: 120 },
        { day: 'Terça-feira', approaches: 35, sales: 8, itemsPerSale: 2.5, conversionRate: 22.9, ticketAverage: 105 },
        { day: 'Quarta-feira', approaches: 50, sales: 15, itemsPerSale: 3.2, conversionRate: 30, ticketAverage: 150 },
        { day: 'Quinta-feira', approaches: 45, sales: 12, itemsPerSale: 3.1, conversionRate: 26.7, ticketAverage: 135 },
        { day: 'Sexta-feira', approaches: 60, sales: 18, itemsPerSale: 3.3, conversionRate: 30, ticketAverage: 160 },
        { day: 'Sábado', approaches: 55, sales: 14, itemsPerSale: 3.0, conversionRate: 25.5, ticketAverage: 145 },
        { day: 'Domingo', approaches: 30, sales: 5, itemsPerSale: 2.8, conversionRate: 16.7, ticketAverage: 110 },
    ];

    return (
        <table className="min-w-full bg-white rounded-lg shadow-lg">
            <thead>
                <tr className="text-left border-b">
                    <th className="py-3 px-4">Dia</th>
                    <th className="py-3 px-4">Abordagens</th>
                    <th className="py-3 px-4">Vendas</th>
                    <th className="py-3 px-4">Peças/Venda</th>
                    <th className="py-3 px-4">Taxa de Conversão</th>
                    <th className="py-3 px-4">Ticket Médio</th>
                </tr>
            </thead>
            <tbody>
                {weeklyMetrics.map((metric, index) => (
                    <tr key={index} className="border-b">
                        <td className="py-3 px-4">{metric.day}</td>
                        <td className="py-3 px-4">{metric.approaches}</td>
                        <td className="py-3 px-4">{metric.sales}</td>
                        <td className="py-3 px-4">{metric.itemsPerSale.toFixed(1)}</td>
                        <td className="py-3 px-4">{metric.conversionRate}%</td>
                        <td className="py-3 px-4">R$ {metric.ticketAverage.toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default WeeklyMetricsTable;
