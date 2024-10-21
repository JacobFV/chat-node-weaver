import React, { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import ChatNode from './ChatNode';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
}

const NodeEditor: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { toast } = useToast();

  const addMessage = () => {
    if (newMessage.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        content: newMessage,
        sender: 'user',
      };
      setMessages([...messages, userMessage]);
      setNewMessage('');

      // Simulate AI response
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `AI response to: "${newMessage}"`,
          sender: 'ai',
        };
        setMessages(prevMessages => [...prevMessages, aiMessage]);
        toast({
          title: "New message received",
          description: "The AI has responded to your message.",
        });
      }, 1000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="space-y-4 mb-6">
        {messages.map((message) => (
          <ChatNode key={message.id} message={message} />
        ))}
      </div>
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addMessage()}
          className="flex-grow"
        />
        <Button onClick={addMessage}>
          <Send className="mr-2 h-4 w-4" /> Send
        </Button>
      </div>
    </div>
  );
};

export default NodeEditor;