import React, { DragEvent } from 'react';

const onDragStart = (event: DragEvent, nodeType: string, name: string) => {
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.setData('application/nodeName', name);
  event.dataTransfer.effectAllowed = 'move';
};

const Sidebar = () => {
  return (
    <aside className="react-flow__aside">
      <div className="description">拖拽组件</div>
      {/* <div className="react-flow__node-input" onDragStart={(event: DragEvent) => onDragStart(event, 'input')} draggable>
        Input Node
      </div> */}
      <div className="react-flow__node-default" onDragStart={(event: DragEvent) => onDragStart(event, 'default', 'aaa')} draggable>
        aaa
      </div>
      <div className="react-flow__node-default" onDragStart={(event: DragEvent) => onDragStart(event, 'default', 'bbb')} draggable>
        bbb
      </div>
      <div className="react-flow__node-default" onDragStart={(event: DragEvent) => onDragStart(event, 'default', 'ccc')} draggable>
        ccc
      </div>
      {/* <div className="react-flow__node-output" onDragStart={(event: DragEvent) => onDragStart(event, 'output')} draggable>
        Output Node
      </div> */}
    </aside>
  );
};

export default Sidebar;
