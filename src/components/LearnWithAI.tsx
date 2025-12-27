import { useState } from "react";
import { cn } from "@/lib/utils";
import { Bot, Send, Lightbulb, BookOpen, Code2, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const suggestedPrompts = [
  "Explain the optimal approach for this problem",
  "What data structure should I use?",
  "Give me a hint without revealing the solution",
  "Explain the time complexity analysis",
  "What are common mistakes to avoid?",
];

export function LearnWithAI({ problemTitle }: { problemTitle: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Hi! I'm your AI tutor. I can help you understand **${problemTitle}** better. Ask me anything about the problem, algorithms, or data structures involved. I'll guide you without giving away the full solution! 🧠`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (content: string) => {
    if (!content.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const aiResponses: Record<string, string> = {
      "Explain the optimal approach for this problem": `For this problem, the optimal approach uses a **Hash Map** to achieve O(n) time complexity.\n\nThe key insight is:\n1. As you iterate through the array, store each number and its index\n2. For each number, check if (target - current) exists in the map\n3. If found, you've got your answer!\n\nThis is much better than the O(n²) brute force approach.`,
      "What data structure should I use?": `For this problem, a **Hash Map (Dictionary)** is ideal!\n\n**Why?**\n- O(1) lookup time for checking if a complement exists\n- O(1) insertion time for adding new elements\n- Perfect for "find pair that sums to X" problems\n\nAlternatives like sorted array + two pointers work too, but require O(n log n) sorting first.`,
      "Give me a hint without revealing the solution": `Here's a progressive hint:\n\n🔹 **Hint 1:** Think about what you're looking for as you scan each number\n\n🔹 **Hint 2:** For each number X, what other number would you need to find?\n\n🔹 **Hint 3:** How can you quickly check if that number exists?\n\nTry working through Example 1 by hand!`,
    };
    
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: aiResponses[content] || `Great question! Let me help you think through this...\n\nWhen approaching "${content}", consider:\n\n1. **Understand the problem constraints** - What are the input sizes? What edge cases exist?\n\n2. **Start simple** - Can you solve it with a brute force approach first?\n\n3. **Optimize** - What patterns do you see that could reduce complexity?\n\nWould you like me to elaborate on any of these points?`,
    };
    
    setMessages((prev) => [...prev, aiMessage]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4 scrollbar-thin">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3 animate-fade-in",
              message.role === "user" && "flex-row-reverse"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                message.role === "assistant"
                  ? "bg-primary/10 text-primary"
                  : "bg-secondary"
              )}
            >
              {message.role === "assistant" ? (
                <Bot className="h-4 w-4" />
              ) : (
                <Code2 className="h-4 w-4" />
              )}
            </div>
            <div
              className={cn(
                "max-w-[80%] p-3 rounded-xl text-sm whitespace-pre-wrap",
                message.role === "assistant"
                  ? "bg-card border border-border"
                  : "bg-primary text-primary-foreground"
              )}
            >
              {message.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Bot className="h-4 w-4" />
            </div>
            <div className="p-3 rounded-xl bg-card border border-border">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}
      </div>
      
      {/* Suggested Prompts */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
            <Lightbulb className="h-4 w-4" />
            <span>Suggested questions</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleSend(prompt)}
                className="px-3 py-1.5 rounded-full text-xs bg-secondary hover:bg-accent transition-colors border border-border"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
            placeholder="Ask about the problem..."
            className={cn(
              "flex-1 px-4 py-2.5 rounded-lg text-sm",
              "bg-secondary border border-border",
              "placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary/50"
            )}
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isLoading}
            className={cn(
              "p-2.5 rounded-lg transition-colors",
              "bg-primary text-primary-foreground",
              "hover:bg-primary/90",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
