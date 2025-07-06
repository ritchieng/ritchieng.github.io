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

// Enhanced explanation system with core agent patterns
const agentPatternExplanations = {
  'orchestrator': {
    title: 'Orchestrator Agent',
    color: '#00ff88',
    description: 'The main coordination agent that receives input and manages the overall workflow.',
    patterns: [
      'Receives and analyzes user requests',
      'Coordinates between different system components',
      'Manages task delegation and response aggregation',
      'Implements feedback loops for continuous improvement'
    ]
  },
  'safety': {
    title: 'Safety Guardrails',
    color: '#ffa500',
    description: 'Input and output filtering to ensure safe and compliant responses.',
    patterns: [
      'Content filtering for harmful or inappropriate material',
      'Policy compliance validation',
      'Security threat detection',
      'Regulatory requirement enforcement'
    ]
  },
  'validation': {
    title: 'LLM Judge',
    color: '#9333ea',
    description: 'AI-powered evaluation of quality, accuracy, and appropriateness.',
    patterns: [
      'Response quality assessment',
      'Factual accuracy verification',
      'Logical consistency checking',
      'Intent validation and alignment'
    ]
  },
  'reasoning': {
    title: 'Reasoning Agent',
    color: '#3b82f6',
    description: 'Complex problem-solving and multi-step reasoning capabilities.',
    patterns: [
      'Multi-step planning and execution',
      'Context-aware decision making',
      'Problem decomposition and analysis',
      'Strategic thinking and optimization'
    ]
  },
  'execution': {
    title: 'Tool Execution',
    color: '#64748b',
    description: 'Integration with external tools, APIs, and system capabilities.',
    patterns: [
      'Project-specific tool integration',
      'General-purpose utility functions',
      'External API and database connections',
      'Error handling and retry mechanisms'
    ]
  },
  'human': {
    title: 'Human Oversight',
    color: '#f59e0b',
    description: 'Human-in-the-loop for critical decisions and continuous improvement.',
    patterns: [
      'Human-in-the-loop (pre-approval for critical decisions)',
      'Human-in-the-loop (feedback and intervention)',
      'Human-on-the-loop (oversight and monitoring)',
      'Quality assurance and expert review'
    ]
  }
};

// Demo control variables
let isRunning = false;
let currentDemo = null;
let currentHandover = -1;
let flowHandovers = [
  { from: 'agent1', to: 'input_guardrail', agent: 'agent1', status: 'active', message: 'Agent 1: Received user input, analyzing request' },
  { from: 'agent1', to: 'input_guardrail', agent: 'input_guardrail', status: 'processing', message: 'Input Guardrail: Checking for safety violations and blocked content' },
  { from: 'input_guardrail', to: 'input_judge', agent: 'input_judge', status: 'processing', message: 'Input LLM Judge: Validating request quality and intent' },
  { from: 'input_judge', to: 'agent2', agent: 'agent2', status: 'active', message: 'Agent 2: Processing approved request, planning solution' },
  { from: 'agent2', to: 'tool_use', agent: 'tool_use', status: 'processing', message: 'Tool Use: Executing project-specific and utility tools' },
  { from: 'tool_use', to: 'output_guardrail', agent: 'output_guardrail', status: 'processing', message: 'Output Guardrail: Checking output for safety and policy compliance' },
  { from: 'output_guardrail', to: 'output_judge', agent: 'output_judge', status: 'processing', message: 'Output LLM Judge: Evaluating response quality and accuracy' },
  { from: 'output_judge', to: 'human_loop', agent: 'human_loop', status: 'processing', message: 'Human in Loop: Human review and feedback collection' },
  { from: 'human_loop', to: 'agent1', agent: 'agent1', status: 'processing', message: 'Feedback Loop: Human feedback integrated for continuous improvement' }
];

// Expanded handover details for the detailed explanation area
const handoverDetails = {
  0: {
    title: "User Input Reception & Analysis",
    description: "The orchestrator agent receives and performs initial analysis of user requests.",
    patterns: [
      "Input parsing and validation",
      "Request categorization and priority assessment",
      "Context gathering and session management",
      "Initial safety and format checks"
    ],
    bestPractices: [
      "Implement comprehensive input validation",
      "Log all incoming requests for audit trails",
      "Handle malformed inputs gracefully",
      "Set appropriate timeouts and rate limits"
    ]
  },
  1: {
    title: "Input Safety Guardrails",
    description: "Comprehensive safety filtering before processing begins.",
    patterns: [
      "Content filtering for harmful material",
      "Prompt injection detection",
      "PII and sensitive data identification",
      "Compliance with safety policies"
    ],
    bestPractices: [
      "Use multiple detection layers",
      "Maintain updated safety rule sets",
      "Provide clear rejection messages",
      "Log safety violations for analysis"
    ]
  },
  2: {
    title: "Input Quality Validation",
    description: "LLM-powered assessment of request quality and intent.",
    patterns: [
      "Intent classification and validation",
      "Quality scoring of input",
      "Ambiguity detection and clarification",
      "Context sufficiency assessment"
    ],
    bestPractices: [
      "Use specialized judge models",
      "Implement confidence thresholds",
      "Provide feedback for low-quality inputs",
      "Maintain evaluation consistency"
    ]
  },
  3: {
    title: "Reasoning & Problem Solving",
    description: "Complex multi-step reasoning and solution planning.",
    patterns: [
      "Problem decomposition strategies",
      "Multi-step planning and execution",
      "Context-aware decision making",
      "Solution optimization techniques"
    ],
    bestPractices: [
      "Break complex problems into manageable steps",
      "Implement reasoning checkpoints",
      "Use appropriate reasoning frameworks",
      "Document decision-making processes"
    ]
  },
  4: {
    title: "Tool Execution & Integration",
    description: "Coordinated execution of tools and external integrations.",
    patterns: [
      "Project-specific tool selection",
      "Parallel vs sequential execution",
      "Error handling and retry logic",
      "Result aggregation and synthesis"
    ],
    bestPractices: [
      "Implement robust error handling",
      "Use appropriate timeouts",
      "Cache frequently used results",
      "Monitor tool performance metrics"
    ]
  },
  5: {
    title: "Output Safety Validation",
    description: "Final safety checks before response delivery.",
    patterns: [
      "Content safety validation",
      "Bias detection and mitigation",
      "Factual accuracy verification",
      "Policy compliance checking"
    ],
    bestPractices: [
      "Apply consistent safety standards",
      "Use multiple validation approaches",
      "Implement fallback responses",
      "Track safety metric trends"
    ]
  },
  6: {
    title: "Output Quality Assessment",
    description: "Comprehensive quality evaluation of generated responses.",
    patterns: [
      "Response completeness evaluation",
      "Accuracy and relevance scoring",
      "Coherence and clarity assessment",
      "User satisfaction prediction"
    ],
    bestPractices: [
      "Use multiple quality dimensions",
      "Implement human-AI agreement metrics",
      "Continuous calibration of judges",
      "A/B test different quality thresholds"
    ]
  },
  7: {
    title: "Human Review & Oversight",
    description: "Human-in-the-loop validation and feedback collection.",
    patterns: [
      "Critical decision approval workflows",
      "Quality assurance sampling",
      "Feedback collection mechanisms",
      "Escalation and intervention protocols"
    ],
    bestPractices: [
      "Design efficient review interfaces",
      "Implement smart sampling strategies",
      "Provide clear decision guidelines",
      "Minimize human cognitive load"
    ]
  },
  8: {
    title: "Feedback Integration & Learning",
    description: "Continuous improvement through feedback loops.",
    patterns: [
      "Feedback categorization and analysis",
      "Performance metric updates",
      "Model fine-tuning triggers",
      "System adaptation mechanisms"
    ],
    bestPractices: [
      "Implement systematic feedback processing",
      "Use feedback for prompt optimization",
      "Track improvement metrics over time",
      "Balance automation with human insight"
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

// Enhanced explanation display with infinite scroll functionality
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
    
  // Update detailed handover information with better styling
  if (currentHandover >= 0 && handoverDetails[currentHandover]) {
    const detail = handoverDetails[currentHandover];
    detailsContainer.innerHTML = `
      <div style="background: linear-gradient(135deg, rgba(0, 255, 136, 0.15) 0%, rgba(0, 255, 136, 0.05) 100%); border: 1px solid #00ff88; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
        <h4 style="color: #00ff88; font-weight: bold; margin-bottom: 10px; font-size: 12px;">Handover ${currentHandover + 1}: ${detail.title}</h4>
        <p style="color: #ccc; font-size: 11px; margin-bottom: 12px; line-height: 1.5;">${detail.description}</p>
        
        <div style="margin-bottom: 12px; background: rgba(59, 130, 246, 0.1); padding: 10px; border-radius: 6px; border-left: 3px solid #3b82f6;">
          <div style="color: #3b82f6; font-weight: bold; font-size: 10px; margin-bottom: 6px; text-transform: uppercase;">⚙️ Core Patterns</div>
          ${detail.patterns.map(p => `<div style="color: #aaa; font-size: 10px; margin-left: 8px; margin-bottom: 3px; line-height: 1.3;">• ${p}</div>`).join('')}
        </div>
        
        <div style="background: rgba(245, 158, 11, 0.1); padding: 10px; border-radius: 6px; border-left: 3px solid #f59e0b;">
          <div style="color: #f59e0b; font-weight: bold; font-size: 10px; margin-bottom: 6px; text-transform: uppercase;">✨ Best Practices</div>
          ${detail.bestPractices.map(p => `<div style="color: #aaa; font-size: 10px; margin-left: 8px; margin-bottom: 3px; line-height: 1.3;">• ${p}</div>`).join('')}
        </div>
      </div>
    `;
    
    // Scroll details to top
    detailsContainer.scrollTop = 0;
  } else {
    detailsContainer.innerHTML = `
      <div style="text-align: center; color: #666; font-style: italic; padding: 30px; line-height: 1.6; background: rgba(255,255,255,0.02); border-radius: 8px; border: 1px dashed #333;">
        <div style="font-size: 24px; margin-bottom: 10px;">🚀</div>
        <div style="font-size: 12px; color: #888;">Click <strong style="color: #00ff88;">"Start Flow"</strong> and use <strong style="color: #00ff88;">"Next Handover"</strong> to see detailed explanations for each handover point.</div>
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
  
  logExplanation('System reset completed - All agents ready', 'info');
}

// Manual handover navigation
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
  
  // Update button text
  const nextBtn = document.getElementById('next-handover');
  if (currentHandover >= flowHandovers.length - 1) {
    nextBtn.textContent = 'Complete Flow';
  } else {
    nextBtn.textContent = `Next Handover (${currentHandover + 1}/${flowHandovers.length})`;
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
  
  logExplanation('Manual flow demonstration started - Use "Next Handover" to proceed', 'info');
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

// Utility function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  initializeVisualization();
  logExplanation('Simplified agent system initialized', 'success');
  
  // Updated button event listeners
  document.getElementById('start-demo').addEventListener('click', startDemo);
  document.getElementById('stop-demo').addEventListener('click', resetDemo);
  document.getElementById('next-handover').addEventListener('click', nextHandover);
  
  // Update metrics periodically
  setInterval(updateMetrics, 5000);
});