// Initialize variables
let nodeCount = 5;
let adjacencyMatrix = [];

// Function to initialize adjacency matrix with zeros
function initializeMatrix() {
    adjacencyMatrix = Array(nodeCount).fill().map(() => Array(nodeCount).fill(0));
}

// Initial setup
initializeMatrix();

// Initial connections - cycle graph
function initializeCycleGraph() {
    // Clear the matrix first
    initializeMatrix();
    
    // Create a cycle graph
    for (let i = 0; i < nodeCount; i++) {
        adjacencyMatrix[i][(i + 1) % nodeCount] = 1;
    }
}

// Complete graph
function initializeCompleteGraph() {
    initializeMatrix();
    for (let i = 0; i < nodeCount; i++) {
        for (let j = 0; j < nodeCount; j++) {
            adjacencyMatrix[i][j] = i !== j ? 1 : 0; // All connections except self-loops
        }
    }
}

// Random graph
function initializeRandomGraph() {
    initializeMatrix();
    for (let i = 0; i < nodeCount; i++) {
        for (let j = 0; j < nodeCount; j++) {
            // Include possibility of self-loops
            adjacencyMatrix[i][j] = Math.random() > 0.7 ? 1 : 0;
        }
    }
}

// Reset to empty graph
function resetGraph() {
    initializeMatrix();
}

// Create the matrix visualization
function createMatrix() {
    const table = document.getElementById('matrix');
    table.innerHTML = '';
    
    // Add row for node labels
    const headerRow = document.createElement('tr');
    headerRow.appendChild(document.createElement('th')); // Empty corner cell
    
    for (let i = 0; i < nodeCount; i++) {
        const th = document.createElement('th');
        th.textContent = `${i+1}`;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);
    
    // Create matrix rows
    for (let i = 0; i < nodeCount; i++) {
        const row = document.createElement('tr');
        
        // Add node label for this row
        const label = document.createElement('th');
        label.textContent = `${i+1}`;
        row.appendChild(label);
        
        for (let j = 0; j < nodeCount; j++) {
            const cell = document.createElement('td');
            cell.className = 'matrix-cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.dataset.value = adjacencyMatrix[i][j];
            
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'matrix-input';
            input.value = adjacencyMatrix[i][j];
            input.readOnly = true;
            
            cell.appendChild(input);
            row.appendChild(cell);
            
            // Add click event
            cell.addEventListener('click', () => {
                adjacencyMatrix[i][j] = adjacencyMatrix[i][j] === 0 ? 1 : 0;
                input.value = adjacencyMatrix[i][j];
                cell.dataset.value = adjacencyMatrix[i][j];
                updateGraph();
            });
        }
        
        table.appendChild(row);
    }
}

// Create the graph visualization
function createGraph() {
    const svg = d3.select('#graph');
    svg.selectAll('*').remove();
    
    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;
    const radius = Math.min(width, height) / 3;
    
    // Calculate node positions in a circle
    const nodes = Array(nodeCount).fill().map((_, i) => {
        const angle = (i / nodeCount) * 2 * Math.PI - Math.PI/2; // Start from top
        return {
            id: i,
            x: width/2 + radius * Math.cos(angle),
            y: height/2 + radius * Math.sin(angle)
        };
    });
    
    // Create links from the adjacency matrix
    const links = [];
    for (let i = 0; i < nodeCount; i++) {
        for (let j = 0; j < nodeCount; j++) {
            if (adjacencyMatrix[i][j] === 1) {
                links.push({
                    source: nodes[i],
                    target: nodes[j],
                    sourceId: i,
                    targetId: j
                });
            }
        }
    }
    
    // Define arrow marker for directed edges
    svg.append('defs').append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 25) // Position the arrow properly
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', '#00ff88');
    
    // Add curved links (edges)
    svg.selectAll('.link')
        .data(links)
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', d => {
            // If it's a self-loop
            if (d.sourceId === d.targetId) {
                // Create a loop above the node
                const loopSize = 20;
                const x = d.source.x;
                const y = d.source.y - 16; // Start at the top of the node
                return `M${x},${y} C${x-loopSize},${y-loopSize} ${x+loopSize},${y-loopSize} ${x},${y}`;
            }
            
            // If there are edges in both directions, curve them
            const isBidirectional = adjacencyMatrix[d.targetId][d.sourceId] === 1;
            const dx = d.target.x - d.source.x;
            const dy = d.target.y - d.source.y;
            const dr = isBidirectional ? Math.sqrt(dx * dx + dy * dy) * 1.5 : 0;
            
            if (dr === 0) {
                return `M${d.source.x},${d.source.y} L${d.target.x},${d.target.y}`;
            } else {
                return `M${d.source.x},${d.source.y} A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
            }
        })
        .attr('stroke', '#00ff88')
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .attr('marker-end', function(d) {
            // Don't add arrow for self-loops since they're already circular
            return d.sourceId === d.targetId ? '' : 'url(#arrow)';
        });
    
    // Add node circles
    svg.selectAll('.node')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('class', 'node')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 16)
        .attr('fill', '#101216')
        .attr('stroke', '#00ff88')
        .attr('stroke-width', 2);
    
    // Add node labels
    svg.selectAll('.node-label')
        .data(nodes)
        .enter()
        .append('text')
        .attr('class', 'node-label')
        .attr('x', d => d.x)
        .attr('y', d => d.y + 5)
        .attr('text-anchor', 'middle')
        .text(d => d.id + 1)
        .attr('fill', '#00ff88')
        .attr('font-weight', 'bold')
        .attr('font-size', '14px');
}

// Update the graph based on matrix changes
function updateGraph() {
    createGraph();
    updateMatrix();
}

// Update matrix display
function updateMatrix() {
    const cells = document.querySelectorAll('.matrix-cell');
    cells.forEach(cell => {
        const i = parseInt(cell.dataset.row);
        const j = parseInt(cell.dataset.col);
        cell.querySelector('input').value = adjacencyMatrix[i][j];
        cell.dataset.value = adjacencyMatrix[i][j];
    });
}

// Change node count and rebuild visualizations
function changeNodeCount(newCount) {
    // Save current connections if possible
    const oldMatrix = adjacencyMatrix.slice();
    
    // Update node count
    nodeCount = newCount;
    
    // Initialize new matrix
    initializeMatrix();
    
    // Copy over existing connections where possible
    for (let i = 0; i < Math.min(oldMatrix.length, nodeCount); i++) {
        for (let j = 0; j < Math.min(oldMatrix[i].length, nodeCount); j++) {
            adjacencyMatrix[i][j] = oldMatrix[i][j];
        }
    }
    
    // Update the display
    createMatrix();
    createGraph();
    
    // Update the node count display
    document.getElementById('node-count').textContent = nodeCount;
}

// Initialize visualizations
document.addEventListener('DOMContentLoaded', () => {
    // Set initial graph structure
    initializeCycleGraph();
    
    // Create visualizations
    createMatrix();
    createGraph();
    
    // Add event listeners for control buttons
    document.getElementById('reset').addEventListener('click', () => {
        resetGraph();
        updateGraph();
    });
    
    document.getElementById('random').addEventListener('click', () => {
        initializeRandomGraph();
        updateGraph();
    });
    
    document.getElementById('complete').addEventListener('click', () => {
        initializeCompleteGraph();
        updateGraph();
    });
    
    document.getElementById('cycle').addEventListener('click', () => {
        initializeCycleGraph();
        updateGraph();
    });
    
    // Add event listener for node count slider
    const nodeSlider = document.getElementById('node-slider');
    nodeSlider.addEventListener('input', () => {
        const newNodeCount = parseInt(nodeSlider.value);
        document.getElementById('node-count').textContent = newNodeCount;
    });
    
    nodeSlider.addEventListener('change', () => {
        const newNodeCount = parseInt(nodeSlider.value);
        changeNodeCount(newNodeCount);
    });
});