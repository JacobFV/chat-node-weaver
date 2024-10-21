import React from 'react';
import { MessageCircle, Plus } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
}

interface ChatNodeProps {
  message: Message;
  onSpawnChild: () => void;
  isSelected: boolean;
}

const ChatNode: React.FC<ChatNodeProps> = ({ message, onSpawnChild, isSelected }) => {
  return (
    <Card className={`w-64 ${message.sender === 'user' ? 'bg-blue-50' : 'bg-green-50'} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      <CardHeader className="flex flex-row items-center space-x-2 p-4">
        <MessageCircle className={`h-6 w-6 ${message.sender === 'user' ? 'text-blue-500' : 'text-green-500'}`} />
        <span className="font-semibold">{message.sender === 'user' ? 'You' : 'AI'}</span>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {message.content}
      </CardContent>
      <CardFooter>
        <Button onClick={onSpawnChild} variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" /> Spawn Child
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChatNode;