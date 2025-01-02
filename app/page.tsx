"use client"
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export default function Home() {
  const [activeTraversals, setActiveTraversals] = useState({
    preorder: true,
    inorder: true,
    postorder: true,
    levelorder: true,
  });

  const treeContainerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const traversalAudioFiles = {
    preorder: ["/audio/b6.mp3", "/audio/c6.mp3", "/audio/f6.mp3"],
    inorder: ["/audio/f6.mp3", "/audio/c6.mp3", "/audio/b6.mp3"],
    postorder: ["/audio/c6.mp3", "/audio/b6.mp3", "/audio/f6.mp3"],
    levelorder: ["/audio/f6.mp3", "/audio/b6.mp3", "/audio/c6.mp3"], // Example
  };
  
  const toggleTraversal = (order: string) => {
    setActiveTraversals((prev) => ({
      ...prev,
      [order]: !prev[order],
    }));
  };
  
  const handlePlay = () => {
    // Get active traversals and their corresponding audio files
    const activeFiles = Object.keys(activeTraversals)
      .filter((order) => activeTraversals[order as keyof typeof activeTraversals])
      .map((order) => traversalAudioFiles[order as keyof typeof traversalAudioFiles]);
  
    // Play all active sequences simultaneously
    playAudioSequencesSimultaneously(activeFiles);
  };
  
  const playAudioSequencesSimultaneously = (filesPerTraversal: string[][]) => {
    filesPerTraversal.forEach((files) => {
      playSingleAudioSequence(files); // Play each sequence independently
    });
  };
  
  const playSingleAudioSequence = (files: string[]) => {
    if (files.length === 0) return;
  
    let index = 0;
    const audioPlayer = new Audio(); // Create a new <audio> element for this sequence
  
    const playNext = () => {
      if (index < files.length) {
        audioPlayer.src = files[index];
        audioPlayer.play();
        index++;
      } else {
        audioPlayer.removeEventListener("ended", playNext); // Clean up
      }
    };
  
    audioPlayer.addEventListener("ended", playNext);
    playNext(); // Start playing the first file
  };
  
  

  useEffect(() => {
    if (!treeContainerRef.current) return;

    // Clear existing content
    d3.select(treeContainerRef.current).selectAll("*").remove();

    // Set up dimensions
    const width = window.innerWidth;
    const height = window.innerHeight - 100; // Adjust for title and checkboxes
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const treeWidth = width - margin.left - margin.right;
    const treeHeight = height - margin.top - margin.bottom;

    const treeData = {
      name: "Root",
      children: [
        { name: "L", children: [{ name: "LL" }, { name: "LR" }] },
        { name: "R", children: [{ name: "RL" }, { name: "RR" }] },
      ],
    };

    // Create SVG
    const svg = d3
      .select(treeContainerRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Create tree layout
    const tree = d3.tree().size([treeWidth, treeHeight]);
    const root = d3.hierarchy(treeData);
    tree(root);

    // Render links
    svg
      .selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", d3
        .linkVertical()
        .x((d) => d.x) // Swap x and y for top-down tree
        .y((d) => d.y))
      .style("fill", "none")
      .style("stroke", "#ccc");

    // Render nodes
    const nodes = svg
      .selectAll(".node")
      .data(root.descendants())
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
      {/* Title and Controls */}
      <div
        className="absolute top-4 left-0 w-full flex flex-col items-center gap-2 z-10 bg-gray-100"
        style={{ pointerEvents: "auto" }}
      >
        <h1 className="text-2xl font-bold">Tree Traversal</h1>
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
  
      {/* Tree Visualization */}
      <div
        ref={treeContainerRef}
        className="absolute top-[150px] left-0 w-full h-[calc(100%-150px)]"
      >
        {/* Tree graph rendered here */}
      </div>
  
      {/* Hidden Audio Element */}
      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
  
}
