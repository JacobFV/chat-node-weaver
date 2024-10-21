import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Message } from '../types/Message';

interface ChatNodeProps {
  message: Message;
  isSelected: boolean;
}

const ChatNode: React.FC<ChatNodeProps> = ({ message, isSelected }) => {
  return (
    <Card className={`mb-4 ${message.sender === 'user' ? 'bg-blue-50' : 'bg-green-50'} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      <CardContent className="p-3">
        <div className="flex items-center space-x-2 mb-2">
          <MessageCircle className={`h-4 w-4 ${message.sender === 'user' ? 'text-blue-500' : 'text-green-500'}`} />
          <span className="text-sm font-semibold">{message.sender === 'user' ? 'You' : 'AI'}</span>
        </div>
        <p className="text-sm">{message.content}</p>
      </CardContent>
    </Card>
  );
};

export default ChatNode;