import React from 'react';
import { useDrag } from 'react-dnd';

const DragItem = ({ id, children }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CARD',
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      className='w-auto'
      ref={drag}
      style={{
        opacity: isDragging ? 0.7 : 1,
        transition: 'opacity 0.2s ease-in-out',
      }}
    >
      {children}
    </div>
  );
};

export default DragItem;
