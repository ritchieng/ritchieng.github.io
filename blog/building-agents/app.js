// Simplified Agent System with single flow
let agentSystem = {
  agents: [
    {
      id: 'agent1',
      name: 'Agent 1',
      type: 'orchestrator',
      status: 'idle',
      position: { x: 200, y: 50 },
      color: '#00ff88'
    },
    {
      id: 'input_guardrail',
      name: 'Input Guardrail',
      type: 'safety',
      status: 'idle',
      position: { x: 200, y: 140 },
      color: '#ffa500'
    },
    {
      id: 'input_judge',
      name: 'Input LLM Judge',
      type: 'validation',
      status: 'idle',
      position: { x: 200, y: 230 },
      color: '#9333ea'
    },
    {
      id: 'agent2',
      name: 'Agent 2',
      type: 'reasoning',
      status: 'idle',
      position: { x: 200, y: 320 },
      color: '#3b82f6'
    },
    {
      id: 'tool_use',
      name: 'Tool Use',
      type: 'execution',
      status: 'idle',
      position: { x: 200, y: 410 },
      color: '#64748b'
    },
    {
      id: 'output_guardrail',
      name: 'Output Guardrail',
      type: 'safety',
      status: 'idle',
      position: { x: 200, y: 500 },
      color: '#ffa500'
    },
    {
      id: 'output_judge',
      name: 'Output LLM Judge',
      type: 'validation',
      status: 'idle',
      position: { x: 200, y: 590 },
      color: '#9333ea'
    },
    {
      id: 'human_loop',
      name: 'Human in Loop',
      type: 'human',
      status: 'monitoring',
      position: { x: 200, y: 680 },
      color: '#f59e0b'
    }
  ],
  connections: [
    { from: 'agent1', to: 'input_guardrail', type: 'input_flow' },
    { from: 'input_guardrail', to: 'input_judge', type: 'validation_flow' },
    { from: 'input_judge', to: 'agent2', type: 'approved_flow' },
    { from: 'agent2', to: 'tool_use', type: 'tool_request' },
    { from: 'tool_use', to: 'output_guardrail', type: 'result_flow' },
    { from: 'output_guardrail', to: 'output_judge', type: 'validation_flow' },
    { from: 'output_judge', to: 'human_loop', type: 'review_flow' },
    { from: 'human_loop', to: 'agent1', type: 'feedback_flow' }
  ],
  telemetryLogs: [],
  metrics: {
    taskSuccessRate: 87,
    responseQuality: 4.6,
    toolEfficiency: 2.3,
    humanInterventions: 12
  }
};

// Add missing global variables
let isRunning = false;
let currentHandover = -1;

// Add missing agent pattern explanations
const agentPatternExplanations = {
  orchestrator: {
    title: 'Orchestrator',
    color: '#00ff88',
    description: 'Manages workflow routing and coordinates agent interactions',
    patterns: [
      'Request routing based on content type and complexity',
      'Session state management across conversations',
      'Load balancing across agent instances',
      'Error handling and retry logic'
    ]
  },
  safety: {
    title: 'Safety Guardrails',
    color: '#ffa500',
    description: 'Filters harmful content and enforces safety policies',
    patterns: [
      'Content classification using ML models',
      'PII detection and redaction',
      'Prompt injection detection',
      'Policy-based content filtering'
    ]
  },
  validation: {
    title: 'LLM Judge',
    color: '#9333ea',
    description: 'Evaluates content quality and completeness',
    patterns: [
      'Quality scoring on multiple dimensions',
      'Completeness assessment',
      'Intent clarity evaluation',
      'Confidence scoring for decisions'
    ]
  },
  reasoning: {
    title: 'Reasoning Agent',
    color: '#3b82f6',
    description: 'Performs multi-step reasoning and problem solving',
    patterns: [
      'Chain-of-thought reasoning',
      'Problem decomposition',
      'Evidence gathering and synthesis',
      'Step-by-step logical processing'
    ]
  },
  execution: {
    title: 'Tool Execution',
    color: '#64748b',
    description: 'Executes tools and integrates external services',
    patterns: [
      'Tool selection based on requirements',
      'Parallel execution when possible',
      'Result aggregation and formatting',
      'Error handling and fallbacks'
    ]
  },
  human: {
    title: 'Human Oversight',
    color: '#f59e0b',
    description: 'Provides human review and quality control',
    patterns: [
      'Sample-based quality review',
      'Edge case escalation',
      'Feedback collection and labeling',
      'Performance monitoring'
    ]
  }
};

// Add missing flow handovers array
const flowHandovers = [
  {
    agent: 'agent1',
    from: null,
    to: 'input_guardrail',
    status: 'active',
    message: 'Orchestrator receives user input and initiates processing pipeline'
  },
  {
    agent: 'input_guardrail',
    from: 'agent1',
    to: 'input_judge',
    status: 'processing',
    message: 'Input guardrail validates content safety and filters harmful requests'
  },
  {
    agent: 'input_judge',
    from: 'input_guardrail',
    to: 'agent2',
    status: 'processing',
    message: 'LLM judge evaluates input quality and completeness'
  },
  {
    agent: 'agent2',
    from: 'input_judge',
    to: 'tool_use',
    status: 'processing',
    message: 'Reasoning agent processes request and determines tool requirements'
  },
  {
    agent: 'tool_use',
    from: 'agent2',
    to: 'output_guardrail',
    status: 'processing',
    message: 'Tool execution performs required actions and gathers results'
  },
  {
    agent: 'output_guardrail',
    from: 'tool_use',
    to: 'output_judge',
    status: 'processing',
    message: 'Output guardrail validates response safety and compliance'
  },
  {
    agent: 'output_judge',
    from: 'output_guardrail',
    to: 'human_loop',
    status: 'processing',
    message: 'Output judge assesses response quality and accuracy'
  },
  {
    agent: 'human_loop',
    from: 'output_judge',
    to: 'agent1',
    status: 'active',
    message: 'Human reviewer provides feedback and approves output'
  }
];

// Simplified color mapping
const agentColors = {
  'agent1': '#00ff88',
  'input_guardrail': '#ffa500',
  'input_judge': '#9333ea',
  'agent2': '#3b82f6',
  'tool_use': '#64748b',
  'output_guardrail': '#ffa500',
  'output_judge': '#9333ea',
  'human_loop': '#f59e0b'
};

// Expanded handover details with more technical depth
const handoverDetails = {
  0: {
    title: "User Input Reception & Analysis",
    description: "The orchestrator receives user requests and performs initial processing to understand intent and route appropriately.",
    patterns: [
      "Parse input format (text, JSON, multimodal)",
      "Extract user intent and context",
      "Validate input structure and content",
      "Route to appropriate processing pipeline",
      "Track session state and conversation history"
    ],
    bestPractices: [
      "Implement input validation and sanitization",
      "Use structured logging for request tracking",
      "Set up rate limiting to prevent abuse",
      "Cache common requests for performance",
      "Handle malformed inputs gracefully"
    ]
  },
  1: {
    title: "Input Safety Guardrails",
    description: "Safety systems analyze input for harmful content, policy violations, and potential security threats before processing.",
    patterns: [
      "Scan for harmful or inappropriate content",
      "Detect personally identifiable information (PII)",
      "Check for prompt injection attempts",
      "Apply content policy rules",
      "Flag suspicious patterns or anomalies"
    ],
    bestPractices: [
      "Use multiple detection methods for robustness",
      "Implement confidence thresholds for decisions",
      "Log safety decisions for audit trails",
      "Update safety rules based on new threats",
      "Provide clear feedback on policy violations"
    ]
  },
  2: {
    title: "Input Quality Validation",
    description: "Specialized models evaluate whether the input is clear, complete, and suitable for processing by downstream agents.",
    patterns: [
      "Assess request clarity and specificity",
      "Check for missing required information",
      "Evaluate task complexity and scope",
      "Determine processing requirements",
      "Score confidence in successful completion"
    ],
    bestPractices: [
      "Use consistent scoring criteria",
      "Provide helpful suggestions for improvement",
      "Track quality metrics over time",
      "Calibrate thresholds based on outcomes",
      "Handle edge cases with human review"
    ]
  },
  3: {
    title: "Reasoning & Problem Solving",
    description: "The reasoning agent breaks down complex problems, plans solution approaches, and determines what tools or information are needed.",
    patterns: [
      "Decompose complex problems into steps",
      "Plan sequence of actions needed",
      "Identify required tools and resources",
      "Consider multiple solution approaches",
      "Generate reasoning traces for transparency"
    ],
    bestPractices: [
      "Document reasoning steps clearly",
      "Validate assumptions and logic",
      "Consider alternative approaches",
      "Plan for error scenarios and recovery",
      "Keep reasoning focused and goal-oriented"
    ]
  },
  4: {
    title: "Tool Execution & Integration",
    description: "Execute the planned actions using available tools, handle errors, and aggregate results into a coherent response.",
    patterns: [
      "Select appropriate tools for each task",
      "Execute tools with proper parameters",
      "Handle tool failures and retries",
      "Aggregate results from multiple tools",
      "Format outputs for downstream processing"
    ],
    bestPractices: [
      "Implement proper error handling and timeouts",
      "Use async execution where possible",
      "Cache results to avoid redundant calls",
      "Monitor tool performance and reliability",
      "Have fallback options for critical tools"
    ]
  },
  5: {
    title: "Output Safety Validation",
    description: "Review generated outputs for safety issues, factual accuracy, and policy compliance before presenting to users.",
    patterns: [
      "Scan output for harmful content",
      "Check factual claims where possible",
      "Verify policy compliance",
      "Detect potential bias or unfairness",
      "Flag content requiring human review"
    ],
    bestPractices: [
      "Use multiple validation approaches",
      "Maintain updated safety guidelines",
      "Track and analyze safety incidents",
      "Implement graduated response levels",
      "Ensure transparency in safety decisions"
    ]
  },
  6: {
    title: "Output Quality Assessment",
    description: "Evaluate the quality, relevance, and completeness of generated responses before delivery to ensure user satisfaction.",
    patterns: [
      "Assess response relevance to the request",
      "Check completeness and thoroughness",
      "Evaluate clarity and coherence",
      "Verify factual accuracy where possible",
      "Score overall response quality"
    ],
    bestPractices: [
      "Use consistent quality criteria",
      "Collect user feedback for calibration",
      "Monitor quality trends over time",
      "Implement quality improvement loops",
      "Balance quality with response speed"
    ]
  },
  7: {
    title: "Human Review & Oversight",
    description: "Strategic human involvement for quality control, edge case handling, and continuous system improvement.",
    patterns: [
      "Sample responses for quality review",
      "Escalate edge cases and errors",
      "Collect feedback and annotations",
      "Monitor system performance metrics",
      "Update guidelines based on learnings"
    ],
    bestPractices: [
      "Focus human effort on high-impact areas",
      "Provide clear review guidelines",
      "Track reviewer agreement and consistency",
      "Use active learning to optimize sampling",
      "Create feedback loops for system improvement"
    ]
  }
};

// Enhanced Telemetry and Logging - renamed to explanation system
function logExplanation(message, type = 'info', agentId = null, category = null) {
  const timestamp = new Date().toLocaleTimeString();
  const logEntry = {
    timestamp,
    message,
    type,
    agentId,
    category
  };
  
  agentSystem.telemetryLogs.unshift(logEntry);
  if (agentSystem.telemetryLogs.length > 100) {
    agentSystem.telemetryLogs.pop();
  }
  
  updateExplanationDisplay();
}

// Enhanced explanation display with technical details
function updateExplanationDisplay() {
  const logsContainer = document.getElementById('explanation-logs');
  const detailsContainer = document.getElementById('handover-details');
  
  // Store scroll position before update
  const wasAtTop = logsContainer.scrollTop === 0;
  
  // Update current logs section with infinite scroll support
  const logsHtml = agentSystem.telemetryLogs
    .slice()
    .reverse() // Show newest first
    .map(log => {
      let indicatorColor = '#888';
      let categoryText = '';
      let patternDetails = '';
      
      if (log.agentId && agentColors[log.agentId]) {
        indicatorColor = agentColors[log.agentId];
        
        const agent = agentSystem.agents.find(a => a.id === log.agentId);
        if (agent && agentPatternExplanations[agent.type]) {
          const pattern = agentPatternExplanations[agent.type];
          categoryText = `<span style="color: ${pattern.color}; font-weight: bold;">[${pattern.title.toUpperCase()}]</span><br>`;
          patternDetails = `
            <div style="margin: 8px 0; padding: 8px; background: rgba(${hexToRgb(pattern.color)}, 0.1); border-left: 3px solid ${pattern.color}; border-radius: 4px;">
              <div style="color: ${pattern.color}; font-weight: bold; margin-bottom: 4px;">${pattern.description}</div>
              <div style="font-size: 10px; color: #ccc;">
                ${pattern.patterns.map(p => `• ${p}`).join('<br>')}
              </div>
            </div>
          `;
        }
      } else {
        switch (log.type) {
          case 'success': indicatorColor = '#00ff88'; break;
          case 'warning': indicatorColor = '#ffa500'; break;
          case 'error': indicatorColor = '#ff4444'; break;
          case 'thinking': indicatorColor = '#9333ea'; break;
          case 'info': indicatorColor = '#3b82f6'; break;
        }
      }
      
      return `<div class="explanation-log explanation-${log.type}">
        <span class="explanation-agent-indicator" style="background-color: ${indicatorColor}"></span>
        <div style="flex: 1;">
          ${categoryText}
          <div style="color: #ccc; font-size: 11px; margin-bottom: 4px;">[${log.timestamp}] ${log.message}</div>
          ${patternDetails}
        </div>
      </div>`;
    })
    .join('');
    
  logsContainer.innerHTML = logsHtml;
  
  // Always scroll to top for new activities (most recent first)
  logsContainer.scrollTop = 0;
    
  // Update detailed handover information with enhanced technical content
  if (currentHandover >= 0 && handoverDetails[currentHandover]) {
    const detail = handoverDetails[currentHandover];
    const handover = flowHandovers[currentHandover];
    const agentColor = agentColors[handover.agent] || '#00ff88';
    const agentColorRgb = hexToRgb(agentColor);
    
    detailsContainer.innerHTML = `
      <div style="background: linear-gradient(135deg, rgba(${agentColorRgb}, 0.15) 0%, rgba(${agentColorRgb}, 0.05) 100%); border: 1px solid ${agentColor}; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
        <h4 style="color: ${agentColor}; font-weight: bold; margin-bottom: 10px; font-size: 12px;">Handover ${currentHandover + 1}: ${detail.title}</h4>
        <p style="color: #ccc; font-size: 11px; margin-bottom: 12px; line-height: 1.5;">${detail.description}</p>
        
        <div style="margin-bottom: 12px; background: rgba(${agentColorRgb}, 0.1); padding: 10px; border-radius: 6px; border-left: 3px solid ${agentColor};">
          <div style="color: ${agentColor}; font-weight: bold; font-size: 10px; margin-bottom: 6px; text-transform: uppercase;">⚙️ Core Patterns</div>
          ${detail.patterns.map(p => `<div style="color: #aaa; font-size: 10px; margin-left: 8px; margin-bottom: 3px; line-height: 1.3;">• ${p}</div>`).join('')}
        </div>
        
        <div style="background: rgba(${agentColorRgb}, 0.1); padding: 10px; border-radius: 6px; border-left: 3px solid ${agentColor};">
          <div style="color: ${agentColor}; font-weight: bold; font-size: 10px; margin-bottom: 6px; text-transform: uppercase;">✨ Best Practices</div>
          ${detail.bestPractices.map(p => `<div style="color: #aaa; font-size: 10px; margin-left: 8px; margin-bottom: 3px; line-height: 1.3;">• ${p}</div>`).join('')}
        </div>
      </div>
    `;
    
    detailsContainer.scrollTop = 0;
  } else {
    detailsContainer.innerHTML = `
      <div style="text-align: center; color: #666; font-style: italic; padding: 30px; line-height: 1.6; background: rgba(255,255,255,0.02); border-radius: 8px; border: 1px dashed #333;">
        <div style="font-size: 12px; color: #888;">Click <strong style="color: #00ff88;">"Start Flow"</strong> and use navigation buttons to explore detailed technical explanations for each handover point.</div>
      </div>
    `;
  }
}

// Utility function to convert hex to rgb
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
    '255, 255, 255';
}

// Improved SVG Visualization with proper arrow positioning and fixed human loop positioning
function initializeVisualization() {
  const svg = d3.select('#agent-flow-svg');
  svg.selectAll('*').remove();
  
  svg.attr('height', 800);
  
  // Enhanced gradient definitions
  const defs = svg.append('defs');
  
  // Create gradients for each agent type
  Object.entries(agentColors).forEach(([agentId, color]) => {
    const gradient = defs.append('linearGradient')
      .attr('id', `gradient-${agentId}`)
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '100%').attr('y2', '100%');
    
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', color)
      .attr('stop-opacity', 0.8);
    
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', color)
      .attr('stop-opacity', 0.3);
  });
  
  // Enhanced arrow markers with glow effect
  ['normal', 'active'].forEach(type => {
    const marker = defs.append('marker')
      .attr('id', `arrowhead-${type}`)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 9)
      .attr('refY', 0)
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .attr('orient', 'auto');
    
    if (type === 'active') {
      // Add glow filter for active arrows
      const filter = defs.append('filter')
        .attr('id', 'glow-arrow')
        .attr('x', '-50%').attr('y', '-50%')
        .attr('width', '200%').attr('height', '200%');
      
      filter.append('feGaussianBlur')
        .attr('stdDeviation', '3')
        .attr('result', 'coloredBlur');
      
      const feMerge = filter.append('feMerge');
      feMerge.append('feMergeNode').attr('in', 'coloredBlur');
      feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
      
      marker.attr('filter', 'url(#glow-arrow)');
    }
    
    marker.append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', type === 'active' ? '#00ff88' : '#666')
      .attr('stroke', type === 'active' ? '#00ff88' : 'none')
      .attr('stroke-width', type === 'active' ? 1 : 0);
  });

  // Calculate proper connection points for vertical layout
  function getConnectionPoints(fromAgent, toAgent) {
    const fromX = fromAgent.position.x + 80; // center of from box
    const fromY = fromAgent.position.y + 35;
    const toX = toAgent.position.x + 80; // center of to box  
    const toY = toAgent.position.y + 35;
    
    // Special handling for feedback loop (curved arrow)
    if (fromAgent.id === 'human_loop' && toAgent.id === 'agent1') {
      return {
        fromEdgeX: fromX + 60,
        fromEdgeY: fromY,
        toEdgeX: toX + 60,
        toEdgeY: toY,
        curved: true
      };
    }
    
    // Vertical connections (from bottom to top)
    return {
      fromEdgeX: fromX,
      fromEdgeY: fromAgent.position.y + 70, // bottom edge
      toEdgeX: toX,
      toEdgeY: toAgent.position.y, // top edge
      curved: false
    };
  }
  
  // Draw connections with vertical layout
  const connections = svg.selectAll('.connection')
    .data(agentSystem.connections)
    .enter()
    .append('g')
    .attr('class', d => `connection connection-${d.type}`);
  
  connections.each(function(d) {
    const fromAgent = agentSystem.agents.find(a => a.id === d.from);
    const toAgent = agentSystem.agents.find(a => a.id === d.to);
    const points = getConnectionPoints(fromAgent, toAgent);
    
    if (points.curved) {
      // Create curved path for feedback loop
      const path = d3.select(this).append('path')
        .attr('d', `M ${points.fromEdgeX} ${points.fromEdgeY} 
                   C ${points.fromEdgeX + 100} ${points.fromEdgeY} 
                     ${points.toEdgeX + 100} ${points.toEdgeY} 
                     ${points.toEdgeX} ${points.toEdgeY}`)
        .attr('stroke', '#444')
        .attr('stroke-width', 2)
        .attr('stroke-opacity', 0.7)
        .attr('fill', 'none')
        .attr('marker-end', 'url(#arrowhead-normal)');
    } else {
      // Straight vertical lines
      d3.select(this).append('line')
        .attr('x1', points.fromEdgeX)
        .attr('y1', points.fromEdgeY)
        .attr('x2', points.toEdgeX)
        .attr('y2', points.toEdgeY)
        .attr('stroke', '#444')
        .attr('stroke-width', 2)
        .attr('stroke-opacity', 0.7)
        .attr('marker-end', 'url(#arrowhead-normal)');
    }
  });
  
  // Enhanced agent groups with better positioning
  const agentGroups = svg.selectAll('.agent-group')
    .data(agentSystem.agents)
    .enter()
    .append('g')
    .attr('class', 'agent-group')
    .attr('transform', d => `translate(${d.position.x}, ${d.position.y})`);
  
  // Enhanced agent rectangles with gradients and shadows
  agentGroups.append('rect')
    .attr('width', 160)
    .attr('height', 70)
    .attr('rx', 12)
    .attr('fill', d => `url(#gradient-${d.id})`)
    .attr('stroke', d => d.color)
    .attr('stroke-width', 2)
    .attr('class', d => `agent-rect agent-${d.id}`)
    .style('filter', 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))');
  
  // Enhanced agent names with better typography
  agentGroups.append('text')
    .attr('x', 80)
    .attr('y', 28)
    .attr('text-anchor', 'middle')
    .attr('fill', d => d.color)
    .attr('font-size', 13)
    .attr('font-weight', 'bold')
    .attr('font-family', 'monospace')
    .text(d => d.name);
  
  // Enhanced type labels
  agentGroups.append('text')
    .attr('x', 80)
    .attr('y', 45)
    .attr('text-anchor', 'middle')
    .attr('fill', '#aaa')
    .attr('font-size', 9)
    .attr('font-family', 'monospace')
    .attr('font-style', 'italic')
    .text(d => d.type.toUpperCase());
  
  // Enhanced status indicators with pulsing animation
  agentGroups.append('circle')
    .attr('cx', 140)
    .attr('cy', 20)
    .attr('r', 7)
    .attr('fill', d => d.color)
    .attr('opacity', 0.6)
    .attr('class', d => `status-indicator status-${d.id}`)
    .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))');
}

// Enhanced flow animation with curved path support
function animateFlow(fromId, toId, persistent = false, duration = 1000) {
  const connection = d3.selectAll('.connection')
    .filter(function(d) {
      return d.from === fromId && d.to === toId;
    });
  
  if (persistent) {
    // Keep the arrow green and dotted
    connection.selectAll('line, path')
      .attr('stroke', '#00ff88')
      .attr('stroke-width', 3)
      .attr('marker-end', 'url(#arrowhead-active)')
      .style('stroke-dasharray', '8,4')
      .style('stroke-dashoffset', 0);
  } else {
    connection.selectAll('line, path')
      .attr('stroke', '#00ff88')
      .attr('stroke-width', 3)
      .attr('marker-end', 'url(#arrowhead-active)')
      .style('stroke-dasharray', '8,4')
      .style('stroke-dashoffset', 0)
      .transition()
      .duration(duration)
      .style('stroke-dashoffset', 12)
      .on('end', () => {
        connection.selectAll('line, path')
          .attr('stroke', '#444')
          .attr('stroke-width', 2)
          .attr('marker-end', 'url(#arrowhead-normal)')
          .style('stroke-dasharray', 'none');
      });
  }
}

function resetDemo() {
  isRunning = false;
  currentHandover = -1;
  
  // Reset all agent statuses
  agentSystem.agents.forEach(agent => {
    if (agent.type === 'human') {
      updateAgentStatus(agent.id, 'monitoring');
    } else {
      updateAgentStatus(agent.id, 'idle');
    }
  });
  
  // Clear active flows for both line and path elements
  d3.selectAll('.connection')
    .selectAll('line, path')
    .attr('stroke', '#444')
    .attr('stroke-width', 2)
    .attr('marker-end', 'url(#arrowhead-normal)')
    .style('stroke-dasharray', 'none');
  
  // Clear logs
  agentSystem.telemetryLogs = [];
  updateExplanationDisplay();
  
  // Reset button states
  document.getElementById('start-demo').textContent = 'Start Flow';
  document.getElementById('start-demo').disabled = false;
  document.getElementById('next-handover').textContent = 'Next Handover';
  document.getElementById('next-handover').disabled = true;
  document.getElementById('prev-handover').textContent = 'Prev Handover';
  document.getElementById('prev-handover').disabled = true;
  
  logExplanation('System reset completed - All agents ready', 'info');
}

// Manual handover navigation with backwards capability
function nextHandover() {
  if (currentHandover >= flowHandovers.length - 1) {
    logExplanation('Complete flow cycle finished successfully', 'success');
    resetDemo();
    return;
  }
  
  currentHandover++;
  const handover = flowHandovers[currentHandover];
  
  // Reset previous agent if not first handover
  if (currentHandover > 0) {
    const prevHandover = flowHandovers[currentHandover - 1];
    updateAgentStatus(prevHandover.agent, 'idle');
  }
  
  // Animate flow and update current agent - keep previous arrows active
  if (currentHandover > 0) {
    animateFlow(handover.from, handover.to, true); // persistent flow
  }
  updateAgentStatus(handover.agent, handover.status);
  logExplanation(handover.message, handover.status === 'active' ? 'info' : 'warning', handover.agent);
  
  updateNavigationButtons();
}

function prevHandover() {
  if (currentHandover <= 0) return;
  
  // Reset current agent
  const currentHandoverData = flowHandovers[currentHandover];
  updateAgentStatus(currentHandoverData.agent, 'idle');
  
  currentHandover--;
  
  if (currentHandover >= 0) {
    const handover = flowHandovers[currentHandover];
    updateAgentStatus(handover.agent, handover.status);
    
    // Clear all flows and re-draw up to current handover
    d3.selectAll('.connection')
      .selectAll('line, path')
      .attr('stroke', '#444')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowhead-normal)')
      .style('stroke-dasharray', 'none');
    
    // Re-animate flows up to current position
    for (let i = 0; i <= currentHandover; i++) {
      if (i > 0) {
        const step = flowHandovers[i];
        animateFlow(step.from, step.to, true);
      }
    }
    
    logExplanation(`Navigated back to: ${handover.message}`, 'info', handover.agent);
  }
  
  updateNavigationButtons();
}

function updateNavigationButtons() {
  const nextBtn = document.getElementById('next-handover');
  const prevBtn = document.getElementById('prev-handover');
  
  // Update next button
  if (currentHandover >= flowHandovers.length - 1) {
    nextBtn.textContent = 'Complete Flow';
  } else {
    nextBtn.textContent = `Next Handover (${currentHandover + 1}/${flowHandovers.length})`;
  }
  
  // Update prev button
  prevBtn.disabled = currentHandover <= 0;
  if (currentHandover > 0) {
    prevBtn.textContent = `Prev Handover (${currentHandover}/${flowHandovers.length})`;
  } else {
    prevBtn.textContent = 'Prev Handover';
  }
}

// Modified start demo function
async function startDemo() {
  if (isRunning) return;
  
  isRunning = true;
  currentHandover = -1;
  document.getElementById('start-demo').textContent = 'Running...';
  document.getElementById('start-demo').disabled = true;
  document.getElementById('next-handover').disabled = false;
  document.getElementById('prev-handover').disabled = true;
  
  logExplanation('Manual flow demonstration started - Use navigation buttons to explore handovers', 'info');
}

// Simplified agent status updates
function updateAgentStatus(agentId, status) {
  const agent = agentSystem.agents.find(a => a.id === agentId);
  if (agent) {
    agent.status = status;
    
    const statusIndicator = d3.select(`.status-${agentId}`);
    const agentRect = d3.select(`.agent-${agentId}`);
    
    switch (status) {
      case 'active':
        statusIndicator.attr('opacity', 1);
        agentRect.attr('stroke-width', 3)
          .attr('fill-opacity', 0.4);
        break;
      case 'processing':
        statusIndicator.attr('opacity', 1);
        agentRect.attr('stroke-width', 3)
          .attr('fill-opacity', 0.3);
        break;
      default:
        statusIndicator.attr('opacity', 0.6);
        agentRect.attr('stroke-width', 2)
          .attr('fill-opacity', 0.2);
    }
  }
}

// Add missing updateMetrics function
function updateMetrics() {
  // Simulate metric updates
  agentSystem.metrics.taskSuccessRate += Math.random() * 2 - 1;
  agentSystem.metrics.responseQuality += Math.random() * 0.2 - 0.1;
  agentSystem.metrics.toolEfficiency += Math.random() * 0.1 - 0.05;
  agentSystem.metrics.humanInterventions += Math.random() > 0.9 ? 1 : 0;
  
  // Keep metrics in reasonable ranges
  agentSystem.metrics.taskSuccessRate = Math.max(80, Math.min(95, agentSystem.metrics.taskSuccessRate));
  agentSystem.metrics.responseQuality = Math.max(3.0, Math.min(5.0, agentSystem.metrics.responseQuality));
  agentSystem.metrics.toolEfficiency = Math.max(1.0, Math.min(5.0, agentSystem.metrics.toolEfficiency));
}

// Utility function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  initializeVisualization();
  logExplanation('Advanced agent system initialized with full technical stack', 'success');
  
  // Updated button event listeners
  document.getElementById('start-demo').addEventListener('click', startDemo);
  document.getElementById('stop-demo').addEventListener('click', resetDemo);
  document.getElementById('next-handover').addEventListener('click', nextHandover);
  document.getElementById('prev-handover').addEventListener('click', prevHandover);
  
  // Update metrics periodically
  setInterval(updateMetrics, 5000);
});