import React, { useState, DragEvent, MouseEvent, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  MiniMap,
  addEdge,
  removeElements,
  Controls,
  OnLoadParams,
  Elements,
  Connection,
  FlowElement,
  Edge,
  ElementId,
  Node,
} from 'react-flow-renderer';

import NodeList from './NodeList';
import UpdateNode from './UpdateNode';

import './dnd.css';

const initNode = { id: '', type: '', data: { label: '' }, position: { x: 0, y: 0 } }
const initX = 250
const initY = 100

const initialElements = [
  { id: 'dndnode_1', type: 'input', data: { label: 'start' }, position: { x: initX, y: initY } },
  { id: 'dndnode_2', type: 'output', data: { label: 'end' }, position: { x: initX, y: initY * 2 } },
  { id: 'edndnode_1-dndnode_2', source: 'dndnode_1', target: 'dndnode_2' },
];

const onDragOver = (event: DragEvent) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
};

let id = 3;
const getId = (): ElementId => `dndnode_${id++}`;


const DnDFlow = () => {
  const [showUpdate, setShowUpdate] = useState<Boolean>(false);
  const [selectedNodeData, setSelectedNodeData] = useState<FlowElement>(initNode);
  const [reactFlowInstance, setReactFlowInstance] = useState<OnLoadParams>();
  const [elements, setElements] = useState<Elements>(initialElements);

  const onConnect = (params: Connection | Edge) => setElements((els) => addEdge(params, els));
  const onElementsRemove = (elementsToRemove: Elements) => setElements((els) => removeElements(elementsToRemove, els));
  const onLoad = (_reactFlowInstance: OnLoadParams) => setReactFlowInstance(_reactFlowInstance);

  // click
  const onElementClick = (_: MouseEvent, element: FlowElement) => {
    setShowUpdate(true)
    setSelectedNodeData(element);
  };

  const onPaneClick = () => {
    setShowUpdate(false)
  }

  // drop
  const onDrop = (event: DragEvent) => {
    event.preventDefault();

    if (reactFlowInstance) {
      const type = event.dataTransfer.getData('application/reactflow');
      const name = event.dataTransfer.getData('application/nodeName');
      const dragY = event.clientY
      const position = reactFlowInstance.project({ x: initX, y: dragY });
      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node : ${name}` },
      };

      let nodeList: any[] = []
      let edgeList: any[] = []
      elements.forEach(item => {
        if (item && item.type) {
          nodeList.push(item)
        }
      })

      // 默认为1，在start后面
      let flag: number = 1
      // 最后一个元素不比较
      for (let i = 0; i < nodeList.length - 1; i++) {
        const item = nodeList[i];
        if (dragY > item.position.y) {
          flag = i + 1
        }
      }
      nodeList.splice(flag, 0, newNode)

      // 调整位置
      nodeList.forEach((item, index) => {
        item.position = reactFlowInstance.project({ x: initX, y: 100 * (index + 1) });
      })

      // 重置 edge，连接 node
      for (let i = 0; i < nodeList.length - 1; i++) {
        let sourceId = nodeList[i].id
        let targetId = nodeList[i + 1].id
        edgeList.push({
          source: sourceId,
          target: targetId,
          id: `e${sourceId}-${targetId}`
        })
      }

      // 新增 node
      setElements(nodeList.concat(edgeList));
    }
  };

  useEffect(() => {
    setElements((els) => {
      return els.map((el) => {
        if (el.id === selectedNodeData.id) {
          el = selectedNodeData
        }

        return el;
      })
    });
  }, [selectedNodeData]);

  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <NodeList />
        <div className="reactflow-wrapper">
          <ReactFlow
            elements={elements}
            onConnect={onConnect}
            nodesDraggable={false}
            onElementsRemove={onElementsRemove}
            onElementClick={onElementClick}
            onLoad={onLoad}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onPaneClick={onPaneClick}
          >
            <MiniMap />
            <Controls />
          </ReactFlow>
        </div>
        <UpdateNode selectedNode={selectedNodeData} updateNode={setSelectedNodeData} show={showUpdate} />
      </ReactFlowProvider>
    </div>
  );
};

export default DnDFlow;
