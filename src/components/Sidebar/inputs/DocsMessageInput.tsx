import React, { useState, useEffect } from 'react';
import { MessageInputProps } from './types';

export const DocsMessageInput: React.FC<MessageInputProps> = ({
  msgText, setMsgText, msgTime, setMsgTime, msgStatus, setMsgStatus, msgReaction, setMsgReaction
}) => {
  const [docName, setDocName] = useState('document name');
  const [docExt, setDocExt] = useState('JPG');
  const [docSize, setDocSize] = useState('12');
  const [docSizeType, setDocSizeType] = useState('Bytes');

  useEffect(() => {
    try {
      if (msgText && msgText.startsWith('{')) {
        const parsed = JSON.parse(msgText);
        if (parsed.docName) setDocName(parsed.docName);
        if (parsed.docExt) setDocExt(parsed.docExt);
        if (parsed.docSize) setDocSize(parsed.docSize);
        if (parsed.docSizeType) setDocSizeType(parsed.docSizeType);
      }
    } catch(e) {}
  }, []);

  useEffect(() => {
    setMsgText(JSON.stringify({ docName, docExt, docSize, docSizeType }));
  }, [docName, docExt, docSize, docSizeType, setMsgText]);

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Document Name & Type</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={docName} 
              onChange={e => setDocName(e.target.value)} 
              className="w-[60%] p-2 rounded-md border border-gray-200 text-sm focus:ring-1 focus:ring-[#539ba0] outline-none" 
              placeholder="document name" 
            />
            <select 
              value={docExt} 
              onChange={e => setDocExt(e.target.value)} 
              className="w-[40%] p-2 rounded-md border border-gray-200 text-sm focus:ring-1 focus:ring-[#539ba0] outline-none"
            >
              <option value="JPG">JPG</option>
              <option value="PNG">PNG</option>
              <option value="PDF">PDF</option>
              <option value="DOCX">DOCX</option>
              <option value="XLSX">XLSX</option>
              <option value="ZIP">ZIP</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Document Size & Type</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={docSize} 
              onChange={e => setDocSize(e.target.value)} 
              className="w-[50%] p-2 rounded-md border border-gray-200 text-sm focus:ring-1 focus:ring-[#539ba0] outline-none" 
              placeholder="size" 
            />
            <select 
              value={docSizeType} 
              onChange={e => setDocSizeType(e.target.value)} 
              className="w-[50%] p-2 rounded-md border border-gray-200 text-sm focus:ring-1 focus:ring-[#539ba0] outline-none"
            >
              <option value="Bytes">Bytes</option>
              <option value="KB">KB</option>
              <option value="MB">MB</option>
              <option value="GB">GB</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Message Time</label>
          <input 
            type="text" 
            value={msgTime}
            onChange={(e) => setMsgTime(e.target.value)}
            className="w-full p-2 rounded border border-gray-200 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Status</label>
          <select 
            value={msgStatus}
            onChange={(e) => setMsgStatus(e.target.value as any)}
            className="w-full p-2 rounded border border-gray-200 text-sm"
          >
            <option value="none">None</option>
            <option value="sent">Sent</option>
            <option value="delivered">Delivered</option>
            <option value="seen">Seen</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Reaction</label>
          <input 
            type="text" 
            placeholder="👍"
            value={msgReaction}
            onChange={(e) => setMsgReaction(e.target.value)}
            className="w-full p-2 rounded border border-gray-200 text-sm"
          />
        </div>
      </div>
    </div>
  );
};
