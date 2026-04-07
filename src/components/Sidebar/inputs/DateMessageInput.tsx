import React from 'react';
import { cn } from '../../../lib/utils';
import { MessageInputProps } from './types';

export const DateMessageInput: React.FC<MessageInputProps> = ({ msgText, setMsgText }) => {
  const [isCustomDate, setIsCustomDate] = React.useState(false);
  const [customDateVal, setCustomDateVal] = React.useState(new Date().toISOString().split('T')[0]);
  const [customDateFormat, setCustomDateFormat] = React.useState(0);

  React.useEffect(() => {
    if (isCustomDate && customDateVal) {
      const dateObj = new Date(customDateVal);
      if (!isNaN(dateObj.getTime())) {
        const monthsFull = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const daysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        const d = dateObj.getDate().toString().padStart(2, '0');
        const mFull = monthsFull[dateObj.getMonth()];
        const mShort = monthsShort[dateObj.getMonth()];
        const y = dateObj.getFullYear();
        const dayName = daysShort[dateObj.getDay()];

        let formatted = '';
        if (customDateFormat === 0) formatted = `${d} ${mFull} ${y}`;
        else if (customDateFormat === 1) formatted = `${dayName}, ${d} ${mShort}`;
        else if (customDateFormat === 2) formatted = `${d} ${mShort} ${y}`;

        setMsgText(formatted);
      }
    }
  }, [isCustomDate, customDateVal, customDateFormat, setMsgText]);

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex flex-wrap gap-2">
        <button 
          onClick={() => { setIsCustomDate(false); setMsgText(''); }} 
          className={cn("px-3 py-1.5 rounded-md text-sm border transition-all", !isCustomDate && !msgText ? "bg-[#539ba0] text-white border-[#539ba0]" : "bg-white text-gray-600 hover:bg-gray-50")}
        >None</button>
        <button 
          onClick={() => { setIsCustomDate(false); setMsgText('Today'); }} 
          className={cn("px-3 py-1.5 rounded-md text-sm border transition-all", !isCustomDate && msgText === 'Today' ? "bg-[#539ba0] text-white border-[#539ba0]" : "bg-white text-gray-600 hover:bg-gray-50")}
        >Today</button>
        <button 
          onClick={() => { setIsCustomDate(false); setMsgText('Yesterday'); }} 
          className={cn("px-3 py-1.5 rounded-md text-sm border transition-all", !isCustomDate && msgText === 'Yesterday' ? "bg-[#539ba0] text-white border-[#539ba0]" : "bg-white text-gray-600 hover:bg-gray-50")}
        >Yesterday</button>
        <select 
          value={!isCustomDate && ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].includes(msgText) ? msgText : ''}
          onChange={(e) => { setIsCustomDate(false); setMsgText(e.target.value); }}
          className="px-3 py-1.5 rounded-md text-sm border bg-white text-gray-600 cursor-pointer"
        >
          <option value="" disabled hidden>Day...</option>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
          <option value="Sunday">Sunday</option>
        </select>
        <button 
          onClick={() => setIsCustomDate(true)}
          className={cn("px-3 py-1.5 rounded-md text-sm border transition-all", isCustomDate ? "bg-[#539ba0] text-white border-[#539ba0]" : "bg-white text-gray-600 hover:bg-gray-50")}
        >
          Custom Date
        </button>
      </div>

      {isCustomDate && (
        <div className="space-y-4 pt-2 border-t border-gray-100">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Date</label>
            <input 
              type="date"
              value={customDateVal}
              onChange={(e) => setCustomDateVal(e.target.value)}
              className="w-full p-2 rounded border border-gray-200 text-sm focus:ring-1 focus:ring-[#539ba0] outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Date Format</label>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => setCustomDateFormat(0)} className={cn("py-2 px-1 text-xs font-medium rounded border text-center transition-all", customDateFormat === 0 ? "bg-[#539ba0] text-white border-[#539ba0] shadow-sm" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50")}>04 April 2026</button>
              <button onClick={() => setCustomDateFormat(1)} className={cn("py-2 px-1 text-xs font-medium rounded border text-center transition-all", customDateFormat === 1 ? "bg-[#539ba0] text-white border-[#539ba0] shadow-sm" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50")}>Sat, 04 Apr</button>
              <button onClick={() => setCustomDateFormat(2)} className={cn("py-2 px-1 text-xs font-medium rounded border text-center transition-all", customDateFormat === 2 ? "bg-[#539ba0] text-white border-[#539ba0] shadow-sm" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50")}>04 Apr 2026</button>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-3 mt-4">
        <label className="text-sm font-medium text-gray-600">Example</label>
        <div className="relative border rounded-lg bg-[#efeae2] p-4 flex flex-col gap-3 overflow-hidden text-sm">
          {/* Visual patterns can be added here if needed */}
          <div className="self-start max-w-[80%] bg-white px-2 py-1 flex items-end gap-2 rounded-lg shadow-sm">
            <span>Did you go shopping? 🤔</span>
            <span className="text-[9px] opacity-60 pb-0.5 whitespace-nowrap">04:25 pm</span>
          </div>
          
          <div className="self-center bg-white/70 px-3 py-1 rounded-lg text-xs uppercase font-medium shadow-sm">
            {msgText || 'Today'}
          </div>
          
          <div className="self-end max-w-[80%] bg-[#d9fdd3] px-2 py-1 flex items-end gap-2 rounded-lg shadow-sm">
            <span>No..</span>
            <span className="text-[9px] opacity-60 pb-0.5 whitespace-nowrap flex items-center gap-1">
              04:26 pm 
              <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7M5 13l4 4L19 7"></path></svg>
            </span>
          </div>
        </div>
        <div className="flex items-start gap-2 pt-1 text-gray-500">
          <div className="w-4 h-4 rounded-full bg-gray-400 text-white flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0">i</div>
          <p className="text-xs">Add a date to separate messages, just like the example above.</p>
        </div>
      </div>
    </div>
  );
}
