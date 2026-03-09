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
                timeout: 300000, // 5 minute timeout (300,000ms)
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
      {/* Enhanced Header */}
      <header className="fixed top-0 left-0 right-0 w-full border-b border-slate-700/50 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/95 backdrop-blur-xl z-50 shadow-xl">
        <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl border border-white/20 animate-pulse">
              <FaRobot className="text-white text-2xl sm:text-3xl" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">BotSpoof AI</h1>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">Your Interview Preparation Partner</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-3 text-sm">
              <div className="flex items-center space-x-2 text-slate-400">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                <span className="font-medium">System Online</span>
              </div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-slate-700 to-slate-800 rounded-full flex items-center justify-center border border-slate-600 shadow-lg">
              <FaUserCircle className="text-slate-400 text-lg" />
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Chat Area */}
      <main className="flex-1 overflow-y-auto pt-24 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {messages.length === 0 ? (
            <div className="text-center py-20">
              {/* Enhanced Welcome */}
              <div className="relative mx-auto mb-8">
                <div className="w-32 h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-3xl mx-auto flex items-center justify-center shadow-2xl border border-white/20 animate-bounce">
                  <FaRobot className="text-white text-5xl" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-3xl blur-xl opacity-20"></div>
              </div>
              
              <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Welcome to BotSpoof AI
              </h2>
              <p className="text-slate-300 text-lg sm:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                👋 Hi, I'm <span className="text-green-400 font-semibold">BotSpoof</span>. Your personal AI assistant for interview preparation, technical explanations, and career guidance.
              </p>
              
              {/* Enhanced Quick Start Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {[
                  { text: "Tell me an interview question", icon: FaLightbulb, color: "from-yellow-400 to-orange-500", gradient: "to-orange-500" },
                  { text: "What is React?", icon: FaCode, color: "from-blue-400 to-cyan-500", gradient: "to-cyan-500" },
                  { text: "How to introduce yourself?", icon: FaUsers, color: "from-green-400 to-emerald-500", gradient: "to-emerald-500" }
                ].map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInput(item.text);
                      setTimeout(handleSendMessage, 100);
                    }}
                    className={`group relative p-6 rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 border border-white/20 hover:border-white/40 overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex items-center space-x-4">
                      <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors shadow-lg">
                        <item.icon className="text-white text-2xl" />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <h3 className="font-bold text-base sm:text-lg leading-tight mb-2">{item.text}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-medium">Quick Start</span>
                          <div className="w-3 h-3 bg-yellow-300 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === "user" ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-500`}
                  >
                    <div
                      className={`max-w-[85%] px-6 py-4 rounded-2xl shadow-xl ${
                        msg.sender === "user"
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border border-blue-500/30'
                          : 'bg-gradient-to-r from-slate-800 to-slate-900 text-slate-100 border border-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          msg.sender === "user" 
                            ? 'bg-white/20 backdrop-blur-sm shadow-lg' 
                            : 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg'
                        }`}>
                          {msg.sender === "user" ? (
                            <FaUserCircle className="text-white text-xl" />
                          ) : (
                            <FaRobot className="text-white text-lg" />
                          )}
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-slate-300">
                            {msg.sender === "user" ? 'You' : 'BotSpoof AI'}
                          </span>
                          {msg.sender === 'bot' && (
                            <span className="ml-3 text-sm text-green-400 flex items-center space-x-2">
                              <FaStarOfLife className="text-xs" />
                              <span className="font-medium">AI Powered</span>
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-base leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))}

              {typingIndicator && (
                <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-500">
                  <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 px-6 py-4 rounded-2xl shadow-xl">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                        <FaRobot className="text-white text-lg" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-slate-300">BotSpoof AI</span>
                        <span className="ml-3 text-sm text-green-400 flex items-center space-x-2">
                          <FaStarOfLife className="text-xs" />
                          <span className="font-medium">Typing...</span>
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {[0, 1, 2].map((i) => (
                        <div 
                          key={i}
                          className="w-3 h-3 bg-green-400 rounded-full animate-bounce shadow-lg" 
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

      {/* Enhanced Input Area */}
      <footer className="fixed bottom-0 left-0 right-0 w-full border-t border-slate-700/50 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/95 backdrop-blur-xl z-50 shadow-2xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-end space-x-4 bg-gradient-to-r from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-2xl px-4 py-4 sm:px-6 sm:py-6 shadow-xl backdrop-blur-sm">
            <div className="flex-1 relative">
              <input
                type="text"
                className="w-full bg-transparent outline-none text-white placeholder-slate-400 text-base sm:text-lg pr-16 sm:pr-20 font-medium placeholder:font-normal"
                placeholder="Type your message here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={loading}
              />
              {input && (
                <button
                  onClick={() => setInput("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-all duration-200 text-base font-bold bg-slate-700/50 hover:bg-slate-600/50 rounded-full w-8 h-8 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              onClick={handleSendMessage}
              disabled={loading || !input.trim()}
              className={`p-4 rounded-2xl transition-all duration-300 transform ${
                loading || !input.trim()
                  ? 'bg-slate-600 cursor-not-allowed text-slate-400'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
              }`}
            >
              <FaPaperPlane className={`text-white text-lg ${loading ? 'animate-spin' : 'group-hover:translate-x-1 transition-transform'}`} />
            </button>
          </div>
          
          {/* Enhanced Tips */}
          <div className="mt-4 text-center text-xs text-slate-500 space-y-1">
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-8 text-slate-400 text-xs sm:text-sm">
              <span className="flex items-center space-x-2 bg-slate-800/50 px-3 py-1 rounded-full">
                <FaLightbulb className="text-yellow-400 text-sm" />
                <span>Be specific with your questions</span>
              </span>
              <span className="flex items-center space-x-2 bg-slate-800/50 px-3 py-1 rounded-full">
                <FaCode className="text-blue-400 text-sm" />
                <span>Ask about technologies you're learning</span>
              </span>
            </div>
            <p className="text-xs text-slate-500">💡 Pro tip: The more context you provide, the better my answers will be!</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Bot