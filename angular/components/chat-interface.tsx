"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Mic, Upload, AlertCircle, FileText, PlusCircle, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"

type Message = {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  attachments?: string[]
  suggestions?: string[]
}

// Helper function to format AI message content with proper styling
const formatMessageContent = (content: string) => {
  // Replace ** with <strong> tags for bold text 
  let formattedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Convert bullet points for better display
  formattedContent = formattedContent.replace(/^(\s*)(•|\*)\s(.+)$/gm, '$1<span class="bullet-point">•</span> $3');
  
  // Add paragraph spacing
  formattedContent = formattedContent.replace(/\n\n/g, '<br/><br/>');
  
  return formattedContent;
}

const formatNonMedicalResponse = () => {
  return "I'm a medical assistant designed to help with health-related questions only. For information about political figures or general knowledge questions, I'd recommend checking a news website, encyclopedia, or a general search engine.\n\nIs there a health concern or medical question I can help you with today?";
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI health assistant. I'm here to help with your medical questions and concerns.\n\n**How I can assist you**:\n\n• Answer health-related questions\n• Provide information about symptoms\n• Suggest treatment options\n• Explain medical terminology\n\nI can offer various treatment approaches:\n• Ayurvedic remedies\n• Home remedies\n• Modern medicine options\n\nSimply let me know your preference when discussing treatments.\n\nPlease note that I'm not a replacement for professional medical advice. For serious concerns, always consult a healthcare provider.\n\nHow can I help you today?",
      sender: "ai",
      timestamp: new Date(),
      suggestions: ["Check symptoms", "Treatment options", "Medical advice", "Find specialist"],
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate AI typing
    setIsTyping(true)

    // Simulate AI response after delay
    setTimeout(() => {
      let aiResponseContent = "";
      let aiSuggestions = ["More information", "Prevention tips", "When to see doctor"];
      
      // Generate different responses based on input keywords
      const inputLower = input.toLowerCase();
      const userName = inputLower.includes("my name is") ? 
        input.substring(input.toLowerCase().indexOf("my name is") + 11).split(" ")[0] : "";
      
      // For non-medical queries
      if (inputLower.includes("prime minister") || 
          inputLower.includes("president") || 
          inputLower.includes("who is") ||
          inputLower.includes("capital of") ||
          inputLower.includes("weather")) {
        
        aiResponseContent = formatNonMedicalResponse();
        aiSuggestions = ["Health symptoms", "Medical advice", "Find a doctor"];
      }
      // For headache
      else if (inputLower.includes("headache")) {
        const greeting = userName ? `${userName}, I` : "I";
        
        aiResponseContent = 
          `${greeting} understand you're experiencing headaches. This is quite common but can have many causes.\n\n` +
          "**Possible Causes**\n\n" +
          "1. Tension headache: Usually caused by stress or muscle tension\n" +
          "2. Migraine: Often accompanied by nausea and light sensitivity\n" +
          "3. Cluster headache: Intense pain around one eye\n\n" +
          "I can suggest different treatment approaches. Would you prefer ayurvedic remedies, home remedies, or modern medicine options?\n\n" +
          "**Ayurvedic Remedies**\n" +
          "• Ginger tea with tulsi (holy basil)\n" +
          "• Applying diluted peppermint oil to temples\n" +
          "• Triphala herb supplements\n\n" +
          "**Home Remedies**\n" +
          "• Cold or warm compress on forehead\n" +
          "• Stay hydrated and rest in a dark, quiet room\n" +
          "• Gentle scalp massage with essential oils\n\n" +
          "**Modern Medicine Options**\n" +
          "• Over-the-counter pain relievers like acetaminophen\n" +
          "• NSAIDs such as ibuprofen or aspirin\n" +
          "• Prescription medications for recurring headaches\n\n" +
          "Which approach would you like to try? Also, could you tell me more about your headache symptoms?";
          
        aiSuggestions = ["Ayurvedic remedies", "Home remedies", "Modern medicine"];
      } 
      // For cold/flu
      else if (inputLower.includes("cold") || inputLower.includes("flu") || inputLower.includes("fever")) {
        const greeting = userName ? `${userName}, I` : "I";
        
        aiResponseContent = 
          `${greeting} see you're dealing with cold/flu symptoms. Let me help.\n\n` +
          "**Common Cold vs. Flu**\n\n" +
          "Colds typically develop gradually with milder symptoms, while flu often starts suddenly with more severe symptoms including fever and body aches.\n\n" +
          "I can recommend different treatment approaches. Which would you prefer?\n\n" +
          "**Ayurvedic Remedies**\n" +
          "• Tulsi (holy basil) and ginger tea with honey\n" +
          "• Turmeric milk with black pepper before bed\n" +
          "• Chyawanprash - an herbal jam that boosts immunity\n\n" +
          "**Home Remedies**\n" +
          "• Hot chicken soup with garlic and ginger\n" +
          "• Honey and lemon in warm water\n" +
          "• Steam inhalation with eucalyptus oil\n\n" +
          "**Modern Medicine Options**\n" +
          "• Antipyretics like acetaminophen for fever\n" +
          "• Over-the-counter decongestants\n" +
          "• Cough suppressants for persistent cough\n\n" +
          "**When to See a Doctor**\n\n" +
          "Seek medical attention if you experience:\n" +
          "• Persistent high fever (above 101.3°F or 38.5°C)\n" +
          "• Difficulty breathing\n" +
          "• Symptoms lasting more than 10 days\n\n" +
          "Which treatment approach would you like to explore further? And how long have you been experiencing symptoms?";
          
        aiSuggestions = ["Ayurvedic remedies", "Home remedies", "Modern medicine"];
      }
      // For sleep issues
      else if (inputLower.includes("sleep") || inputLower.includes("insomnia") || inputLower.includes("can't sleep")) {
        const greeting = userName ? `${userName}, I` : "I";
        
        aiResponseContent = 
          `${greeting} understand you're having sleep difficulties. This is a common issue that can significantly impact your quality of life.\n\n` +
          "Before suggesting solutions, I'd like to understand your situation better:\n" +
          "• How long have you been experiencing sleep problems?\n" +
          "• Do you have trouble falling asleep, staying asleep, or both?\n" +
          "• Have you noticed any triggers that might be affecting your sleep?\n\n" +
          "I can offer different approaches to improve sleep:\n\n" +
          "**Ayurvedic Remedies**\n" +
          "1. Ashwagandha: Helps reduce stress and promotes relaxation\n" +
          "2. Brahmi: Calms the mind and reduces anxiety\n" +
          "3. Warm milk with nutmeg: Traditional sleep aid in Ayurveda\n\n" +
          "**Home Remedies**\n" +
          "1. Establish a consistent sleep schedule\n" +
          "2. Create a relaxing bedtime routine\n" +
          "3. Chamomile or valerian root tea before bed\n" +
          "4. Limit screen time 1-2 hours before sleep\n\n" +
          "**Modern Medicine Options**\n" +
          "1. Melatonin supplements: Natural hormone that regulates sleep\n" +
          "2. Over-the-counter sleep aids (use only as directed)\n" +
          "3. Cognitive Behavioral Therapy for Insomnia (CBT-I)\n\n" +
          "Which of these approaches would you prefer to try first?";
          
        aiSuggestions = ["Ayurvedic remedies", "Home remedies", "Sleep hygiene tips"];
      }
      // Default response for other health queries
      else {
        const greeting = userName ? `${userName}, I` : "I";
        
        aiResponseContent = 
          `${greeting} understand your concern and I'm here to help. To provide the most accurate guidance, I'll need a bit more information about your situation.\n\n` +
          "Could you please share:\n\n" +
          "1. What specific symptoms are you experiencing?\n" +
          "2. How long have you been experiencing them?\n" +
          "3. Have you tried any treatments already?\n\n" +
          "I can provide recommendations using ayurvedic remedies, home remedies, or modern medicine approaches based on your preference. Which approach do you typically prefer?";
          
        aiSuggestions = ["Describe symptoms", "Treatment options", "Find specialist"];
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponseContent,
        sender: "ai",
        timestamp: new Date(),
        suggestions: aiSuggestions,
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 2000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      
      // Special case for demo purposes - if asking about prime minister, bypass the normal flow
      if (input.toLowerCase().includes("prime minister") || input.toLowerCase().includes("president")) {
        const userMessage: Message = {
          id: Date.now().toString(),
          content: input,
          sender: "user",
          timestamp: new Date(),
        }
        
        setMessages((prev) => [...prev, userMessage])
        setInput("")
        setIsTyping(true)
        
        setTimeout(() => {
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: formatNonMedicalResponse(),
            sender: "ai",
            timestamp: new Date(),
            suggestions: ["Health symptoms", "Medical advice", "Find a doctor"],
          }
          
          setMessages((prev) => [...prev, aiMessage])
          setIsTyping(false)
        }, 2000)
        
        return
      }
      
      handleSend()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    // Auto-send after a brief delay to show the selection
    setTimeout(() => {
      handleSend()
    }, 300)
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      // Simulate recording for 3 seconds
      setTimeout(() => {
        setIsRecording(false)
        setInput("I've been experiencing headaches and fatigue for the past week.")
      }, 3000)
    }
  }

  const handleUpload = () => {
    setIsUploading(true)
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false)
      const userMessage: Message = {
        id: Date.now().toString(),
        content: "I've uploaded my recent blood test results.",
        sender: "user",
        timestamp: new Date(),
        attachments: ["Blood_Test_Results.pdf"],
      }
      setMessages((prev) => [...prev, userMessage])

      // Simulate AI response to the upload
      setIsTyping(true)
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content:
            "I've analyzed your blood test results. Your hemoglobin levels are slightly below the normal range. This might explain your fatigue. I recommend discussing this with your doctor.",
          sender: "ai",
          timestamp: new Date(),
          suggestions: ["Book doctor appointment", "Learn about anemia", "Nutrition advice"],
        }
        setMessages((prev) => [...prev, aiMessage])
        setIsTyping(false)
      }, 2000)
    }, 2000)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 w-10 h-10 rounded-full flex items-center justify-center text-white mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
            </svg>
          </div>
          <div>
            <h1 className="font-semibold text-lg text-slate-800">Health Assistant</h1>
            <p className="text-xs text-slate-500">AI-powered medical guidance</p>
          </div>
        </div>
        <Button variant="destructive" size="sm" className="bg-red-500 hover:bg-red-600">
          <AlertCircle className="mr-1 h-4 w-4" />
          Emergency SOS
        </Button>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl p-4",
                  message.sender === "user"
                    ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                    : "bg-white border border-slate-200 shadow-sm",
                )}
              >
                {message.sender === "ai" && (
                  <div className="flex items-center mb-2">
                    <Avatar className="h-6 w-6 mr-2 bg-gradient-to-r from-teal-500 to-cyan-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                      </svg>
                    </Avatar>
                    <span className="text-sm font-medium text-slate-700">Health Assistant</span>
                  </div>
                )}
                <div 
                  className={cn(
                    "text-sm", 
                    message.sender === "user" ? "text-white" : "text-slate-700"
                  )}
                >
                  {message.sender === "ai" ? (
                    <div className="ai-message-content markdown-content">
                      <ReactMarkdown
                        components={{
                          h1: ({node, ...props}) => <h3 className="text-lg font-bold mt-3 mb-2" {...props} />,
                          h2: ({node, ...props}) => <h4 className="text-md font-bold mt-2 mb-1" {...props} />,
                          h3: ({node, ...props}) => <h5 className="text-sm font-bold mt-2 mb-1" {...props} />,
                          p: ({node, ...props}) => <p className="mb-2" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                          li: ({node, ...props}) => <li className="ml-2 mb-1" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-bold text-teal-700" {...props} />
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    message.content
                  )}
                </div>

                {message.attachments && (
                  <div className="mt-2">
                    {message.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center mt-1 bg-slate-100 rounded p-2 text-xs text-slate-700"
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        {attachment}
                      </div>
                    ))}
                  </div>
                )}

                {message.suggestions && message.sender === "ai" && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className={cn("text-xs mt-1", message.sender === "user" ? "text-teal-100" : "text-slate-400")}>
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm max-w-[80%]">
                <div className="flex items-center mb-2">
                  <Avatar className="h-6 w-6 mr-2 bg-gradient-to-r from-teal-500 to-cyan-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                    </svg>
                  </Avatar>
                  <span className="text-sm font-medium text-slate-700">Health Assistant</span>
                </div>
                <div className="flex space-x-1 items-center text-slate-500">
                  <div className="h-2 w-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="h-2 w-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="h-2 w-2 bg-slate-500 rounded-full animate-bounce"></div>
                  <span className="text-xs ml-2">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Health Insight Card - Appears conditionally */}
      {messages.length > 2 && (
        <div className="px-4 py-3">
          <Card className="bg-gradient-to-r from-cyan-50 to-teal-50 border-teal-100 max-w-3xl mx-auto">
            <div className="p-4">
              <div className="flex items-center mb-2">
                <div className="bg-teal-100 p-1.5 rounded-full mr-2">
                  <FileText className="h-4 w-4 text-teal-600" />
                </div>
                <h3 className="font-medium text-teal-700">AI Health Insight</h3>
                <Button variant="ghost" size="sm" className="ml-auto h-7 w-7 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-slate-700 mb-3">
                Based on your symptoms, you may be experiencing <span className="font-medium">seasonal allergies</span>.
                Common triggers include pollen, dust, and pet dander.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="bg-white text-teal-700 border-teal-200 hover:bg-teal-50">
                  Learn more
                </Button>
                <Button variant="outline" size="sm" className="bg-white text-teal-700 border-teal-200 hover:bg-teal-50">
                  Find allergist
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-slate-200 bg-white p-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your health question..."
              className="min-h-[60px] w-full rounded-lg border-slate-300 pr-24 resize-none focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
            />
            <div className="absolute right-2 bottom-2 flex space-x-1">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200"
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                ) : (
                  <Upload className="h-4 w-4 text-slate-500" />
                )}
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className={cn(
                  "h-8 w-8 rounded-full",
                  isRecording
                    ? "bg-red-100 text-red-500 animate-pulse"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-500",
                )}
                onClick={toggleRecording}
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                className="h-8 w-8 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
                onClick={handleSend}
                disabled={!input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              {isRecording && (
                <span className="text-red-500 flex items-center">
                  <span className="inline-block h-2 w-2 rounded-full bg-red-500 mr-1 animate-pulse"></span>
                  Recording...
                </span>
              )}
            </div>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-500 hover:text-slate-700">
              <PlusCircle className="mr-1 h-3 w-3" />
              New chat
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

