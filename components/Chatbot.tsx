import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Hola, soy el asistente del Lic. Ramón Romero. ¿En qué puedo ayudarte hoy?", isUser: false }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [interactionCount, setInteractionCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const MAX_INTERACTIONS = 7;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleScrollToBooking = () => {
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isFinished) return;

    const userText = inputValue.trim();
    setInputValue("");
    setMessages(prev => [...prev, { text: userText, isUser: true }]);
    setIsLoading(true);

    const currentCount = interactionCount + 1;
    setInteractionCount(currentCount);

    try {
      const history = messages.slice(-6).map(m => `${m.isUser ? 'Usuario' : 'Asistente'}: ${m.text}`).join('\n');
      setMessages(prev => [...prev, { text: "", isUser: false }]);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userText,
          history: history,
          interactionCount: currentCount
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const text = await response.text();
      
      setMessages(prev => {
        const newMessages = prev.map(msg => ({ ...msg }));
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && !lastMessage.isUser) {
          lastMessage.text = text;
        }
        return newMessages;
      });

      if (currentCount >= MAX_INTERACTIONS) {
        setIsFinished(true);
      }

    } catch (error: any) {
      console.error("Error generating response:", error);
      const errorMessage = error.message || "Error desconocido";
      
      setMessages(prev => {
         const newMessages = [...prev];
         if (newMessages.length > 0 && !newMessages[newMessages.length - 1].isUser && newMessages[newMessages.length - 1].text === "") {
             newMessages[newMessages.length - 1].text = `Lo siento, hubo un problema de conexión (${errorMessage}). Por favor intenta de nuevo.`;
         } else {
             newMessages.push({ text: `Lo siento, hubo un problema de conexión (${errorMessage}). Por favor intenta de nuevo.`, isUser: false });
         }
         return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-corp-900 p-4 flex justify-between items-center border-b border-corp-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-corp-800 rounded-full border border-corp-700">
                  <Bot className="w-5 h-5 text-accent-gold" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm">Asistente Virtual</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <p className="text-gray-400 text-xs">En línea</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-corp-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="h-96 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-4">
              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                      msg.isUser 
                        ? 'bg-corp-900 text-white rounded-tr-none' 
                        : 'bg-white border border-gray-200 text-corp-700 rounded-tl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white border border-gray-200 p-3.5 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              {!isFinished ? (
                <div className="flex gap-2 items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 transition-all">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Escribe tu mensaje..."
                    disabled={isLoading}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-corp-800 placeholder-gray-400 disabled:opacity-50 outline-none"
                  />
                  <button 
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isLoading}
                    className={`p-2 rounded-full transition-all ${
                      inputValue.trim() && !isLoading
                        ? 'bg-accent-gold text-corp-900 hover:bg-accent-goldDim hover:scale-105' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-3"
                >
                  <p className="text-center text-xs text-gray-500">
                    Para brindarte una atención personalizada y completa, por favor continúa en nuestro formulario de contacto.
                  </p>
                  <button 
                    onClick={handleScrollToBooking}
                    className="w-full bg-corp-900 text-white py-3 rounded-xl font-medium text-sm hover:bg-corp-800 transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Ir al Formulario de Contacto
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`group relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-accent-gold/30 ${
          isOpen 
            ? 'bg-corp-800 text-white' 
            : 'bg-corp-900 text-accent-gold'
        }`}
        aria-label="Abrir chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="bot"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <Bot className="w-7 h-7" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-gold opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-gold"></span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
