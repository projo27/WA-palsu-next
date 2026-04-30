import React, { useEffect, useState } from "react";
import { MessageInputProps } from "./types";

export const DocsMessageInput: React.FC<MessageInputProps> = ({
  msgText,
  setMsgText,
  msgTime,
  setMsgTime,
  msgStatus,
  setMsgStatus,
  msgReaction,
  setMsgReaction,
}) => {
  const [docName, setDocName] = useState("document name");
  const [docExt, setDocExt] = useState("JPG");
  const [docSize, setDocSize] = useState("12");
  const [docSizeType, setDocSizeType] = useState("KB");

  useEffect(() => {
    try {
      if (msgText && msgText.startsWith("{")) {
        const parsed = JSON.parse(msgText);
        if (parsed.docName) setDocName(parsed.docName);
        if (parsed.docExt) setDocExt(parsed.docExt);
        if (parsed.docSize) setDocSize(parsed.docSize);
        if (parsed.docSizeType) setDocSizeType(parsed.docSizeType);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    setMsgText(JSON.stringify({ docName, docExt, docSize, docSizeType }));
  }, [docName, docExt, docSize, docSizeType, setMsgText]);

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="grid grid-cols-[2fr_1fr] gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 capitalize">
            Document Name & Type
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              className="w-[60%] p-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
              placeholder="document name"
            />
            <select
              value={docExt}
              onChange={(e) => setDocExt(e.target.value)}
              className="w-[40%] p-2.5  rounded-lg border-r-8 border-transparent outline outline-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="JPG">JPG</option>
              <option value="PNG">PNG</option>
              <option value="PDF">PDF</option>
              <option value="DOCX">DOCX</option>
              <option value="XLSX">XLSX</option>
              <option value="ZIP">ZIP</option>
              <option value="APK">APK</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 capitalize">
            Document Size & Type
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={docSize}
              onChange={(e) => setDocSize(e.target.value)}
              className="w-[50%] p-2.5  rounded-lg border-r-8 border-transparent outline outline-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400"
              placeholder="size"
            />
            <select
              value={docSizeType}
              onChange={(e) => setDocSizeType(e.target.value)}
              className="w-[50%] p-2.5  rounded-lg border-r-8 border-transparent outline outline-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="Bytes">Bytes</option>
              <option value="KB">KB</option>
              <option value="MB">MB</option>
              <option value="GB">GB</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
