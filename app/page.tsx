"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import Soundfont from "soundfont-player";
const tempo = 60;
const multiplier = 60 / tempo * 1000;
// 1 should be quarter notes, should be 1000ms in tempo 60
const traversalMeasures = {
  inorder: [],
  preorder: [],
  postorder: [],
  levelorder: [
    {  pitches: [{ note: "C3", duration: 4 }], },
    { pitches: [{ note: "E3", duration: 2 }, { note: "G#3", duration: 2 }] },
    { pitches: [{ note: "G3", duration: 2 }, { note: "Eb3", duration: 2 }] },
    { pitches: [{ note: "F3", duration: 1 }, { note: "F#3", duration: 1 }, { note: "F3", duration: 1 }, { note: "Eb3", duration: 1 }] },
    { pitches: [{ note: "C4", duration: 1 }, { note: "C#4", duration: 1 },  { note: "C4", duration: 1},{ note: "Bb3", duration: 1}] },
    { pitches: [{ note: "Ab3", duration: 1 }, { note: "G3", duration: 1 },  { note: "Bb3", duration: 1},{ note: "Ab3", duration: 1}] },
    { pitches: [{ note: "G3", duration: 1 }, { note: "Ab3", duration: 1 },  { note: "G3", duration: 1},{ note: "F3", duration: 1}] },
    { pitches: [{ note: "C4", duration: 0.5 }, { note: "G4", duration: 0.5 },  { note: "F4", duration: 0.5},{ note: "Eb4", duration: 0.5}, 
                { note: "D4", duration: 0.5 }, { note: "Ab4", duration: 0.5},  { note: "G4", duration: 1}]},
    { pitches: [{ note: "B3", duration: 0.5 }, { note: "G3", duration: 0.5 },  { note: "Ab3", duration: 0.75},{ note: "Bb3", duration: 0.25}, 
                { note: "C4", duration: 0.5 }, { note: "C#4", duration: 0.5},  { note: "C4", duration: 0.5},{ note: "Bb3", duration: 0.5}] },
    { pitches: [{ note: "D#4", duration: 0.5 }, { note: "F#4", duration: 0.5 },  { note: "F4", duration: 0.75},{ note: "F#4", duration: 0.25}, 
                { note: "Ab4", duration: 0.5 }, { note: "F4", duration: 0.5},  { note: "Bb4", duration: 0.5},{ note: "F4", duration: 0.5}] },
    { pitches: [{ note: "D#4", duration: 0.5 }, { note: "Ab4", duration: 1 },  { note: "G4", duration: 0.5},{ note: "Ab4", duration: 0.5}, 
                { note: "Bb4", duration: 0.5 }, { note: "D#4", duration: 0.5},  { note: "D#4", duration: 0.5}] },
    { pitches: [{ note: "F3", duration: 0.5 }, { note: "A3", duration: 0.5 },  { note: "C4", duration: 0.5},{ note: "F4", duration: 0.5}, 
                { note: "Eb4", duration: 0.5 }, { note: "C4", duration: 0.5},  { note: "A#3", duration: 0.5}, { note: "A3", duration: 0.5}]  },
    { pitches: [{ note: "C5", duration: 0.5 }, { note: "Ab4", duration: 0.5 },  { note: "G4", duration: 0.5},{ note: "Ab4", duration: 0.5}, 
                { note: "F4", duration: 0.5 }, { note: "G4", duration: 0.5},  { note: "Ab4", duration: 0.5}, { note: "Bb4", duration: 0.5}] },
    { pitches: [{ note: "C#4", duration: 1 }, { note: "C4", duration: 0.5 },  { note: "C#4", duration: 0.5},
                { note: "F4", duration: 1 }, { note: "Gb4", duration: 0.5},  { note: "F4", duration: 0.5}] },
    { pitches: [{ note: "D4", duration: 0.5 }, { note: "D#4", duration: 0.5 },  { note: "D4", duration: 0.5},{ note: "Db4", duration: 0.5}, 
                { note: "C4", duration: 0.5 }, { note: "B3", duration: 0.5},  { note: "Bb3", duration: 0.5}, { note: "B3", duration: 0.5}] },
    { pitches: [{ note: "C3", duration: 0.25 }, { note: "C#3", duration: 0.25 },  { note: "D#3", duration: 0.25},{ note: "E3", duration: 0.25}, 
                { note: "D#3", duration: 0.25}, { note: "C#3", duration: 0.25},  { note: "C3", duration: 0.5}, 
                { note: "F3", duration: 0.25 }, { note: "F#3", duration: 0.25 },  { note: "G#3", duration: 0.25},{ note: "A3", duration: 0.25}, 
                { note: "G#3", duration: 0.25 }, { note: "F#3", duration: 0.25},  { note: "F3", duration: 0.5}] },
    { pitches: [{ note: "A3", duration: 0.25 }, { note: "C#4", duration: 0.25 },  { note: "D4", duration: 0.25},{ note: "C#4", duration: 0.25}, 
                { note: "F4", duration: 0.25}, { note: "F#4", duration: 0.25},  { note: "F4", duration: 0.25}, { note: "C4", duration: 0.25}, 
                { note: "B3", duration: 0.25 }, { note: "G#3", duration: 0.25 },  { note: "E3", duration: 0.25},{ note: "G#3", duration: 0.25}, 
                { note: "B3", duration: 0.25 }, { note: "Bb3", duration: 0.25},  { note: "F#3", duration: 0.25}, { note: "F3", duration: 0.25}] },
    { pitches: [{ note: "G#3", duration: 0.25 }, { note: "D#4", duration: 0.25 },  { note: "C#4", duration: 0.25},{ note: "C4", duration: 0.25}, 
                { note: "D#4", duration: 0.25}, { note: "Ab4", duration: 0.25},  { note: "F#4", duration: 0.5},  
                { note: "D#4", duration: 0.25 }, { note: "G#4", duration: 0.25 },  { note: "G4", duration: 0.25},{ note: "G#4", duration: 0.25}, 
                { note: "A#4", duration: 0.75 },  { note: "G#4", duration: 0.25}] },
    { pitches: [{ note: "G4", duration: 0.25 }, { note: "A4", duration: 0.25 },  { note: "A#4", duration: 0.25},{ note: "C5", duration: 0.25}, 
                { note: "D5", duration: 0.75}, { note: "Eb5", duration: 0.25}, 
                { note: "D5", duration: 0.5 },  { note: "F#5", duration: 0.25},{ note: "D#5", duration: 0.25}, 
                { note: "D5", duration: 0.25 }, { note: "G5", duration: 0.25},  { note: "F#5", duration: 0.25},  { note: "D#5", duration: 0.25}] },
    { pitches:[{ note: "D4", duration: 0.25 }, { note: "C#4", duration: 0.25 },  { note: "D4", duration: 0.25},{ note: "A3", duration: 0.25}, 
              { note: "A#3", duration: 0.25}, { note: "C#4", duration: 0.25},  { note: "A3", duration: 0.25}, { note: "A#3", duration: 0.25}, 
              { note: "G3", duration: 0.33 }, { note: "A3", duration: 0.34 },  { note: "Bb3", duration: 0.33}, 
              { note: "Eb3", duration: 0.25 }, { note: "Eb3", duration: 0.25},  { note: "D3", duration: 0.25}, { note: "Eb3", duration: 0.25}] },
    { pitches: [{ note: "Eb4", duration: 0.25 }, { note: "Ab4", duration: 0.25 },  { note: "B4", duration: 0.25},{ note: "Bb4", duration: 0.25}, 
              { note: "G4", duration: 0.25}, { note: "Ab4", duration: 0.25},  { note: "Ab4", duration: 0.5}, 
              { note: "G4", duration: 0.25}, { note: "Ab4", duration: 0.25}, { note: "Eb4", duration: 0.25 }, { note: "Bb4", duration: 0.25},
              { note: "G4", duration: 0.25}, { note: "Ab4", duration: 0.25}, { note: "Eb4", duration: 0.25 }, { note: "C5", duration: 0.25}] },
    { pitches: [{ note: "D5", duration: 0.25 }, { note: "Eb5", duration: 0.25 },  { note: "D5", duration: 0.25},{ note: "C5", duration: 0.25}, 
                { note: "Bb4", duration: 0.25}, { note: "Ab4", duration: 0.25},  { note: "G4", duration: 0.25},  { note: "F4", duration: 0.25},
                { note: "Eb4", duration: 0.75}, { note: "Gb4", duration: 0.25}, { note: "Eb4", duration: 0.5 }, { note: "Ab4", duration: 0.5},
                ] },
    { pitches: [{ note: "Eb4", duration: 0.75}, { note: "Bb4", duration: 0.25}, { note: "Eb4", duration: 0.5 }, { note: "B4", duration: 0.5},
                { note: "B4", duration: 0.25}, { note: "D4", duration: 0.25}, { note: "Eb4", duration: 0.25 }, { note: "D4", duration: 0.25},
                { note: "Eb4", duration: 0.25}, { note: "F#4", duration: 0.25}, { note: "G4", duration: 0.25 }, { note: "F#4", duration: 0.25},  
                ] },
    { pitches: [{ note: "F#4", duration: 0.25 }, { note: "A#4", duration: 0.25 },  { note: "B4", duration: 0.25},{ note: "A#4", duration: 0.25}, 
                { note: "D#5", duration: 0.25}, { note: "E5", duration: 0.25},  { note: "D#5", duration: 0.25}, { note: "C#5", duration: 0.25}, 
                { note: "B4", duration: 0.25 }, { note: "C#5", duration: 0.25 },  { note: "A4", duration: 0.25},{ note: "B4", duration: 0.25}, 
                { note: "G#4", duration: 0.25 }, { note: "A4", duration: 0.25},  { note: "F#4", duration: 0.25}, { note: "G#4", duration: 0.25}] },
    { pitches: [{ note: "E4", duration: 0.25 }, { note: "F#4", duration: 0.25 },  { note: "D#4", duration: 0.25},{ note: "E4", duration: 0.25}, 
      { note: "C#4", duration: 0.25}, { note: "C4", duration: 0.25},  { note: "C#4", duration: 0.5}, 
      { note: "B4", duration: 0.25 }, { note: "C#5", duration: 0.25 },  { note: "A4", duration: 0.25},{ note: "B4", duration: 0.25}, 
      { note: "G#4", duration: 0.25 }, { note: "A4", duration: 0.25},  { note: "F#4", duration: 0.25}, { note: "G#4", duration: 0.25}] },
    { pitches: [{ note: "F4", duration: 0.25 }, { note: "D#4", duration: 0.25 },  { note: "D4", duration: 0.25},{ note: "E4", duration: 0.25}, 
      { note: "F#4", duration: 0.25}, { note: "G#4", duration: 0.25},  { note: "A#4", duration: 0.5}, 
      { note: "A4", duration: 0.25 }, { note: "G#4", duration: 0.25 },  { note: "F#4", duration: 0.25},{ note: "F4", duration: 0.25}, 
      { note: "F#4", duration: 1 }] },
    { pitches: [{ note: "C#4", duration: 0.5 }, { note: "G#3", duration: 0.5 }, 
      { note: "C#3", duration: 0.25}, { note: "D#3", duration: 0.25},  { note: "E3", duration: 0.5}, 
      { note: "F#3", duration: 0.25 }, { note: "C#3", duration: 0.25 },  { note: "D#3", duration: 0.25},{ note: "E3", duration: 0.25}, 
      { note: "D#3", duration: 0.25 }, { note: "C#3", duration: 0.25},  { note: "C3", duration: 0.5}] },
    { pitches: [{ note: "G#3", duration: 0.25 }, { note: "C#4", duration: 0.25 },  { note: "D#4", duration: 0.25},{ note: "E4", duration: 0.25}, 
      { note: "F#4", duration: 0.25}, { note: "E4", duration: 0.25},  { note: "D#4", duration: 0.25}, { note: "C#4", duration: 0.25}, 
      { note: "B3", duration: 0.25 }, { note: "F#3", duration: 0.25 }, 
      { note: "A3", duration: 0.375 }, { note: "G#3", duration: 0.125},
      { note: "C#3", duration: 0.33},{ note: "C3", duration: 0.33},{ note: "C#3", duration: 0.34}] },
    { pitches: [{ note: "D#3", duration: 0.33 }, { note: "C#3", duration: 0.33 },  { note: "D#3", duration: 0.34},
      { note: "E3", duration: 0.33}, { note: "C#3", duration: 0.33},  { note: "E3", duration: 0.34}, 
      { note: "F3", duration: 0.33}, { note: "C#3", duration: 0.33},  { note: "F3", duration: 0.34}, 
      { note: "G#3", duration: 0.33}, { note: "F3", duration: 0.33},  { note: "G#3", duration: 0.34}] },
    { pitches: [{ note: "C#4", duration: 0.33 }, { note: "G#4", duration: 0.33 },  { note: "F4", duration: 0.34},
      { note: "D5", duration: 0.5}, { note: "C#5", duration: 0.5}, 
      { note: "C5", duration: 0.5}, { note: "B4", duration: 0.5}, 
      { note: "Bb4", duration: 0.5}, { note: "A4", duration: 0.50}] },
      { pitches: [{ note: "G#4", duration: 0.5 }, { note: "G4", duration: 0.5 }, 
        { note: "F4", duration: 0.25}, { note: "C4", duration: 0.25}, { note: "Ab3", duration: 0.25}, { note: "C4", duration: 0.25}, 
        { note: "Bb3", duration: 0.25}, { note: "Ab3", duration: 0.25}, { note: "G3", duration: 0.25}, { note: "F3", duration: 0.25}, 
        { note: "C3", duration: 1}] },
  ]};
  let activeAudioSources: AudioBufferSourceNode[] = [];
  let audioContext: AudioContext | null = null;
  
  // Function to play a note (example)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const playNote = (audioContext: AudioContext, buffer: AudioBuffer) => {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start();
    activeAudioSources.push(source);
  
    // Remove the source from the active list when it finishes playing
    source.onended = () => {
      activeAudioSources = activeAudioSources.filter(s => s !== source);
    };
  };
// Helper function to build tree nodes
interface Measure {
  pitches: { note: string; duration: number }[];
};

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
function populateInorder(node: TreeNode | null, measures: Measure[], nodeIds: number[], nodeId = 0) {
  if (!node) return;
  populateInorder(node.left, measures, nodeIds, 2 * nodeId + 1);
  measures.push(node.measure);
  nodeIds.push(nodeId);
  populateInorder(node.right, measures, nodeIds, 2 * nodeId + 2);
}

function populatePreorder(node: TreeNode | null, measures: Measure[], nodeIds: number[], nodeId = 0) {
  if (!node) return;
  measures.push(node.measure);
  nodeIds.push(nodeId);
  populatePreorder(node.left, measures, nodeIds, 2 * nodeId + 1);
  populatePreorder(node.right, measures, nodeIds, 2 * nodeId + 2);
}

function populatePostorder(node: TreeNode | null, measures: Measure[], nodeIds: number[], nodeId = 0) {
  if (!node) return;
  populatePostorder(node.left, measures, nodeIds, 2 * nodeId + 1);
  populatePostorder(node.right, measures, nodeIds, 2 * nodeId + 2);
  measures.push(node.measure);
  nodeIds.push(nodeId);
}
function populateLevelorderNodeIds(root: TreeNode | null, nodeIds: number[]) {
  if (!root) return;
  const queue: { node: TreeNode; id: number }[] = [{ node: root, id: 0 }];
  let index = 0;

  while (queue.length > 0) {
    const { node, id } = queue.shift()!;
    if (index < traversalMeasures.levelorder.length) {
      nodeIds.push(id); // Push node ID corresponding to level order measure
      index++;
    }
    if (node.left) queue.push({ node: node.left, id: 2 * id + 1 });
    if (node.right) queue.push({ node: node.right, id: 2 * id + 2 });
  }
}

// Build the tree from level order
const root = buildTree(traversalMeasures.levelorder);
const traversalNodeIds = {
  inorder: [] as number[],
  preorder: [] as number[],
  postorder: [] as number[],
  levelorder: [] as number[], // Populated dynamically
};
// Populate traversals
// Populate traversal measures and node IDs
populateInorder(root, traversalMeasures.inorder, traversalNodeIds.inorder);
populatePreorder(root, traversalMeasures.preorder, traversalNodeIds.preorder);
populatePostorder(root, traversalMeasures.postorder, traversalNodeIds.postorder);

// Populate levelorder node IDs dynamically
populateLevelorderNodeIds(root, traversalNodeIds.levelorder);

const scheduledTimeouts: number[] = [];

export default function Home() {
  const [mainOrder, setMainOrder] = useState<keyof typeof activeTraversals>("levelorder");
  const mainOrderRef = useRef(mainOrder);
  const [activeTraversals, setActiveTraversals] = useState({
    preorder: false,
    inorder: false,
    postorder: true,
    levelorder: true,
  });
  const [debugMode, setDebugMode] = useState(false);
  const largeScreenTreeContainerRef = useRef<HTMLDivElement>(null);
  const smallScreenTreeContainerRef = useRef<HTMLDivElement>(null);
  const activeTraversalsRef = useRef(activeTraversals);

  useEffect(() => {
    activeTraversalsRef.current = activeTraversals;
  }, [activeTraversals]);

  useEffect(() => {
    mainOrderRef.current = mainOrder;
  }, [mainOrder]);

  const colorMap = {
    preorder: "rgba(255, 0, 0, 0.5)",
    inorder: "rgba(0, 255, 0, 0.5)",
    postorder: "rgba(0, 0, 255, 0.5)",
    levelorder: "rgba(255, 255, 0, 0.5)",
  };

  const toggleTraversal = (order: keyof typeof activeTraversals) => {
    setActiveTraversals((prev) => ({
      ...prev,
      [order]: !prev[order],
    }));
  };

  const handlePlay = async () => {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)(); // eslint-disable-line @typescript-eslint/no-explicit-any
    }

    // Load viola instrument
    const instrument = await Soundfont.instrument(audioContext, "viola");

    // Get active measures
    const activeMeasures = Object.keys(activeTraversals)
      .filter((order) => activeTraversals[order as keyof typeof activeTraversals])
      .map((order) => ({
        measures: traversalMeasures[order as keyof typeof traversalMeasures],
        traversalOrder: order,
      }));

    // Play all active measures sequentially
    activeMeasures.forEach(({ measures, traversalOrder }) => {
      playTraversalMeasures(measures, instrument, traversalOrder);
    });
  };

  const playTraversalMeasures = (
    measures: { pitches: { note: string; duration: number }[] }[],
    instrument: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    traversalOrder: string,
    startIndex: number = 0
  ) => {
    let currentTime = instrument.context.currentTime; // Start time for the traversal
    measures.slice(startIndex).forEach((measure, index) => {
      const measureDuration = measure.pitches.reduce((sum, pitch) => sum + pitch.duration * multiplier / 1000, 0);

      // Get the node index specific to this traversal order
      const nodeId = getTraversalNodeId(index + startIndex, traversalOrder);

      // Schedule playback and node highlighting
      const highlightTimeout = setTimeout(() => {
        highlightNode(nodeId, traversalOrder); // Highlight the node
        playMeasure(measure, instrument); // Play the measure
      }, (currentTime - instrument.context.currentTime) * 1000);
      scheduledTimeouts.push(highlightTimeout as unknown as number);

      // Schedule reset of the node color
      const resetTimeout = setTimeout(() => {
        resetNodeColor(nodeId, traversalOrder); // Pass traversal order to reset
      }, (currentTime - instrument.context.currentTime + measureDuration) * 1000);
      scheduledTimeouts.push(resetTimeout as unknown as number);
      // Increment currentTime for the next measure
      currentTime += measureDuration; // Advance the currentTime for the next measure
    });
  };

  const getTraversalNodeId = (index: number, traversalOrder: string): number => {
    switch (traversalOrder) {
      case "preorder":
        return traversalNodeIds.preorder[index];
      case "inorder":
        return traversalNodeIds.inorder[index];
      case "postorder":
        return traversalNodeIds.postorder[index];
      case "levelorder":
      default:
        return traversalNodeIds.levelorder[index];
    }
  };

  const playMeasure = (
    measure: { pitches: { note: string | "rest"; duration: number }[] },
    instrument: any // eslint-disable-line @typescript-eslint/no-explicit-any
  ) => {
    let offset = 0; // Time offset within the measure
    measure.pitches.forEach((pitch) => {
      if (pitch.note === "rest") {
        // Skip playing a note and just wait for the duration
        offset += pitch.duration * multiplier / 1000;
      } else {
        // Play the pitch
        instrument.play(
          pitch.note,
          instrument.context.currentTime + offset,
          { duration: pitch.duration * multiplier / 1000 }
        );
        offset += pitch.duration * multiplier / 1000; // Increment the offset by the pitch duration
      }
    });
  };

  const activeTraversalsPerNode: { [nodeId: number]: string[] } = {};

  const highlightNode = (nodeId: number, traversalOrder: string) => {
    // Add the traversal order to the active list for the node
    if (!activeTraversalsPerNode[nodeId]) {
      activeTraversalsPerNode[nodeId] = [];
    }
    if (!activeTraversalsPerNode[nodeId].includes(traversalOrder)) {
      activeTraversalsPerNode[nodeId].push(traversalOrder);
    }

    // Recalculate the blended color
    const blendedColor = activeTraversalsPerNode[nodeId]
      .map((order) => colorMap[order as keyof typeof colorMap])
      .reduce((acc, color) => blendColors(acc, color)); // Blend all active traversal colors

    // Apply the new color
    const node = d3.select(`#node-${nodeId}`);
    node.transition().duration(200).style("fill", blendedColor);
  };

  const resetNodeColor = (nodeId: number, traversalOrder: string) => {
    // Remove the traversal order from the active list for the node
    if (activeTraversalsPerNode[nodeId]) {
      activeTraversalsPerNode[nodeId] = activeTraversalsPerNode[nodeId].filter(
        (order) => order !== traversalOrder
      );
    }

    // Recalculate the blended color or reset to white
    const node = d3.select(`#node-${nodeId}`);
    if (activeTraversalsPerNode[nodeId] && activeTraversalsPerNode[nodeId].length > 0) {
      const blendedColor = activeTraversalsPerNode[nodeId]
        .map((order) => colorMap[order as keyof typeof colorMap])
        .reduce((acc, color) => blendColors(acc, color)); // Blend remaining active traversal colors
      node.transition().duration(200).style("fill", blendedColor);
    } else {
      node.transition().duration(200).style("fill", "white"); // Reset to white if no active traversals
    }
  };

  const blendColors = (color1: string, color2: string) => {
    const rgba1 = parseRGBA(color1);
    const rgba2 = parseRGBA(color2);

    return `rgba(${Math.round((rgba1.r + rgba2.r) / 2)}, ${Math.round(
      (rgba1.g + rgba2.g) / 2
    )}, ${Math.round((rgba1.b + rgba2.b) / 2)}, ${Math.min(1, (rgba1.a + rgba2.a) / 2)})`;
  };

  const parseRGBA = (rgbaString: string) => {
    const match = rgbaString.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d.]*)\)$/);
    return match
      ? {
          r: parseInt(match[1], 10),
          g: parseInt(match[2], 10),
          b: parseInt(match[3], 10),
          a: parseFloat(match[4]) || 1,
        }
      : { r: 255, g: 255, b: 255, a: 1 }; // Default to white if parsing fails
  };

  const handleNodeClick = (nodeId: number) => {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)(); // eslint-disable-line @typescript-eslint/no-explicit-any
    }

    Soundfont.instrument(audioContext, "viola").then((instrument) => {
      const startIndex = traversalNodeIds[mainOrderRef.current].indexOf(nodeId);

      // Get active measures starting from the clicked node
      const activeMeasures = Object.keys(activeTraversalsRef.current)
        .filter((order) => activeTraversalsRef.current[order as keyof typeof activeTraversals])
        .map((order) => {
          const correspondingNodeId = traversalNodeIds[order as keyof typeof traversalNodeIds][startIndex];
          const correspondingIndex = traversalNodeIds[order as keyof typeof traversalNodeIds].indexOf(correspondingNodeId);
          return {
            measures: traversalMeasures[order as keyof typeof traversalMeasures],
            traversalOrder: order,
            startIndex: correspondingIndex,
          };
        });

      // Play all active measures sequentially
      activeMeasures.forEach(({ measures, traversalOrder, startIndex }) => {
        playTraversalMeasures(measures, instrument, traversalOrder, startIndex);
      });
    });
  };

  const handleClear = () => {
    // Stop all active playing audios
    activeAudioSources.forEach(source => {
      source.stop();
    });
    activeAudioSources = [];

    // Close the AudioContext if it exists
    if (audioContext) {
      audioContext.close().then(() => {
        audioContext = null; // Reset the audioContext
      });
    }

    // Clear all scheduled timeouts
    scheduledTimeouts.forEach((timeout) => clearTimeout(timeout));
    scheduledTimeouts.length = 0;
    activeAudioSources.length = 0; // not sure this is right
    // Reset node colors
    d3.selectAll("circle").transition().duration(200).style("fill", "white");

    // Clear active traversals per node
    Object.keys(activeTraversalsPerNode).forEach((nodeId) => {
      activeTraversalsPerNode[parseInt(nodeId)] = [];
    });
  };

  useEffect(() => {
    const isLargeScreen = window.innerWidth >= 768; // Tailwind's `md` breakpoint
    const treeContainer = isLargeScreen
      ? largeScreenTreeContainerRef.current
      : smallScreenTreeContainerRef.current;

    if (!treeContainer) return;

    // Clear existing SVG content
    d3.select(treeContainer).select("svg").remove();

    function treeNodeToD3(node: TreeNode | null, id = 0): { name: string; id: number; children?: any[] } | null { // eslint-disable-line @typescript-eslint/no-explicit-any
      if (!node) return null;
      return {
        name: node.measure.pitches
          .map((pitch) => `${pitch.note} (${pitch.duration * multiplier}ms)`)
          .join(", "),
        id,
        children: [
          treeNodeToD3(node.left, 2 * id + 1),
          treeNodeToD3(node.right, 2 * id + 2),
        ].filter(Boolean),
      };
    }

    const treeData = treeNodeToD3(root);

    const width = treeContainer.offsetWidth;
    const height = treeContainer.offsetHeight;

    const svg = d3
      .select(treeContainer)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(50,50)");

    const treeLayout = d3.tree().size([width - 100, height - 100]);

    if (!treeData) return;
    const rootNode = d3.hierarchy(treeData);
    // @ts-expect-error: lazy to fix
    treeLayout(rootNode);

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

    const nodes = svg
      .selectAll(".node")
      .data(rootNode.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .on("click", (event, d) => handleNodeClick(d.data.id)); // Add click event listener

    nodes
      .append("circle")
      .attr("r", 30)
      .attr("id", (d) => `node-${d.data.id}`)
      .style("fill", "white")
      .style("stroke", "black");

    nodes
      .append("text")
      .attr("dy", -15)
      .attr("text-anchor", "middle")
      .attr("class", "node-text") // Add class for text
      .style("display", debugMode ? "block" : "none") // Show or hide based on debugMode
      .text((d) => d.data.name
      .split(", ")
      .map((noteInfo) => noteInfo.split(" ")[0]) // Extract only the note name
      .join(", "));

    d3.selectAll(".node-text").style("display", debugMode ? "block" : "none");

  }, [debugMode, mainOrder]); // Add mainOrder to the dependency array
  
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-gray-100 overflow-auto">
      {/* Large screen layout */}
      <div className="hidden md:block">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-5xl font-bold text-black">Tree Traversal</h1>
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <label className="flex items-center gap-2">
              <span className="text-black font-bold">Verbose Mode</span>
              <input
                type="checkbox"
                checked={debugMode}
                onChange={(e) => setDebugMode(e.target.checked)}
                className="w-6 h-6 rounded cursor-pointer"
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="text-black font-bold">Main Order:</span>
              <select
                value={mainOrder}
                onChange={(e) => setMainOrder(e.target.value as keyof typeof activeTraversals)}
                className="w-32 h-8 rounded cursor-pointer"
              >
                {["preorder", "inorder", "postorder", "levelorder"].map((order) => (
                  <option key={order} value={order}>
                    {order.charAt(0).toUpperCase() + order.slice(1)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <label className="flex items-center gap-2">
              <span className="text-2xl font-bold text-black ">Helena Su</span>
            </label>
          </div>
          <div className="flex gap-4">
            {["preorder", "inorder", "postorder", "levelorder"].map((order) => (
              <label key={order} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={activeTraversals[order as keyof typeof activeTraversals]}
                  onChange={() => toggleTraversal(order as keyof typeof activeTraversals)}
                  style={{
                    accentColor: colorMap[order as keyof typeof colorMap], // Set the checkbox color dynamically
                  }}
                  className="w-8 h-8 rounded cursor-pointer"
                />
                {debugMode && (
                  <span
                    className="font-bold"
                    style={{
                      color: colorMap[order as keyof typeof colorMap], // Set text color to match the order's color
                    }}
                  >
                    {order.charAt(0).toUpperCase() + order.slice(1)}
                  </span>
                )}
              </label>
            ))}
          </div>
          <div className="flex gap-4">
            <button
              onClick={handlePlay}
              className="mt-4 px-6 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600"
            >
              Play Music
            </button>
            <button
              onClick={handleClear}
              className="mt-4 px-6 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600"
            >
              Clear
            </button>
          </div>
        </div>
        <div ref={largeScreenTreeContainerRef} className="w-full h-[calc(100vh-150px)]">
          {/* D3 tree visualization is rendered here */}
        </div>
        <div className="w-full p-4 text-black">
          <ul className="list-disc list-inside">
            <li>Inspired by Bach Inventions and Professor Ren&apos;s lecture on How to Give a Good Talk (in a tree strucutre)</li>
            <li>you can select different combinations of orders</li>
            <li>you can start anywhere by directly clicking on nodes and specifying a main order</li>
            <li>you can spawn even more by repeatedly clicking on a node</li>
            <li>
              <a href="https://github.com/helenawsu/treetraversal" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Small screen layout */}
      <div className="block md:hidden">
        <div className="flex flex-col items-center gap-4 p-4">
          <h1 className="text-4xl font-bold text-black text-center">Tree Traversal - Helena Su</h1>
          <div className="flex flex-row items-center gap-4">
            <label className="flex items-center gap-2">
              <span className="text-black font-bold">Verbose Mode</span>
              <input
                type="checkbox"
                checked={debugMode}
                onChange={(e) => setDebugMode(e.target.checked)}
                className="w-6 h-6 rounded cursor-pointer"
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="text-black font-bold">Main Order:</span>
              <select
                value={mainOrder}
                onChange={(e) => setMainOrder(e.target.value as keyof typeof activeTraversals)}
                className="w-32 h-8 rounded cursor-pointer"
              >
                {["preorder", "inorder", "postorder", "levelorder"].map((order) => (
                  <option key={order} value={order}>
                    {order.charAt(0).toUpperCase() + order.slice(1)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {["preorder", "inorder", "postorder", "levelorder"].map((order) => (
              <label key={order} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={activeTraversals[order as keyof typeof activeTraversals]}
                  onChange={() => toggleTraversal(order as keyof typeof activeTraversals)}
                  style={{
                    accentColor: colorMap[order as keyof typeof colorMap],
                  }}
                  className="w-8 h-8 rounded cursor-pointer"
                />
                {debugMode && (
                  <span
                    className="font-bold"
                    style={{
                      color: colorMap[order as keyof typeof colorMap], // Set text color to match the order's color
                    }}
                  >
                    {order.charAt(0).toUpperCase() + order.slice(1)}
                  </span>
                )}
              </label>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handlePlay}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600"
            >
              Play Music
            </button>
            <button
              onClick={handleClear}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600"
            >
              Clear
            </button>
          </div>
        </div>
        <div ref={smallScreenTreeContainerRef} className="w-full h-[calc(100vh-150px)]">
          {/* D3 tree visualization is rendered here */}
        </div>
        <div className="w-full p-4 text-black">
          <ul className="list-disc list-inside">
            <li>Inspired by Bach Inventions and Professor Ren&apos;s lecture on How to Give a Good Talk (in a tree structure)</li>
            <li>You can select different combinations of orders</li>
            <li>You can start anywhere by directly clicking on nodes and specifying a main order</li>
            <li>You can spawn even more by repeatedly clicking on a node</li>
            <li>
              <a href="https://github.com/helenawsu/treetraversal" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
