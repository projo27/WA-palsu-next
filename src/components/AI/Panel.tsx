import { GoogleGenAI } from "@google/genai";
import { Bot } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { ChatSettings, Message } from "../../types";

interface AIPanelProps {
  className?: string;
  onImport?: (data: { settings: ChatSettings; messages: Message[] }) => void;
  activeTab: string;
}

export const AIPanel = ({ className, onImport, activeTab }: AIPanelProps) => {
  const [chatType, setChatType] = useState<"chat" | "group">("chat");
  const [theme, setTheme] = useState("");
  const [language, setLanguage] = useState("Indonesia");
  const [style, setStyle] = useState("Kasual / Gaul");
  const [chatLines, setChatLines] = useState<number>(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === "chat") {
      setChatType("chat");
    } else if (activeTab === "group") {
      setChatType("group");
    }
  }, [activeTab]);

  const parseJSONToChat = (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.settings && data.messages && onImport) {
        // Ensure IDs are strings and unique enough
        const messages = data.messages.map((m: any, idx: number) => ({
          ...m,
          id: m.id || Date.now().toString() + idx,
        }));
        onImport({ settings: data.settings, messages });
      } else {
        setError("Format JSON tidak valid");
      }
    } catch (e) {
      setError("Gagal mem-parsing JSON dari AI");
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get API key from Vite environment
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error(
          "API Key Gemini tidak ditemukan di .env (VITE_GEMINI_API_KEY)",
        );
      }

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `You are a creative writer generating a fake WhatsApp chat.
Generate a JSON output representing the chat. Do not include markdown code block syntax around the JSON.
Requirements:
- Chat Type: ${chatType}
- Theme: ${theme}
- Language: ${language}
- Tone/Style: ${style}

The JSON must have this exact structure:
{
  "settings": {
    "isGroup": ${chatType === "group"},
    "receiverName": "${chatType === "group" ? "Grup Keren" : "Nama Kontak"}",
    "receiverStatus": "Online",
    ${chatType === "group" ? `"groupMembers": "Member 1, Member 2",\n    "groupParticipants": [{ "id": "1", "name": "Member 1", "color": "#ffb300" }, { "id": "2", "name": "Member 2", "color": "#00a884" }],` : ""}
    "chatBackgroundColor": "#0b141a",
    "isDarkMode": true
  },
  "messages": [
    {
      "id": "1",
      "text": "Halo! Sudah lihat video yang aku kirim?",
      "type": "text",
      "sender": "bot",
      "timestamp": "09:00",
      "status": "seen",
      "senderId": "1",
      ${chatType === "group" ? `"senderName": "Member 1",\n      "senderColor": "#ffb300"` : ""}
    },
    {
      "id": "2",
      "text": "Belum nih, yang mana ya?",
      "type": "text",
      "sender": "user",
      "timestamp": "09:01",
      "status": "seen",
      "replyToId": "1"
    },
    {
      "id": "3",
      "type": "video",
      "sender": "bot",
      "timestamp": "09:02",
      "status": "seen",
      "senderId": "1",
      "fileUrl": "https://www.w3schools.com/html/mov_bbb.mp4",
      "thumbnailUrl": "https://placehold.co/400x225?text=Video+Thumbnail",
      ${chatType === "group" ? `"senderName": "Member 1",\n      "senderColor": "#ffb300"` : ""}
    },
    {
      "id": "4",
      "text": "HARI INI",
      "type": "date",
      "sender": "system",
      "timestamp": "09:00",
      "status": "none"
    }
  ]
}

Supported Message Types:
- 'text': Standard text message.
- 'video': Video message. MUST include "fileUrl" and "thumbnailUrl".
- 'image': Image message. MUST include "fileUrl".
- 'file': Document. "text" field MUST be a JSON string: {"docName":"report","docExt":"PDF","docSize":"1.2","docSizeType":"MB"}
- 'call': Call log. "text" field MUST be a JSON string: {"callMode":"video","callType":"Call","hh":"","mm":"2","ss":"30"}
- 'contact': Contact share. "text" field MUST be a JSON string: {"contactName":"John Doe","isMultiple":false,"contactCount":"1"}
- 'location': Location share. "text" field MUST be a JSON string: {"locType":"current","notes":"Office","liveTime":"","pinName":"","pinAvatar":""}
- 'date': System date separator. "sender" MUST be "system" and "text" is the date label.

Additional Rules:
1. "id": Provide a unique string for each message.
2. "senderId": For "bot" messages, always provide a "senderId" (e.g., "1", "2") that matches a participant.
3. "replyToId": To indicate a reply, set this to the "id" of the message being replied to.
4. "sender": Use "user" for the app owner and "bot" for the contact/group members.
5. "status": Use "sent", "delivered", or "seen" for "user" messages.
6. Generate exactly ${chatLines} messages for a natural conversation flow.
7. The chat must be realistic, including emojis and reactions ("reaction" field) where appropriate.
8. Reply ONLY with valid JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      if (response.text) {
        console.log(response.text);
        parseJSONToChat(response.text);
      } else {
        throw new Error("Respon dari AI kosong");
      }
    } catch (err: any) {
      console.error("AI Gen Error:", err);
      setError(err.message || "Gagal melakukan generate chat.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full",
        className,
      )}
    >
      <div className="bg-black text-white py-4 px-5 shrink-0">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <Bot size={20} /> AI Chat Generator
        </h2>
        <p className="text-indigo-100 text-sm mt-1">
          Generate percakapan palsu dengan AI
        </p>
      </div>

      <div className="p-5 flex flex-col gap-4 overflow-y-auto custom-scrollbar flex-1">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200 break-words">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Tipe Chat</label>
          <select
            value={chatType}
            onChange={(e) => setChatType(e.target.value as any)}
            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
          >
            <option value="single">Single Chat</option>
            <option value="group">Group Chat</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">
            Tema Percakapan
          </label>
          <textarea
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="Contoh: Gibah emak-emak soal tetangga baru, kuis tebak-tebakan hewan..."
            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow min-h-[80px] resize-y"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Bahasa</label>
          <input
            type="text"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            placeholder="Contoh: Indonesia, English, Jawa"
            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">
            Gaya Bahasa (Tone)
          </label>
          <input
            type="text"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            placeholder="Contoh: Kasual, Gaul, Pekerjaan, Joke bapak-bapak"
            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">
            Jumlah Pesan (Baris)
          </label>
          <input
            type="number"
            min={20}
            value={chatLines}
            onChange={(e) => setChatLines(parseInt(e.target.value) || 20)}
            onBlur={(e) => {
              if (parseInt(e.target.value) < 20) {
                setChatLines(20);
              }
            }}
            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !theme.trim()}
          className="mt-4 w-full py-3 bg-black hover:bg-gray-800 disabled:bg-gray-500 disabled:cursor-not-allowed cursor-pointer text-white font-medium rounded-lg transition-colors flex justify-center items-center gap-2 shadow-sm"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Bot size={18} />
              Generate Chat by AI
            </>
          )}
        </button>
      </div>
    </div>
  );
};
