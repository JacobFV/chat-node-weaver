import React, { useState } from 'react';
import { X, Minimize2, Maximize2 } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Message } from '../types/Message';
import ChatNode from './ChatNode';

interface ChatPaneProps {
  messages: Message[];
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  isMinimized: boolean;
}

const ChatPane: React.FC<ChatPaneProps> = ({ messages, onClose, onMinimize, onMaximize, isMinimized }) => {
  return (
    <Card className={`w-80 ${isMinimized ? 'h-12' : 'h-96'} shadow-lg transition-all duration-300 ease-in-out`}>
      <div className="flex justify-between items-center p-2 bg-gray-100">
        <span className="font-semibold">Chat</span>
        <div className="flex space-x-2">
          {isMinimized ? (
            <Button variant="ghost" size="sm" onClick={onMaximize}><Maximize2 className="h-4 w-4" /></Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={onMinimize}><Minimize2 className="h-4 w-4" /></Button>
          )}
          <Button variant="ghost" size="sm" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
      </div>
      {!isMinimized && (
        <CardContent className="p-4 overflow-y-auto h-[calc(100%-3rem)]">
          {messages.map((message) => (
            <ChatNode key={message.id} message={message} onSpawnChild={() => {}} isSelected={false} />
          ))}
        </CardContent>
      )}
    </Card>
  );
};

export default ChatPane;