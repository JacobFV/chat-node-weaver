import React, { useState } from 'react';
import { DndProvider, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import ChatPane from './ChatPane';
import { Message } from '../types/Message';

interface ChatPaneState extends Message {
  position: { x: number; y: number };
  isMinimized: boolean;
}

const NodeEditor: React.FC = () => {
  const [chatPanes, setChatPanes] = useState<ChatPaneState[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { toast } = useToast();

  const addMessage = () => {
    if (newMessage.trim()) {
      const newPane: ChatPaneState = {
        id: Date.now().toString(),
        content: newMessage,
        sender: 'user',
        position: { x: Math.random() * 500, y: Math.random() * 500 },
        isMinimized: false,
      };
      setChatPanes([...chatPanes, newPane]);
      setNewMessage('');

      // Simulate AI response
      setTimeout(() => {
        const aiPane: ChatPaneState = {
          id: (Date.now() + 1).toString(),
          content: `AI response to: "${newMessage}"`,
          sender: 'ai',
          position: { x: newPane.position.x + 50, y: newPane.position.y + 50 },
          isMinimized: false,
        };
        setChatPanes(prevPanes => [...prevPanes, aiPane]);
        toast({
          title: "New message received",
          description: "The AI has responded to your message.",
        });
      }, 1000);
    }
  };

  const updatePanePosition = (id: string, position: { x: number; y: number }) => {
    setChatPanes(prevPanes =>
      prevPanes.map(pane =>
        pane.id === id ? { ...pane, position } : pane
      )
    );
  };

  const closePane = (id: string) => {
    setChatPanes(prevPanes => prevPanes.filter(pane => pane.id !== id));
  };

  const toggleMinimize = (id: string) => {
    setChatPanes(prevPanes =>
      prevPanes.map(pane =>
        pane.id === id ? { ...pane, isMinimized: !pane.isMinimized } : pane
      )
    );
  };

  const DraggableChatPane: React.FC<{ pane: ChatPaneState }> = ({ pane }) => {
    const [{ isDragging }, drag] = useDrag({
      type: 'chatPane',
      item: { id: pane.id, ...pane.position },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    });

    return (
      <div
        ref={drag}
        style={{
          position: 'absolute',
          left: pane.position.x,
          top: pane.position.y,
          opacity: isDragging ? 0.5 : 1,
          cursor: 'move',
        }}
      >
        <ChatPane
          messages={[pane]}
          onClose={() => closePane(pane.id)}
          onMinimize={() => toggleMinimize(pane.id)}
          onMaximize={() => toggleMinimize(pane.id)}
          isMinimized={pane.isMinimized}
        />
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-gray-100">
        <div className="flex-1 relative overflow-hidden p-4">
          {chatPanes.map((pane) => (
            <DraggableChatPane key={pane.id} pane={pane} />
          ))}
        </div>
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
            <Button onClick={addMessage}>
              <Send className="mr-2 h-4 w-4" /> Send
            </Button>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default NodeEditor;