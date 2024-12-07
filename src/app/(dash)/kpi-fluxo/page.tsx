'use client';
import React, { useState, useEffect } from 'react';
import { startOfMonth, endOfMonth, addDays, format, isBefore, isSameMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Seller {
    id: string;
    name: string;
}

const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

interface RowData {
    day: string;
    dinheiro: number;
    cartaoTef: number;
    linkCartao: number;
    pix: number;
    cheque: number;
    vendaCrediario: number;
    recebimentoCrediarioDinheiro: number;
    recebimentoCrediarioPix: number;
    vendedorDinheiro: string;
    vendedorPix: string;
}

const getDatesForWeek = (monthIndex: number, weekIndex: number) => {
    const startOfMonthDate = startOfMonth(new Date(new Date().getFullYear(), monthIndex));
    const endOfMonthDate = endOfMonth(startOfMonthDate);
    const startOfCurrentWeek = addDays(startOfMonthDate, weekIndex * 7);

    return Array.from({ length: 7 }, (_, i) => {
        const date = addDays(startOfCurrentWeek, i);
        return isBefore(date, addDays(endOfMonthDate, 1)) && isSameMonth(date, startOfMonthDate) ? date : null;
    }).filter((date) => date !== null);
};

const WeeklyMetricsTable: React.FC<{
    currentWeek: number;
    currentMonthIndex: number;
    weekNumber: number;
    updateMetrics: (weekTotals: Partial<RowData>) => void;
}> = ({ currentWeek, currentMonthIndex, weekNumber, updateMetrics }) => {
    const initialData: RowData[] = Array.from({ length: 7 }, (_, index) => ({
        day: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'][index],
        dinheiro: 0,
        cartaoTef: 0,
        linkCartao: 0,
        pix: 0,
        cheque: 0,
        vendaCrediario: 0,
        recebimentoCrediarioDinheiro: 0,
        recebimentoCrediarioPix: 0,
        vendedorDinheiro: '',
        vendedorPix: '',
    }));

    const [data, setData] = useState<RowData[]>(initialData);
    const [sellers, setSellers] = useState<Seller[]>([]);

    useEffect(() => {
        const fetchSellers = async () => {
            try {
                const response = await fetch('/api/sellers'); // Ajuste a rota da API conforme necessário
                const sellersData: Seller[] = await response.json();
                setSellers(sellersData);
            } catch (error) {
                console.error('Erro ao buscar vendedores:', error);
            }
        };

        fetchSellers();
    }, []);

    useEffect(() => {
        const weekTotals = data.reduce(
            (totals, row) => {
                totals.dinheiro += row.dinheiro;
                totals.cartaoTef += row.cartaoTef;
                totals.linkCartao += row.linkCartao;
                totals.pix += row.pix;
                totals.cheque += row.cheque;
                totals.vendaCrediario += row.vendaCrediario;
                totals.recebimentoCrediarioDinheiro += row.recebimentoCrediarioDinheiro;
                totals.recebimentoCrediarioPix += row.recebimentoCrediarioPix;
                return totals;
            },
            {
                dinheiro: 0,
                cartaoTef: 0,
                linkCartao: 0,
                pix: 0,
                cheque: 0,
                vendaCrediario: 0,
                recebimentoCrediarioDinheiro: 0,
                recebimentoCrediarioPix: 0,
            }
        );
        updateMetrics(weekTotals);
    }, [data]);
    
    const handleInputChange = (index: number, field: keyof RowData, value: string) => {
        const cleanValue = value.replace(/[^\d]/g, ''); // Remove caracteres não numéricos
        const updatedData = [...data];
    
        // Permitir que o campo fique vazio
        updatedData[index] = {
            ...updatedData[index],
            [field]: cleanValue === '' ? '' : parseInt(cleanValue, 10),
        };
    
        setData(updatedData);
    };    

    const handleSellerChange = (index: number, field: 'vendedorDinheiro' | 'vendedorPix', value: string) => {
        const updatedData = [...data];
        updatedData[index] = {
            ...updatedData[index],
            [field]: value,
        };
        setData(updatedData);
    };

    const datesForWeek = getDatesForWeek(currentMonthIndex, currentWeek - 1);

    return (
        <div className="mb-6 flex">
            <div className="flex items-center justify-center w-12 bg-gray-200 border-[1.8px] font-semibold text-lg text-white p-2 rounded-l-lg">
                <span className="flex transform -rotate-90 gap-1 text-black font-semibold">
                    <span>Semana</span>
                    <span>{(weekNumber || 0).toString().padStart(2, '0')}</span>
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow-lg border-collapse border border-gray-300">
                    <thead className="sticky top-0 bg-gray-200 text-left border-b border-gray-300 font-medium">
                        <tr>
                            <th className="py-3 px-4 border border-gray-300">Dia</th>
                            <th className="py-3 px-4 border border-gray-300">Dinheiro</th>
                            <th className="py-3 px-4 border border-gray-300">Cartão TEF</th>
                            <th className="py-3 px-4 border border-gray-300">Link Cartão</th>
                            <th className="py-3 px-4 border border-gray-300">Pix</th>
                            <th className="py-3 px-4 border border-gray-300">Cheque</th>
                            <th className="py-3 px-4 border border-gray-300">Venda no Crediário</th>
                            <th className="border border-gray-300 p-2" colSpan={2}>
                            Recebimento Crediário Dinheiro
                            </th>
                            <th className="border border-gray-300 p-2" colSpan={2}>
                            Recebimento Crediário Pix
                            </th>
                            <th className="py-3 px-4 border border-gray-300">Total Vendas</th>
                        </tr>
                        <tr>
                            <th colSpan={7}></th>
                            <th className="border border-gray-300 p-2">
                            <select className="border rounded p-1 w-full">
                                <option value="Dirlene">Dirlene</option>
                                <option value="Rosiane">Rosiane</option>
                            </select>
                            </th>
                            <th className="border border-gray-300 p-2">
                            <select className="border rounded p-1 w-full">
                                <option value="Dirlene">Dirlene</option>
                                <option value="Rosiane">Rosiane</option>
                            </select>
                            </th>
                            <th className="border border-gray-300 p-2">
                            <select className="border rounded p-1 w-full">
                                <option value="Dirlene">Dirlene</option>
                                <option value="Rosiane">Rosiane</option>
                            </select>
                            </th>
                            <th className="border border-gray-300 p-2">
                            <select className="border rounded p-1 w-full">
                                <option value="Dirlene">Dirlene</option>
                                <option value="Rosiane">Rosiane</option>
                            </select>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {datesForWeek.map((date, index) => {
                            const row = data[index];
                            const totalVendas =
                                row.dinheiro +
                                row.cartaoTef +
                                row.linkCartao +
                                row.pix +
                                row.cheque +
                                row.vendaCrediario +
                                row.recebimentoCrediarioDinheiro +
                                row.recebimentoCrediarioPix;
                            const dayName = format(date!, 'eeeeee', { locale: ptBR });
                            const dayNumber = format(date!, 'dd/MM');

                            return (
                                <tr key={index} className="border-b border-gray-300">
                                    <td className={`py-3 px-4 ${dayName === 'dom' ? 'text-red-600' : ''} border border-gray-300`}>
                                        <div>{dayName}</div>
                                        <div className="text-sm text-gray-500">{dayNumber}</div>
                                    </td>
                                    {(['dinheiro', 'cartaoTef', 'linkCartao', 'pix', 'cheque', 'vendaCrediario'] as const).map((field) => (
                                        <td key={field} className="py-3 px-4 border border-gray-300">
                                            <input
                                                type="text"
                                                value={formatCurrency(row[field])}
                                                onChange={(e) => handleInputChange(index, field, e.target.value)}
                                                className="w-full px-2 py-1 border rounded text-center"
                                                onFocus={(e) => e.target.select()}
                                            />
                                        </td>
                                    ))}
                                    <td className="py-3 px-4 border border-gray-300">
                                        <input
                                            type="text"
                                            value={formatCurrency(row.recebimentoCrediarioDinheiro)}
                                            onChange={(e) => handleInputChange(index, 'recebimentoCrediarioDinheiro', e.target.value)}
                                            className="w-full px-2 py-1 border rounded text-center"
                                            onFocus={(e) => e.target.select()}
                                        />
                                    </td>
                                    <td className="py-3 px-4 border border-gray-300">
                                    <input
                                            type="text"
                                            value={formatCurrency(row.recebimentoCrediarioDinheiro)}
                                            onChange={(e) => handleInputChange(index, 'recebimentoCrediarioDinheiro', e.target.value)}
                                            className="w-full px-2 py-1 border rounded text-center"
                                            onFocus={(e) => e.target.select()}
                                        />
                                    </td>
                                    <td className="py-3 px-4 border border-gray-300">
                                        <input
                                            type="text"
                                            value={formatCurrency(row.recebimentoCrediarioPix)}
                                            onChange={(e) => handleInputChange(index, 'recebimentoCrediarioPix', e.target.value)}
                                            className="w-full px-2 py-1 border rounded text-center"
                                            onFocus={(e) => e.target.select()}
                                        />
                                    </td>
                                    <td className="py-3 px-4 border border-gray-300">
                                    <input
                                            type="text"
                                            value={formatCurrency(row.recebimentoCrediarioDinheiro)}
                                            onChange={(e) => handleInputChange(index, 'recebimentoCrediarioDinheiro', e.target.value)}
                                            className="w-full px-2 py-1 border rounded text-center"
                                            onFocus={(e) => e.target.select()}
                                        />
                                    </td>
                                    <td className="py-3 px-4 border border-gray-300 font-semibold">{formatCurrency(totalVendas)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const KPIVendasPage: React.FC = () => {
    const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [metrics, setMetrics] = useState({
        dinheiro: 0,
        cartaoTef: 0,
        linkCartao: 0,
        pix: 0,
        cheque: 0,
        crediario: 0,
    });

    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const handleMonthChange = (direction: 'next' | 'previous') => {
        if (direction === 'next') {
            if (currentMonthIndex === 11) {
                setCurrentMonthIndex(0);
                setCurrentYear((prev) => prev + 1);
            } else {
                setCurrentMonthIndex((prev) => prev + 1);
            }
        } else {
            if (currentMonthIndex === 0) {
                setCurrentMonthIndex(11);
                setCurrentYear((prev) => prev - 1);
            } else {
                setCurrentMonthIndex((prev) => prev - 1);
            }
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => handleMonthChange('previous')} className="px-4 py-2 bg-gray-300 rounded-lg font-medium">Anterior</button>
                <h1 className="text-2xl font-semibold">{monthNames[currentMonthIndex]} de {currentYear}</h1>
                <button onClick={() => handleMonthChange('next')} className="px-4 py-2 bg-gray-300 rounded-lg font-medium">Próximo</button>
            </div>

            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((weekNumber) => (
                    <WeeklyMetricsTable 
                        key={weekNumber} 
                        currentWeek={weekNumber} 
                        currentMonthIndex={currentMonthIndex} 
                        weekNumber={weekNumber} 
                        updateMetrics={() => {}} 
                    />
                ))}
            </div>
        </div>
    );
};

export default KPIVendasPage;
