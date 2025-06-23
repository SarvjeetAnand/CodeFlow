import React, { useCallback, useState, useEffect } from "react";
import ReactFlow, {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    Background,
    Controls,
    MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";
import LanguageNode from "../components/LanguageNode";
import Sidebar from "../components/Sidebar";
import DarkModeToggle from "../components/DarkModeToggle";
import axios from "../api/axiosInstance";
import { v4 as uuidv4 } from "uuid";

const nodeTypes = {
    languageNode: LanguageNode,
};

const initialLanguages = ["Python", "JavaScript", "C++", "Java", "Go"];

export default function Home() {
    const [darkMode, setDarkMode] = useState(false);
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [history, setHistory] = useState([]);

    // Initialize nodes from initialLanguages or localStorage
    useEffect(() => {
        const savedNodes = JSON.parse(localStorage.getItem("nodes"));
        const savedEdges = JSON.parse(localStorage.getItem("edges"));
        const savedHistory = JSON.parse(localStorage.getItem("history"));

        if (savedNodes && savedEdges) {
            setNodes(savedNodes);
            setEdges(savedEdges);
        } else {
            setNodes(
                initialLanguages.map((lang, idx) => ({
                    id: `${lang}-${idx}`,
                    type: "languageNode",
                    position: { x: 100 + idx * 180, y: 100 },
                    data: {
                        language: lang,
                        code: "",
                        isOutput: false,
                        darkMode,
                        setCode: (newCode) => handleCodeChange(`${lang}-${idx}`, newCode),
                        resetNode: () => resetNode(`${lang}-${idx}`),
                    },
                }))
            );
        }

        if (savedHistory) setHistory(savedHistory);
    }, []);

    // Save nodes, edges, history to localStorage on change
    useEffect(() => {
        localStorage.setItem("nodes", JSON.stringify(nodes));
    }, [nodes]);

    useEffect(() => {
        localStorage.setItem("edges", JSON.stringify(edges));
    }, [edges]);

    useEffect(() => {
        localStorage.setItem("history", JSON.stringify(history));
    }, [history]);

    // Update darkMode in nodes data
    useEffect(() => {
        setNodes((nds) =>
            nds.map((node) => ({
                ...node,
                data: { ...node.data, darkMode },
            }))
        );
    }, [darkMode]);

    const handleCodeChange = (nodeId, newCode) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === nodeId
                    ? {
                        ...node,
                        data: {
                            ...node.data,
                            code: newCode,
                            // Reset isOutput flag if editing source code
                            isOutput: false,
                        },
                    }
                    : node
            )
        );
    };

    // const resetNode = (nodeId) => {
    //     setNodes((nds) =>
    //         nds.map((node) =>
    //             node.id === nodeId
    //                 ? { ...node, data: { ...node.data, code: "", isOutput: false } }
    //                 : node
    //         )
    //     );
    // };


    const resetNode = (nodeId) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === nodeId
                    ? {
                        ...node,
                        data: {
                            ...node.data,
                            code: "",
                            isOutput: false,
                            sourceNodeId: null,
                        },
                    }
                    : node
            )
        );

        // Also delete incoming edges to this node
        setEdges((eds) => eds.filter((edge) => edge.target !== nodeId));
    };



    const onEdgesDelete = (deletedEdges) => {
        setEdges((eds) => eds.filter((edge) => !deletedEdges.some((d) => d.id === edge.id)));
    };


    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );

    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    const onConnect = useCallback(
        async (params) => {
            // setEdges((eds) => addEdge(params, eds));

            const sourceNode = nodes.find((node) => node.id === params.source);
            const targetNode = nodes.find((node) => node.id === params.target);

            // if (!sourceNode || !targetNode) {
            //     alert("Invalid source or target node.");
            //     return;
            // }

            // if (!sourceNode.data.code || sourceNode.data.code.trim() === "") {
            //     alert("Source node code is empty.");
            //     return;
            // }

            // if (sourceNode.id === targetNode.id) {
            //     alert("Cannot connect a node to itself.");
            //     return;
            // }

            // // Avoid duplicate connections
            // if (
            //     edges.find(
            //         (e) =>
            //             e.source === params.source &&
            //             e.target === params.target
            //     )
            // ) {
            //     alert("These nodes are already connected.");
            //     return;
            // }

            // // Add the edge
            // setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: "#555" } }, eds));


            if (!sourceNode || !targetNode) {
                alert("Invalid source or target node.");
                return;
            }

            const sourceLang = sourceNode.data.language;
            const targetLang = targetNode.data.language;
            const inputCode = sourceNode.data.code?.trim();

            // Prevent self-connection or invalid cases
            if (sourceNode.id === targetNode.id) {
                alert("Cannot connect a node to itself.");
                return;
            }

            if (!inputCode) {
                alert("Source code is empty. Please paste your code in the source node.");
                return;
            }


            try {
                const res = await axios.post("/code/convert", {
                    sourceLang,
                    targetLang,
                    inputCode,
                });

                const convertedCode = res.data?.convertedCode || "// Conversion failed";

                // Update target node with converted code and mark as output
                setNodes((nds) =>
                    nds.map((node) => {
                        // Update only the target node
                        if (node.id === targetNode.id) {
                            return {
                                ...node,
                                data: {
                                    ...node.data,
                                    code: convertedCode,
                                    isOutput: true,
                                },
                            };
                        }
                        return node;
                    })
                );
                setEdges((eds) => addEdge({ ...params, animated: true }, eds));

                // Save conversion record in history
                setHistory((hist) => [
                    {
                        id: uuidv4(),
                        sourceLang: sourceNode.data.language,
                        targetLang: targetNode.data.language,
                        inputCode: sourceNode.data.code,
                        convertedCode,
                        timestamp: new Date().toISOString(),
                    },
                    ...hist,
                ]);
            } catch (error) {
                console.error("Conversion failed:", error);
            }
        },
        [nodes, setNodes, setEdges]
    );

    // Add new language node from sidebar
    const onAddNode = (language) => {
        const newId = `${language}-${uuidv4()}`;
        const newNode = {
            id: newId,
            type: "languageNode",
            position: { x: 250, y: 250 },
            data: {
                language,
                code: "",
                isOutput: false,
                darkMode,
                setCode: (newCode) => handleCodeChange(newId, newCode),
                resetNode: () => resetNode(newId),
            },
        };
        setNodes((nds) => nds.concat(newNode));
    };

    return (
        <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-50"} h-screen flex`}>
            <Sidebar onAddNode={onAddNode} />

            <div className="flex-1 relative">
                <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    onEdgesDelete={onEdgesDelete}
                    fitView
                    attributionPosition="bottom-left"
                    style={{ background: darkMode ? "#1a202c" : "#f9fafb" }}
                >
                    <Background color={darkMode ? "#555" : "#ddd"} />
                    <Controls />
                    <MiniMap />
                </ReactFlow>
            </div>
        </div>
    );
}
