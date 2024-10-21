import React from 'react';
import { Message } from '../types/Message';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, CornerDownRight, Edit3 } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface ChatViewProps {
  messages: Message[];
  onReply: (parentId: string, content: string) => void;
  onAddNote: (id: string, note: string) => void;
}

const ChatView: React.FC<ChatViewProps> = ({ messages, onReply, onAddNote }) => {
  const [replyingTo, setReplyingTo] = React.useState<string | null>(null);
  const [replyContent, setReplyContent] = React.useState('');
  const [editingNote, setEditingNote] = React.useState<string | null>(null);
  const [noteContent, setNoteContent] = React.useState('');

  const handleReply = (parentId: string) => {
    if (replyContent.trim()) {
      onReply(parentId, replyContent);
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  const handleAddNote = (id: string) => {
    if (noteContent.trim()) {
      onAddNote(id, noteContent);
      setNoteContent('');
      setEditingNote(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <Card key={message.id} className={`${message.sender === 'user' ? 'bg-blue-50' : 'bg-green-50'}`}>
          <CardContent className="p-3">
            <div className="flex items-center space-x-2 mb-2">
              <MessageCircle className={`h-4 w-4 ${message.sender === 'user' ? 'text-blue-500' : 'text-green-500'}`} />
              <span className="text-sm font-semibold">{message.sender === 'user' ? 'You' : 'AI'}</span>
            </div>
            <p className="text-sm mb-2">{message.content}</p>
            {message.marginalNotes && (
              <div className="bg-yellow-100 p-2 rounded mt-2 mb-2">
                <p className="text-xs italic">{message.marginalNotes}</p>
              </div>
            )}
            {editingNote === message.id ? (
              <div className="mt-2">
                <Input
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Add a marginal note..."
                  className="mb-2"
                />
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingNote(null)}>Cancel</Button>
                  <Button size="sm" onClick={() => handleAddNote(message.id)}>Add Note</Button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" onClick={() => setReplyingTo(message.id)}>
                  <CornerDownRight className="mr-2 h-4 w-4" /> Reply
                </Button>
                <Button variant="ghost" size="sm" onClick={() => {
                  setEditingNote(message.id);
                  setNoteContent(message.marginalNotes || '');
                }}>
                  <Edit3 className="mr-2 h-4 w-4" /> Add Note
                </Button>
              </div>
            )}
            {replyingTo === message.id && (
              <div className="mt-2">
                <textarea
                  className="w-full p-2 border rounded"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Type your reply..."
                />
                <div className="mt-2 flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setReplyingTo(null)}>Cancel</Button>
                  <Button size="sm" onClick={() => handleReply(message.id)}>Send Reply</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ChatView;