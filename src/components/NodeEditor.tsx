import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import DraggableNode from './DraggableNode';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  position: { x: number; y: number };
  parentId: string | null;
  childIds: string[];
}

const NodeEditor: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const { toast } = useToast();

  const addMessage = (parentId: string | null = null) => {
    if (newMessage.trim() || parentId) {
      const userMessage: Message = {
        id: Date.now().toString(),
        content: newMessage || 'New node',
        sender: 'user',
        position: { x: Math.random() * 500, y: Math.random() * 500 },
        parentId,
        childIds: [],
      };
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages, userMessage];
        if (parentId) {
          return updatedMessages.map(msg =>
            msg.id === parentId
              ? { ...msg, childIds: [...msg.childIds, userMessage.id] }
              : msg
          );
        }
        return updatedMessages;
      });
      setNewMessage('');

      // Simulate AI response
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `AI response to: "${userMessage.content}"`,
          sender: 'ai',
          position: { x: userMessage.position.x + 50, y: userMessage.position.y + 50 },
          parentId: userMessage.id,
          childIds: [],
        };
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages, aiMessage];
          return updatedMessages.map(msg =>
            msg.id === userMessage.id
              ? { ...msg, childIds: [...msg.childIds, aiMessage.id] }
              : msg
          );
        });
        toast({
          title: "New message received",
          description: "The AI has responded to your message.",
        });
      }, 1000);
    }
  };

  const updateNodePosition = (id: string, position: { x: number; y: number }) => {
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === id ? { ...msg, position } : msg
      )
    );
  };

  const handleNodeSelect = (id: string) => {
    setSelectedNodeId(id);
  };

  const getPathToNode = (nodeId: string): Message[] => {
    const path: Message[] = [];
    let currentId: string | null = nodeId;

    while (currentId) {
      const currentNode = messages.find(msg => msg.id === currentId);
      if (currentNode) {
        path.unshift(currentNode);
        currentId = currentNode.parentId;
      } else {
        break;
      }
    }

    return path;
  };

  const selectedPath = selectedNodeId ? getPathToNode(selectedNodeId) : [];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-gray-100">
        <div className="w-1/4 bg-white p-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Chat Path</h2>
          {selectedPath.map((message) => (
            <div key={message.id} className="mb-2 p-2 bg-gray-100 rounded">
              <span className="font-semibold">{message.sender === 'user' ? 'You' : 'AI'}:</span> {message.content}
            </div>
          ))}
        </div>
        <div className="flex-1 relative overflow-hidden">
          {messages.map((message) => (
            <DraggableNode
              key={message.id}
              message={message}
              updatePosition={updateNodePosition}
              onSpawnChild={() => addMessage(message.id)}
              onSelect={handleNodeSelect}
              isSelected={message.id === selectedNodeId}
            />
          ))}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white">
            <div className="flex space-x-2 max-w-4xl mx-auto">
              <Input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addMessage()}
                className="flex-grow"
              />
              <Button onClick={() => addMessage()}>
                <Send className="mr-2 h-4 w-4" /> Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default NodeEditor;
