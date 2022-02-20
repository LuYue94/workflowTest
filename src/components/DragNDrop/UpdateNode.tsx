import React from 'react';
import { useStoreState } from 'react-flow-renderer';
import ReactFlow, {
  FlowElement,
} from 'react-flow-renderer';
interface PropsType {
  selectedNode: FlowElement
  updateNode: Function
  show: Boolean
}

const UpdateNode = (props: PropsType) => {
  const { selectedNode, updateNode, show } = props

  const nodes = useStoreState((store) => store.nodes);
  const transform = useStoreState((store) => store.transform);

  return (
    <div className="updatenode__controls">
      <div>Zoom & pan transform</div>
      <div className="transform">
        {/* 画布的x,y,zoom */}
        [{transform[0].toFixed(2)}, {transform[1].toFixed(2)}, {transform[2].toFixed(2)}]
      </div>
      <div>Nodes</div>
      {nodes.map((node) => (
        <div key={node.id}>
          Node {node.id} - x: {node.__rf.position.x.toFixed(2)}, y: {node.__rf.position.y.toFixed(2)}
        </div>
      ))}

      <br />
      单击组件可以编辑
      <br />
      {
        show ?
          (
            <>
              <label>label:</label>
              <input
                value={selectedNode.data.label}
                onChange={(evt) => {
                  updateNode({
                    ...selectedNode,
                    data: {
                      ...selectedNode.data,
                      label: evt.target.value
                    }
                  })
                }} />
            </>
          ) : null
      }

    </div>
  );
};

export default UpdateNode;
