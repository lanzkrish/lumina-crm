import React, { useState } from 'react';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight, X, Calendar as CalendarIcon, MapPin, Camera } from 'lucide-react';
import { Project } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

export default function CalendarView({ projects }: { projects: Project[] }) {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDateData, setSelectedDateData] = useState<{date: string, projects: Project[]} | null>(null);

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
      const isCurrentMonth = day.month() === currentDate.month();
      
      const dayStr = day.format('YYYY-MM-DD');
      const dayProjects = projects.filter(p => {
        if (!p.eventDate) return false;
        const pDate = typeof p.eventDate === 'string' ? p.eventDate.substring(0, 10) : dayjs(p.eventDate).format('YYYY-MM-DD');
        return pDate === dayStr;
      });
      
      const hasProjects = dayProjects.length > 0;
      
      days.push(
        <div 
          key={dayStr} 
          onClick={() => hasProjects && setSelectedDateData({ date: dayStr, projects: dayProjects })}
          className={`min-h-[80px] p-2 flex flex-col transition-colors ${!isCurrentMonth ? 'text-gray-400 bg-gray-50' : 'bg-white text-gray-900'} ${hasProjects ? 'cursor-pointer hover:bg-primary/5' : ''}`}
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
    <div className="w-full h-full flex flex-col relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-primary">{currentDate.format('MMMM YYYY')} Bookings</h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-1 hover:bg-surface-variant rounded transition-colors"><ChevronLeft className="w-5 h-5"/></button>
          <button onClick={nextMonth} className="p-1 hover:bg-surface-variant rounded transition-colors"><ChevronRight className="w-5 h-5"/></button>
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

      {/* Date Details Modal */}
      <AnimatePresence>
        {selectedDateData && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedDateData(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface w-full max-w-lg max-h-[80vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-white/20"
            >
              <div className="flex justify-between items-center p-6 border-b border-outline-variant/30 bg-surface-container-lowest shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-[18px] font-semibold text-on-surface leading-tight">
                      {dayjs(selectedDateData.date).format('MMMM D, YYYY')}
                    </h2>
                    <p className="text-[13px] text-on-surface-variant font-medium">
                      {selectedDateData.projects.length} shoot{selectedDateData.projects.length !== 1 ? 's' : ''} scheduled
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelectedDateData(null)} className="p-2 hover:bg-surface-variant rounded-full transition-colors text-on-surface-variant">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
                {selectedDateData.projects.map((project, idx) => {
                  const isPast = dayjs(selectedDateData.date).isBefore(dayjs().startOf('day'));
                  return (
                    <div key={idx} className="bg-surface-variant/30 border border-outline-variant/50 rounded-2xl p-5 hover:bg-surface-variant/50 transition-colors group">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-[16px] text-on-surface group-hover:text-primary transition-colors">{project.name}</h3>
                        <span className={`text-[11px] font-semibold px-2 py-1 rounded-md uppercase tracking-wider ${isPast ? 'bg-gray-200 text-gray-700' : 'bg-green-100 text-green-700'}`}>
                          {isPast ? 'Completed' : 'Upcoming'}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 text-[13px] text-on-surface-variant">
                          <Camera className="w-4 h-4 shrink-0 text-primary/70 mt-0.5" />
                          <span className="font-medium text-on-surface">Client: <span className="text-on-surface-variant font-normal">{project.name}</span></span>
                        </div>
                        {project.eventType && (
                          <div className="flex items-start gap-2 text-[13px] text-on-surface-variant">
                            <CalendarIcon className="w-4 h-4 shrink-0 text-primary/70 mt-0.5" />
                            <span className="font-medium text-on-surface">Event Type: <span className="text-on-surface-variant font-normal">{typeof project.eventType === 'string' ? project.eventType : (project.eventType as any).name || 'Unknown'}</span></span>
                          </div>
                        )}
                        <div className="flex items-start gap-2 text-[13px] text-on-surface-variant">
                          <MapPin className="w-4 h-4 shrink-0 text-primary/70 mt-0.5" />
                          <span className="font-medium text-on-surface">Venue: <span className="text-on-surface-variant font-normal">{project.location || 'Not specified'}</span></span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
