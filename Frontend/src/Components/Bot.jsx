
import React, { useEffect, useRef, useState, useCallback } from 'react'
import axios from 'axios'
import { FaUserCircle, FaRobot, FaPaperPlane, FaLightbulb, FaCode, FaUsers, FaStar, FaStarOfLife } from 'react-icons/fa'

function Bot() {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [typingIndicator, setTypingIndicator] = useState(false)
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)

    // Optimized scroll function with debouncing
    const scrollToBottom = useCallback(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'end',
                inline: 'nearest'
            });
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Optimized message sending with better error handling and response time tracking
    const handleSendMessage = useCallback(async () => {
        const userMessage = input.trim();
        if (!userMessage || loading) return;

        setLoading(true);
        setTypingIndicator(true);
        
        // Add user message immediately for better UX
        const userMsgObj = { text: userMessage, sender: 'user', id: Date.now() };
        setMessages(prev => [...prev, userMsgObj]);
        setInput("");
        
        try {
            const startTime = performance.now();
            const res = await axios.post("http://localhost:4002/bot/v1/message", {
                text: userMessage
            }, {
                timeout: 3000, // 3 second timeout (backend responds in <100ms)
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            const endTime = performance.now();
            const responseTime = endTime - startTime;

            if (res.status === 200) {
                // Add small delay for more natural typing effect
                const delay = Math.max(0, 300 - responseTime);
                
                setTimeout(() => {
                    const botMsgObj = { 
                        text: res.data.botMessage, 
                        sender: 'bot', 
                        id: Date.now(),
                        responseTime: res.data.responseTime,
                        cached: res.data.cached
                    };
                    setMessages(prev => [...prev, botMsgObj]);
                    setTypingIndicator(false);
                    setLoading(false);
                }, delay);
            }
        } catch (error) {
            console.log("Error sending message:", error);
            setTypingIndicator(false);
            setLoading(false);
            
            // Show error message
            const errorMsg = {
                text: "I'm having trouble connecting. Please try again in a moment.",
                sender: 'bot',
                id: Date.now(),
                error: true
            };
            setMessages(prev => [...prev, errorMsg]);
        }
    }, [input, loading]);

    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }, [handleSendMessage]);

    // Focus input on mount and when clicking on input area
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleInputFocus = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };
            
  return (
    <div className='flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-white'>
         {/* Professional Header */}
      <header className="fixed top-0 left-0 right-0 w-full border-b border-slate-700/50 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/95 backdrop-blur-md z-50 shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl border border-blue-400/30">
              <FaRobot className="text-white text-lg sm:text-xl" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">BotSpoof</h1>
              <p className="text-xs sm:text-sm text-slate-400">Interview Preparation Assistant</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">BotSpoof</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-400">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="hidden sm:inline">System Active</span>
              <span className="sm:hidden">Active</span>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-slate-700 to-slate-800 rounded-full flex items-center justify-center border border-slate-600">
              <FaUserCircle className="text-slate-400 text-sm sm:text-lg" />
            </div>
          </div>
        </div>
      </header>

      {/* Professional Chat Area */}
      <main className="flex-1 overflow-y-auto pt-20 sm:pt-24 pb-24 sm:pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl sm:max-w-5xl lg:max-w-6xl mx-auto">
          {messages.length === 0 ? (
            <div className="text-center py-16 sm:py-20">
              {/* Professional Welcome */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl sm:rounded-3xl mx-auto mb-6 sm:mb-10 flex items-center justify-center shadow-2xl border border-blue-400/30">
                <FaRobot className="text-white text-3xl sm:text-5xl" />
              </div>
              
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
                Welcome to BotSpoof
              </h2>
              <p className="text-slate-300 text-base sm:text-lg mb-8 sm:mb-12 max-w-xl sm:max-w-2xl mx-auto leading-relaxed">
                👋 Hi, I'm <span className="text-green-400 font-semibold">BotSpoof</span>. Get personalized interview guidance, technical explanations, and HR preparation tips.
              </p>
              
              {/* Quick Start Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-3xl sm:max-w-5xl mx-auto">
                {[
                  { text: "Tell me an interview question", icon: FaLightbulb, color: "from-yellow-400 to-orange-500" },
                  { text: "What is React?", icon: FaCode, color: "from-blue-400 to-cyan-500" },
                  { text: "How to introduce yourself?", icon: FaUsers, color: "from-green-400 to-emerald-500" }
                ].map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInput(item.text);
                      setTimeout(handleSendMessage, 100);
                    }}
                    className={`p-4 sm:p-6 rounded-lg sm:rounded-xl bg-gradient-to-r ${item.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:border-white/40 group relative overflow-hidden transform hover:scale-105 active:scale-95`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex items-center space-x-3 sm:space-x-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <item.icon className="text-white text-lg sm:text-xl" />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-lg leading-tight">{item.text}</h3>
                        <div className="mt-2 p-1 bg-white/20 rounded-full inline-block">
                          <FaStarOfLife className="text-yellow-300 text-xs sm:text-sm" />
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === "user" ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl shadow-xl ${
                        msg.sender === "user"
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border border-blue-500/30'
                          : 'bg-gradient-to-r from-slate-800 to-slate-900 text-slate-100 border border-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                          msg.sender === "user" 
                            ? 'bg-white/20 backdrop-blur-sm' 
                            : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                        }`}>
                          {msg.sender === "user" ? (
                            <FaUserCircle className="text-white text-sm sm:text-lg" />
                          ) : (
                            <FaRobot className="text-white text-xs sm:text-sm" />
                          )}
                        </div>
                        <div>
                          <span className="text-xs sm:text-xs font-semibold text-slate-300">
                            {msg.sender === "user" ? 'You' : 'BotSpoof'}
                          </span>
                          {msg.sender === 'bot' && (
                            <span className="ml-2 text-xs text-green-400 flex items-center space-x-1">
                              <FaStarOfLife className="text-xs" />
                              <span className="hidden sm:inline">AI Powered</span>
                              <span className="sm:hidden">AI</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))}

              {typingIndicator && (
                <div className="flex justify-start">
                  <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl shadow-xl">
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <FaRobot className="text-white text-xs sm:text-sm" />
                      </div>
                      <div>
                        <span className="text-xs sm:text-xs font-semibold text-slate-300">BotSpoof</span>
                        <span className="ml-2 text-xs text-green-400 flex items-center space-x-1">
                          <FaStarOfLife className="text-xs" />
                          <span className="hidden sm:inline">Typing...</span>
                          <span className="sm:hidden">Typing</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-1 sm:space-x-2">
                      {[0, 1, 2].map((i) => (
                        <div 
                          key={i}
                          className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-bounce" 
                          style={{ animationDelay: `${i * 0.15}s` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Professional Input Area */}
      <footer className="fixed bottom-0 left-0 right-0 w-full border-t border-slate-700/50 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/95 backdrop-blur-md z-50 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-end space-x-3 sm:space-x-6 bg-gradient-to-r from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-xl sm:rounded-2xl px-4 py-3 sm:px-8 sm:py-6 shadow-xl backdrop-blur-sm">
            <div className="flex-1 relative">
              <input
                type="text"
                className="w-full bg-transparent outline-none text-white placeholder-slate-400 text-base sm:text-lg pr-12 sm:pr-16 font-medium"
                placeholder="Ask BotSpoof..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={loading}
              />
              {input && (
                <button
                  onClick={() => setInput("")}
                  className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors text-sm sm:text-base"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              onClick={handleSendMessage}
              disabled={loading || !input.trim()}
              className={`p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-300 ${
                loading || !input.trim()
                  ? 'bg-slate-600 cursor-not-allowed text-slate-400'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
              }`}
            >
              <FaPaperPlane className={`text-white text-base sm:text-lg ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          {/* Professional Tips */}
          <div className="mt-3 sm:mt-6 text-center text-xs text-slate-500 space-y-1">
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-8 text-slate-400 text-xs sm:text-sm">
              <span className="flex items-center space-x-2">
                <FaLightbulb className="text-yellow-400 text-xs sm:text-sm" />
                <span>Be specific with your questions</span>
              </span>
              <span className="flex items-center space-x-2">
                <FaCode className="text-blue-400 text-xs sm:text-sm" />
                <span>Ask about technologies you're learning</span>
              </span>
            </div>
            <p className="text-xs">💡 Pro tip: The more context you provide, the better my answers will be!</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Bot
