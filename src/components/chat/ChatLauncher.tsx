'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, RotateCcw, ChevronDown } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  id: string
}

const STARTER_QUESTIONS = [
  'Which product should I use for kitchen grease?',
  'How do I use laundry beads?',
  'What\'s the difference between pods and beads?',
  'What floor types can I use the floor cleaner on?',
  'How do I clean my shoes safely?',
]

export function ChatLauncher() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: 'Hi! I\'m the GrimeGuru AI assistant. I can help you find the right cleaning product, explain how to use them, or answer questions about our range. What can I help you with today?',
        },
      ])
    }
  }, [isOpen, messages.length])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  async function sendMessage(text: string) {
    if (!text.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(({ role, content }) => ({
            role,
            content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + '-reply',
          role: 'assistant',
          content: data.message || 'Sorry, I couldn\'t process that. Please try again.',
        },
      ])
    } catch {
      setError('Something went wrong. Please try again or contact us for help.')
    } finally {
      setIsLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    sendMessage(input)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  function resetChat() {
    setMessages([])
    setError(null)
    setInput('')
  }

  return (
    <>
      {/* Launcher button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 8 }}
              className="bg-white rounded-2xl shadow-lg border border-[#E6F5F8] px-3 py-2 text-xs font-medium text-[#24333A] max-w-[140px] text-center"
            >
              Ask GrimeGuru AI 🧹
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center relative"
          style={{ backgroundColor: '#24333A' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isOpen ? 'Close AI assistant' : 'Open AI assistant'}
          aria-expanded={isOpen}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X className="h-6 w-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <MessageCircle className="h-6 w-6 text-[#9FD8E8]" />
              </motion.div>
            )}
          </AnimatePresence>
          {/* Pulse ring */}
          {!isOpen && (
            <span className="absolute inset-0 rounded-full ring-2 ring-[#9FD8E8] animate-ping opacity-30" />
          )}
        </motion.button>
      </div>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-40 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-[#E6F5F8] flex flex-col overflow-hidden"
            style={{ maxHeight: '520px' }}
            role="dialog"
            aria-modal="false"
            aria-label="GrimeGuru AI assistant"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b border-[#E6F5F8]"
              style={{ backgroundColor: '#24333A' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#9FD8E8] flex items-center justify-center">
                  <span className="text-[#24333A] text-sm font-bold">G</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Ask GrimeGuru</p>
                  <p className="text-xs text-[#9FD8E8]">AI-powered cleaning guide</p>
                </div>
              </div>
              <button
                onClick={resetChat}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Reset conversation"
              >
                <RotateCcw className="h-4 w-4 text-[#9FD8E8]" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-3" style={{ minHeight: 0 }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#24333A] text-white rounded-br-sm'
                        : 'bg-[#E6F5F8] text-[#24333A] rounded-bl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#E6F5F8] rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full bg-[#9FD8E8] animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2">
                  {error}
                  <button className="ml-2 underline" onClick={() => setError(null)}>
                    Dismiss
                  </button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Starter questions (shown if only welcome message) */}
            {messages.length === 1 && (
              <div className="px-3 pb-1 flex flex-col gap-1">
                <p className="text-xs text-[#75828A] px-1 mb-1">Quick questions:</p>
                {STARTER_QUESTIONS.slice(0, 3).map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-left text-xs px-3 py-2 rounded-xl bg-[#E6F5F8] text-[#24333A] hover:bg-[#9FD8E8]/30 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-[#E6F5F8] flex gap-2">
              <label htmlFor="chat-input" className="sr-only">
                Ask a question about our products
              </label>
              <textarea
                id="chat-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about any product..."
                rows={1}
                className="flex-1 resize-none rounded-xl px-3 py-2.5 text-sm border border-[#D6E8ED] bg-[#FAF8F2] text-[#24333A] placeholder:text-[#75828A] focus:outline-none focus:ring-2 focus:ring-[#9FD8E8] transition-shadow"
                style={{ minHeight: '40px', maxHeight: '100px' }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-40 transition-colors"
                style={{ backgroundColor: '#24333A', color: 'white' }}
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
