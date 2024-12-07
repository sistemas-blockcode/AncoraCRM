'use client'
import React from 'react';

interface WeekSelectorProps {
    currentWeek: number;
    currentMonth: string;
}

const WeekSelector: React.FC<WeekSelectorProps> = ({ currentWeek, currentMonth }) => {
    return (
        <div className="text-lg font-semibold">
            Semana {currentWeek} de {currentMonth}
        </div>
    );
};

export default WeekSelector;
