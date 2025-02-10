import React from 'react';
import { useDrop } from 'react-dnd';

const DropContainer = ({ onDrop, children }) => {
  const [, drop] = useDrop(() => ({
    accept: 'CARD',
    drop: (item) => {
      onDrop(item.id);
    },
  }));

  return (
    <div ref={drop} className=' gap-8 w-auto'>
      {children}
    </div>
  );
};

export default DropContainer;
