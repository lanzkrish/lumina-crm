import React, { useState } from 'react';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Project } from '@/lib/types';

export default function CalendarView({ projects }: { projects: Project[] }) {
  const [currentDate, setCurrentDate] = useState(dayjs());

  const startOfMonth = currentDate.startOf('month');
  const endOfMonth = currentDate.endOf('month');
  const startDate = startOfMonth.startOf('week');
  const endDate = endOfMonth.endOf('week');

  const dateFormat = "D";
  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = day.format(dateFormat);
      const cloneDay = day;
      const isCurrentMonth = day.month() === currentDate.month();
      
      const dayStr = day.format('YYYY-MM-DD');
      const dayProjects = projects.filter(p => {
        if (!p.eventDate) return false;
        const pDate = typeof p.eventDate === 'string' ? p.eventDate.substring(0, 10) : dayjs(p.eventDate).format('YYYY-MM-DD');
        return pDate === dayStr;
      });
      
      days.push(
        <div 
          key={dayStr} 
          className={`min-h-[80px] p-2 flex flex-col ${!isCurrentMonth ? 'text-gray-400 bg-gray-50' : 'bg-white text-gray-900'}`}
        >
          <span className="text-sm font-medium self-end">{formattedDate}</span>
          <div className="mt-1 flex flex-col gap-1 overflow-y-auto max-h-[60px] no-scrollbar">
            {dayProjects.map((p, idx) => {
              const pDate = typeof p.eventDate === 'string' ? p.eventDate.substring(0, 10) : dayjs(p.eventDate).format('YYYY-MM-DD');
              const isPast = dayjs(pDate).isBefore(dayjs().startOf('day'));
              return (
                <div 
                  key={idx} 
                  className={`text-[10px] truncate px-1.5 py-0.5 rounded ${isPast ? 'bg-gray-200 text-gray-700' : 'bg-green-100 text-green-700'}`}
                  title={p.name}
                >
                  {p.name}
                </div>
              );
            })}
          </div>
        </div>
      );
      day = day.add(1, 'day');
    }
    rows.push(
      <div className="grid grid-cols-7 gap-px bg-gray-200" key={day.format('YYYY-MM-DD')}>
        {days}
      </div>
    );
    days = [];
  }

  const nextMonth = () => setCurrentDate(currentDate.add(1, 'month'));
  const prevMonth = () => setCurrentDate(currentDate.subtract(1, 'month'));

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-primary">{currentDate.format('MMMM YYYY')} Bookings</h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-1 hover:bg-surface-variant rounded"><ChevronLeft className="w-5 h-5"/></button>
          <button onClick={nextMonth} className="p-1 hover:bg-surface-variant rounded"><ChevronRight className="w-5 h-5"/></button>
        </div>
      </div>
      <div className="grid grid-cols-7 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center text-xs font-semibold text-on-surface-variant uppercase">{d}</div>
        ))}
      </div>
      <div className="flex-1 flex flex-col border border-gray-200 rounded-lg overflow-hidden bg-gray-200 gap-px">
        {rows}
      </div>
    </div>
  );
}
