'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DailyInputForm from '@/components/DailyInputForm';
import { useToast } from '@/hooks/use-toast';

const daysOfWeek = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];

const InserirVendasPage: React.FC = () => {
    const [weekData, setWeekData] = useState(
        daysOfWeek.map(day => ({
            day,
            approaches: '',
            sales: '',
            itemsPerSale: '',
            revenue: '',
        }))
    );
    const [currentDayIndex, setCurrentDayIndex] = useState(0);
    const [isWeekConfirmed, setIsWeekConfirmed] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleInputChange = (day: string, field: string, value: string) => {
        setWeekData(prevData => 
            prevData.map(entry => 
                entry.day === day ? { ...entry, [field]: value } : entry
            )
        );
    };

    const handleConfirmDay = () => {
        const currentDayData = weekData[currentDayIndex];

        if (currentDayData.approaches && currentDayData.sales && currentDayData.itemsPerSale && currentDayData.revenue) {
            toast({
                title: 'Sucesso',
                description: `${currentDayData.day} confirmado com sucesso.`,
                variant: 'success',
            });

            if (currentDayIndex === daysOfWeek.length - 1) {
                setIsWeekConfirmed(true);
            } else {
                setCurrentDayIndex(prevIndex => prevIndex + 1);
            }
        } else {
            toast({
                title: 'Erro',
                description: 'Preencha todos os campos para continuar.',
                variant: 'destructive',
            });
        }
    };

    const handleConfirmWeek = async () => {
        // Calcula os totais da semana com base nos dados diários
        const totalApproaches = weekData.reduce((sum, day) => sum + parseInt(day.approaches || '0', 10), 0);
        const totalSales = weekData.reduce((sum, day) => sum + parseInt(day.sales || '0', 10), 0);
        const totalPiecesSold = weekData.reduce((sum, day) => sum + parseInt(day.itemsPerSale || '0', 10), 0);
        const totalRevenue = weekData.reduce((sum, day) => sum + parseFloat(day.revenue.replace(/[^\d,]/g, '').replace(',', '.') || '0'), 0);

        const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0;
        const conversionRate = totalApproaches > 0 ? (totalSales / totalApproaches) * 100 : 0;
        const piecesPerSale = totalSales > 0 ? totalPiecesSold / totalSales : 0;

        try {
            const response = await fetch('/api/weekly-summaries/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: 1, // Substituir pelo ID do usuário atual
                    weekStartDate: '2023-11-01', // Ajustar para a data de início da semana
                    weekEndDate: '2023-11-07', // Ajustar para a data de término da semana
                    totalSales,
                    averageTicket,
                    conversionRate,
                    highestSaleValue: totalRevenue, // Apenas um exemplo; ajustar conforme necessário
                    totalPiecesSold,
                    piecesPerSale,
                    totalApproaches,
                    totalCommission: 0, // Ajustar conforme necessário
                }),
            });

            if (!response.ok) throw new Error('Erro ao enviar dados semanais.');

            toast({
                title: 'Sucesso',
                description: 'Semana confirmada com sucesso!',
                variant: 'success',
            });

            router.push('/kpi-vendas');
        } catch (error) {
            console.error(error);
            toast({
                title: 'Erro',
                description: 'Erro ao confirmar semana.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-semibold mb-6">Inserir Dados de Vendas</h1>
            <form onSubmit={(e) => e.preventDefault()}>
                <DailyInputForm
                    dayData={weekData[currentDayIndex]}
                    onInputChange={handleInputChange}
                />
                
                {!isWeekConfirmed && (
                    <button 
                        type="button" 
                        onClick={handleConfirmDay}
                        className="w-full mt-4 py-3 bg-gradient-to-t from-red-700 to-red-500 text-white rounded-lg font-semibold"
                    >
                        Confirmar {weekData[currentDayIndex].day}
                    </button>
                )}

                {isWeekConfirmed && (
                    <button 
                        type="button" 
                        onClick={handleConfirmWeek}
                        className="w-full mt-4 py-3 bg-green-600 text-white rounded-lg font-semibold"
                    >
                        Confirmar Semana
                    </button>
                )}
            </form>
        </div>
    );
};

export default InserirVendasPage;
