import React from 'react';

interface DayData {
    day: string;
    approaches: string;
    sales: string;
    itemsPerSale: string;
    revenue: string;
}

interface DailyInputFormProps {
    dayData: DayData;
    onInputChange: (day: string, field: string, value: string) => void;
    disabled?: boolean;
}

const DailyInputForm: React.FC<DailyInputFormProps> = ({ dayData, onInputChange, disabled }) => {
    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!disabled) onInputChange(dayData.day, field, e.target.value);
    };

    const handleRevenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!disabled) {
            let value = e.target.value.replace(/\D/g, '');
            const formattedValue = (Number(value) / 100).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            });
            onInputChange(dayData.day, 'revenue', formattedValue);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-lg space-y-4">
            <h3 className="text-lg font-semibold">{dayData.day}</h3>
            <div className="space-y-2">
                {/* Abordagens */}
                <label className="block">
                    <span className="text-gray-600">Abordagens</span>
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="\d*"
                        value={dayData.approaches}
                        onChange={handleChange('approaches')}
                        onKeyPress={handleKeyPress}
                        className="w-full p-2 border rounded-lg appearance-none"
                        disabled={disabled}
                    />
                </label>
                {/* Vendas Concluídas */}
                <label className="block">
                    <span className="text-gray-600">Vendas Concluídas</span>
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="\d*"
                        value={dayData.sales}
                        onChange={handleChange('sales')}
                        onKeyPress={handleKeyPress}
                        className="w-full p-2 border rounded-lg appearance-none"
                        disabled={disabled}
                    />
                </label>
                {/* Quantidade de Peças por Venda */}
                <label className="block">
                    <span className="text-gray-600">Quantidade de Peças por Venda</span>
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="\d*"
                        value={dayData.itemsPerSale}
                        onChange={handleChange('itemsPerSale')}
                        onKeyPress={handleKeyPress}
                        className="w-full p-2 border rounded-lg appearance-none"
                        disabled={disabled}
                    />
                </label>
                {/* Faturamento */}
                <label className="block">
                    <span className="text-gray-600">Faturamento (R$)</span>
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="\d*"
                        value={dayData.revenue}
                        onChange={handleRevenueChange}
                        onKeyPress={handleKeyPress}
                        className="w-full p-2 border rounded-lg"
                        placeholder="R$ 0,00"
                        disabled={disabled}
                    />
                </label>
            </div>
        </div>
    );
};

export default DailyInputForm;
