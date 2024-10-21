import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
}

interface ChatNodeProps {
  message: Message;
}

const ChatNode: React.FC<ChatNodeProps> = ({ message }) => {
  return (
    <Card className={`${message.sender === 'user' ? 'bg-blue-50' : 'bg-green-50'}`}>
      <CardHeader className="flex flex-row items-center space-x-2 p-4">
        <MessageCircle className={`h-6 w-6 ${message.sender === 'user' ? 'text-blue-500' : 'text-green-500'}`} />
        <span className="font-semibold">{message.sender === 'user' ? 'You' : 'AI'}</span>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {message.content}
      </CardContent>
    </Card>
  );
};

export default ChatNode;