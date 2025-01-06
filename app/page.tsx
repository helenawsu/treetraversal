"use client"
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import Soundfont from "soundfont-player";

const measureDuration = 1000; // Default duration for a measure
const traversalMeasures = {
  inorder: [],
  preorder: [],
  postorder: [],
  levelorder: [
    { pitches: [{ note: "C3", duration: 200 }, { note: "E3", duration: 200 }, { note: "G3", duration: 200 }] },
    { pitches: [{ note: "F3", duration: 800 }] },
    { pitches: [{ note: "B3", duration: 200 }] },
  ],
};

// Helper function to build tree nodes
interface Measure {
  pitches: { note: string; duration: number }[];
}

interface TreeNode {
  measure: Measure;
  left: TreeNode | null;
  right: TreeNode | null;
}

function buildTree(levelOrder: Measure[]): TreeNode | null {
  if (!levelOrder.length) return null;

  const nodes: TreeNode[] = levelOrder.map((measure) => ({ measure, left: null, right: null }));
  for (let i = 0; i < Math.floor(nodes.length / 2); i++) {
    if (2 * i + 1 < nodes.length) nodes[i].left = nodes[2 * i + 1];
    if (2 * i + 2 < nodes.length) nodes[i].right = nodes[2 * i + 2];
  }
  return nodes[0];
}

// Recursive traversal functions
function populateInorder(node: TreeNode | null, result: Measure[]) {
  if (!node) return;
  populateInorder(node.left, result);
  result.push(node.measure);
  populateInorder(node.right, result);
}

interface TreeNode {
  measure: Measure;
  left: TreeNode | null;
  right: TreeNode | null;
}

interface Measure {
  pitches: { note: string; duration: number }[];
}

function populatePreorder(node: TreeNode | null, result: Measure[]) {
  if (!node) return;
  result.push(node.measure);
  populatePreorder(node.left, result);
  populatePreorder(node.right, result);
}

interface TreeNode {
  measure: Measure;
  left: TreeNode | null;
  right: TreeNode | null;
}

interface Measure {
  pitches: { note: string; duration: number }[];
}

function populatePostorder(node: TreeNode | null, result: Measure[]) {
  if (!node) return;
  populatePostorder(node.left, result);
  populatePostorder(node.right, result);
  result.push(node.measure);
}

// Build the tree from level order
const root = buildTree(traversalMeasures.levelorder);

// Populate traversals
populateInorder(root, traversalMeasures.inorder);
populatePreorder(root, traversalMeasures.preorder);
populatePostorder(root, traversalMeasures.postorder);

console.log("Inorder:", traversalMeasures.inorder);
console.log("Preorder:", traversalMeasures.preorder);
console.log("Postorder:", traversalMeasures.postorder);


export default function Home() {
  const [activeTraversals, setActiveTraversals] = useState({
    preorder: true,
    inorder: true,
    postorder: true,
    levelorder: true,
  });

  const treeContainerRef = useRef<HTMLDivElement>(null);

  const toggleTraversal = (order: keyof typeof activeTraversals) => {
    setActiveTraversals((prev) => ({
      ...prev,
      [order]: !prev[order],
    }));
  };

  const handlePlay = async () => {
    const audioContext = new (window.AudioContext || window.AudioContext)();

    // Load viola instrument
    const instrument = await Soundfont.instrument(audioContext, "viola");

    // Get active measures
    const activeMeasures = Object.keys(activeTraversals)
      .filter((order) => activeTraversals[order as keyof typeof activeTraversals])
      .map((order) => traversalMeasures[order as keyof typeof traversalMeasures]);

    // Play all active measures simultaneously
    playActiveMeasuresSimultaneously(activeMeasures, instrument);
  };

  const playActiveMeasuresSimultaneously = (
    activeMeasures: { pitches: { note: string; duration: number }[] }[][],
    instrument: any
  ) => {
    activeMeasures.forEach((measures) => {
      playTraversalMeasures(measures, instrument);
    });
  };

  const playTraversalMeasures = (
    measures: { pitches: { note: string; duration: number }[] }[],
    instrument: any
  ) => {
    let currentTime = instrument.context.currentTime;

    measures.forEach((measure) => {
      playMeasure(measure, instrument, currentTime);
      // Move the time forward by the measure duration
      currentTime += measure.pitches.reduce((sum, pitch) => sum + pitch.duration / 1000, 0);
    });
  };

  const playMeasure = (
    measure: { pitches: { note: string; duration: number }[] },
    instrument: any,
    startTime: number
  ) => {
    let offset = 0; // Time offset within the measure
    measure.pitches.forEach((pitch) => {
      playPitch(pitch, instrument, startTime + offset);
      offset += pitch.duration / 1000; // Increment the offset by the pitch duration
    });
  };

  const playPitch = (pitch: { note: string; duration: number }, instrument: any, startTime: number) => {
    console.log(`Playing ${pitch.note} for ${pitch.duration / 1000}s at ${startTime}s`);
    instrument.play(pitch.note, startTime, { duration: pitch.duration / 1000 });
  };
  

  useEffect(() => {
    if (!treeContainerRef.current) return;
  
    // Convert the TreeNode structure into a D3-friendly format
    function treeNodeToD3(node: TreeNode | null): { name: string; children: any[] } | null {
      if (!node) return null;
      return {
        name: node.measure.pitches
          .map((pitch) => `${pitch.note} (${pitch.duration}ms)`)
          .join(", "),
        children: [treeNodeToD3(node.left), treeNodeToD3(node.right)].filter(Boolean),
      };
    }
  
    const treeData = treeNodeToD3(root);
  
    const width = window.innerWidth;
    const height = window.innerHeight - 150;
  
    const svg = d3
      .select(treeContainerRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(50,50)");
  
    const treeLayout = d3.tree().size([width - 100, height - 100]);
  
    if (!treeData) return;
    const rootNode = d3.hierarchy<{ name: string; children: any[] }>(treeData);
    // @ts-ignore
    treeLayout(rootNode);
  
    // Render links
    svg
      .selectAll(".link")
      .data(rootNode.links())
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("x1", (d) => d.source.x ?? 0)
      .attr("y1", (d) => d.source.y ?? 0)
      .attr("x2", (d) => d.target.x ?? 0)
      .attr("y2", (d) => d.target.y ?? 0)
      .style("stroke", "#ccc")
      .style("stroke-width", 2);
  
    // Render nodes
    const nodes = svg
      .selectAll(".node")
      .data(rootNode.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.x},${d.y})`);
  
    nodes
      .append("circle")
      .attr("r", 10)
      .style("fill", "white")
      .style("stroke", "black");
  
    nodes
      .append("text")
      .attr("dy", -15)
      .attr("text-anchor", "middle")
      .text((d) => d.data.name);
  }, []);
  

return (
<div className="absolute top-0 left-0 w-full h-full bg-gray-100">
<div className="absolute top-4 left-0 w-full flex flex-col items-center gap-2">
  <h1 className="text-2xl font-bold text-black">16 Viola Pieces on Tree Traversal :P</h1>
  <div className="flex gap-4">
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={activeTraversals.preorder}
        onChange={() => toggleTraversal("preorder")}
        className="accent-red-500"
      />
      <span style={{ color: "red" }}>Preorder</span>
    </label>
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={activeTraversals.inorder}
        onChange={() => toggleTraversal("inorder")}
        className="accent-green-500"
      />
      <span style={{ color: "green" }}>Inorder</span>
    </label>
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={activeTraversals.postorder}
        onChange={() => toggleTraversal("postorder")}
        className="accent-blue-500"
      />
      <span style={{ color: "blue" }}>Postorder</span>
    </label>
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={activeTraversals.levelorder}
        onChange={() => toggleTraversal("levelorder")}
        className="accent-yellow-500"
      />
      <span style={{ color: "yellow" }}>Level Order</span>
    </label>
  </div>
  <button
    onClick={handlePlay}
    className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
  >
    Play Music
  </button>
</div>

{/* Tree Graph */}
<div ref={treeContainerRef} className="absolute top-[150px] left-0 w-full h-[calc(100%-150px)]">
  {/* D3 tree visualization is rendered here */}
</div>
</div>
);
}
