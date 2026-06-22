'use client';

import { useState } from 'react';

interface DailyCalendarProps {
  year: number;
  month: number;
  onDateSelect: (date: string) => void;
  datesWithEvents: string[];
}

const months = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
];

const weekDays = ['Dush', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba'];

export function DailyCalendar({ year, month, onDateSelect, datesWithEvents }: DailyCalendarProps) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const days: (number | null)[] = [];
  
  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push(null);
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const hasEvent = (day: number | null) => {
    if (!day) return false;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return datesWithEvents.includes(dateStr);
  };

  const handleDateClick = (day: number | null) => {
    if (!day) return;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onDateSelect(dateStr);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
        {months[month]} {year}
      </h3>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, idx) => (
          <button
            key={idx}
            onClick={() => handleDateClick(day)}
            disabled={!day}
            className={`
              aspect-square rounded-lg text-sm font-semibold transition-all
              ${!day
                ? 'opacity-30 cursor-not-allowed'
                : hasEvent(day)
                ? 'bg-primary text-primary-foreground shadow-md hover:shadow-lg'
                : 'bg-background border border-border text-foreground hover:border-primary/50'
              }
            `}
          >
            {day}
            {hasEvent(day) && <div className="text-xs mt-0.5">•</div>}
          </button>
        ))}
      </div>
    </div>
  );
}
