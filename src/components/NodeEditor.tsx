import React, { useState } from 'react';
import { DndProvider, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Send, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import ChatPane from './ChatPane';
import ChatView from './ChatView';
import { Message } from '../types/Message';
import { Switch } from "@/components/ui/switch";

interface ChatPaneState extends Message {
  position: { x: number; y: number };
  isMinimized: boolean;
}

const NodeEditor: React.FC = () => {
  const [chatPanes, setChatPanes] = useState<ChatPaneState[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { toast } = useToast();
  const [isNodeView, setIsNodeView] = useState(true);

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
      <div className="flex flex-col h-screen bg-gray-100">
        <div className="flex justify-end p-4 bg-white">
          <div className="flex items-center space-x-2">
            <span>{isNodeView ? 'Node View' : 'Chat View'}</span>
            <Switch
              checked={isNodeView}
              onCheckedChange={setIsNodeView}
            />
          </div>
        </div>
        {isNodeView ? (
          <div className="flex-1 relative overflow-hidden p-4">
            {chatPanes.map((pane) => (
              <DraggableChatPane key={pane.id} pane={pane} />
            ))}
          </div>
        ) : (
          <ChatView messages={chatPanes} onReply={(parentId, content) => {
            const newMessage: ChatPaneState = {
              id: Date.now().toString(),
              content,
              sender: 'user',
              position: { x: 0, y: 0 },
              isMinimized: false,
            };
            setChatPanes(prevPanes => [...prevPanes, newMessage]);
            setTimeout(() => {
              const aiMessage: ChatPaneState = {
                id: (Date.now() + 1).toString(),
                content: `AI response to: "${content}"`,
                sender: 'ai',
                position: { x: 0, y: 0 },
                isMinimized: false,
              };
              setChatPanes(prevPanes => [...prevPanes, aiMessage]);
              toast({
                title: "New message received",
                description: "The AI has responded to your message.",
              });
            }, 1000);
          }} />
        )}
        <div className="p-4 bg-white">
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
