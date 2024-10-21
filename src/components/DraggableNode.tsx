import React from 'react';
import { useDrag } from 'react-dnd';
import ChatNode from './ChatNode';

interface DraggableNodeProps {
  message: {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    position: { x: number; y: number };
  };
  updatePosition: (id: string, position: { x: number; y: number }) => void;
  onSpawnChild: () => void;
}

const DraggableNode: React.FC<DraggableNodeProps> = ({ message, updatePosition, onSpawnChild }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'node',
    item: { id: message.id, ...message.position },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        updatePosition(message.id, { x: item.x, y: item.y });
      }
    },
  });

  return (
    <div
      ref={drag}
      style={{
        position: 'absolute',
        left: message.position.x,
        top: message.position.y,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
    >
      <ChatNode message={message} onSpawnChild={onSpawnChild} />
    </div>
  );
};

export default DraggableNode;