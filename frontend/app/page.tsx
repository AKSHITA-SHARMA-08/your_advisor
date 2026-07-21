"use client";

import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const response = await fetch(`${backendUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      
      const data = await response.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (error) {
      console.error("Failed to fetch response:", error);
      setMessages([...newMessages, { role: "assistant", content: "Sorry, I am having trouble connecting right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-24 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex flex-col h-[80vh] bg-slate-900 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
        
        {/* Header */}
        <div className="w-full bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              YA
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white tracking-wide">YourAdvisor</h1>
              <p className="text-xs text-blue-400 font-medium">AI Financial Consultant</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-xs text-slate-300 font-medium">Online</span>
          </div>
        </div>

        {/* Chat Box */}
        <div className="flex-1 w-full overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-900/50">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
              <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 mb-4">
                <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p className="text-lg font-medium text-slate-300">Welcome to YourAdvisor</p>
              <p className="text-sm max-w-md text-center text-slate-500">I am here to assist you with professional financial advice, budgeting, and investment strategies. How can I help you today?</p>
            </div>
          )}
          {messages.map((m, index) => (
            <div key={index} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 shadow-md ${
                m.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-none p-4 shadow-md flex space-x-2 items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="w-full bg-slate-800 p-4 border-t border-slate-700">
          <form onSubmit={handleSubmit} className="flex space-x-3 max-w-4xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about investments, saving, or retirement..."
              className="flex-1 bg-slate-900 border border-slate-600 rounded-xl px-5 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner placeholder-slate-400"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center min-w-[100px]"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Send'
              )}
            </button>
          </form>
          <div className="text-center mt-3">
            <p className="text-[10px] text-slate-500">YourAdvisor is an AI. Please consult a human financial professional before making critical decisions.</p>
          </div>
        </div>

      </div>
    </main>
  );
}
