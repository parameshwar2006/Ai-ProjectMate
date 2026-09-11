import db from '../db/database.js';

export interface GeneratedProjectIdea {
  title: string;
  domain: string;
  problemStatement: string;
  proposedSolution: string;
  keyFeatures: string[];
  requiredHardware: string;
  softwareStack: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  durationWeeks: number;
  teamRoles: { role: string; responsibilities: string }[];
  roadmap: { phase: number; phaseName: string; description: string; tasks: string[] }[];
}

export interface RoadmapPhase {
  phaseNumber: number;
  phaseName: string;
  description: string;
  targetDeadline: string;
  tasks: { title: string; isCompleted: boolean; suggestedDeadline: string }[];
}

export const aiService = {
  /**
   * AI Project Generator - Synthesizes comprehensive structured project architecture
   */
  generateProjectIdea(promptText: string): GeneratedProjectIdea {
    const p = promptText.toLowerCase();

    if (p.includes('iot') || p.includes('esp32') || p.includes('sensor') || p.includes('hardware')) {
      return {
        title: 'EdgePulse: Industrial IoT Vibration & Acoustic Telemetry Network',
        domain: 'IoT',
        problemStatement: 'Factory rotary machinery undergoes catastrophic mechanical failure due to undetected bearing wear and high vibration harmonics, causing expensive downtime.',
        proposedSolution: 'A distributed edge computing network using ESP32-S3 microcontrollers and MEMS accelerometers that extracts fast Fourier transform (FFT) vibration spectrums locally and streams anomaly alerts over MQTT to a real-time Next.js dashboard.',
        keyFeatures: [
          'High-rate 1.6kHz accelerometer sampling via SPI bus',
          'Edge FFT spectral peak detection on ESP32 dual-core Xtensa processor',
          'Secure TLS MQTT telemetry transmission to AWS IoT Core broker',
          'Interactive 3D mechanical health twin in React with Three.js',
          'Automated predictive maintenance alert webhooks to Telegram/Slack',
        ],
        requiredHardware: 'ESP32-S3 DevKit, ADXL345 3-Axis Digital Accelerometer, INMP441 I2S MEMS Microphone, LiFePO4 Battery with Solar Charge Controller',
        softwareStack: ['ESP32', 'C++', 'FreeRTOS', 'MQTT', 'React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
        difficulty: 'intermediate',
        durationWeeks: 10,
        teamRoles: [
          { role: 'Firmware & DSP Lead', responsibilities: 'FreeRTOS task scheduling, SPI sensor drivers, and on-chip FFT peak computation.' },
          { role: 'Cloud & Telemetry Engineer', responsibilities: 'MQTT broker configuration, PostgreSQL time-series hypertable setup, and REST APIs.' },
          { role: 'Frontend & UI/UX Architect', responsibilities: 'Real-time telemetry charts, FFT waterfall plots, and responsive device controls.' },
          { role: 'Hardware & Enclosure Specialist', responsibilities: 'Power circuit design, battery life optimization, and IP67 industrial enclosure CAD.' },
        ],
        roadmap: [
          { phase: 1, phaseName: 'Research', description: 'Evaluate MEMS accelerometer noise floors and calibrate sampling frequencies.', tasks: ['Benchmark ADXL345 vs MPU6050 noise', 'Determine FreeRTOS task stack requirements'] },
          { phase: 2, phaseName: 'Architecture', description: 'Design firmware state machines, MQTT JSON payload schemas, and DB schema.', tasks: ['Specify MQTT topic taxonomy', 'Design PostgreSQL hypertable for vibration metrics'] },
          { phase: 3, phaseName: 'Development', description: 'Implement C++ FreeRTOS firmware and Next.js telemetry dashboard.', tasks: ['Implement SPI DMA sensor polling', 'Build live SVG waterfall spectrum component'] },
          { phase: 4, phaseName: 'Integration', description: 'Connect edge devices to staging broker and verify end-to-end latency.', tasks: ['Validate end-to-end packet delivery', 'Simulate network jitter and offline buffer queue'] },
          { phase: 5, phaseName: 'Testing', description: 'Perform thermal stress testing and vibration shaker table calibration.', tasks: ['Run 48-hour continuous burn-in test', 'Verify emergency cut-off alert latency < 250ms'] },
          { phase: 6, phaseName: 'Deployment', description: 'Deploy prototypes across university machine shop drills and compile report.', tasks: ['Install 3 nodes in university workshop', 'Submit project report and video demo'] },
        ],
      };
    }

    if (p.includes('ai') || p.includes('ml') || p.includes('machine learning') || p.includes('vision') || p.includes('cv')) {
      return {
        title: 'RetinaGuard: Real-Time Diabetic Retinopathy Microaneurysm Detector',
        domain: 'AI/ML',
        problemStatement: 'Diabetic retinopathy is a leading cause of preventable blindness worldwide, yet access to specialized retinal fundus image screening remains scarce in rural clinics.',
        proposedSolution: 'A computer vision diagnostic platform using a fine-tuned EfficientNet-B4 convolutional neural network that detects microaneurysms and hemorrhages in fundus photos, with class activation heatmaps to support clinical diagnosis.',
        keyFeatures: [
          'High-resolution retinal vascular segmentation with U-Net',
          'Multi-class severity grading (Normal, Mild, Moderate, Severe, PDR)',
          'Grad-CAM explainable visual overlays highlighting pathological regions',
          'HIPAA-compliant web portal for ophthalmology triage',
          'Offline batch inference pipeline capable of running on edge laptops',
        ],
        requiredHardware: 'NVIDIA RTX 4080/4090 GPU or Google Colab Pro for model training',
        softwareStack: ['Python', 'PyTorch', 'Computer Vision', 'FastAPI', 'Next.js', 'Docker', 'PostgreSQL'],
        difficulty: 'advanced',
        durationWeeks: 12,
        teamRoles: [
          { role: 'Lead ML Researcher', responsibilities: 'Data augmentation pipeline, EfficientNet fine-tuning, and ROC-AUC optimization.' },
          { role: 'Computer Vision Engineer', responsibilities: 'Vessel segmentation U-Net, CLAHE image preprocessing, and Grad-CAM generation.' },
          { role: 'Full Stack Engineer', responsibilities: 'FastAPI model serving, DICOM/JPEG upload handling, and PostgreSQL storage.' },
          { role: 'Medical UI/UX Designer', responsibilities: 'Physician diagnostic portal, zoomable retinal canvas, and PDF report export.' },
        ],
        roadmap: [
          { phase: 1, phaseName: 'Research', description: 'Survey EyePACS and APTOS datasets, normalize lighting, and establish baseline models.', tasks: ['Curate balanced 15,000 fundus image dataset', 'Implement contrast-limited adaptive histogram equalization (CLAHE)'] },
          { phase: 2, phaseName: 'Architecture', description: 'Design dual-stream architecture (Segmentation + Classification) and inference API.', tasks: ['Define REST API contracts for diagnostic requests', 'Set up TensorRT model quantization pipeline'] },
          { phase: 3, phaseName: 'Development', description: 'Train neural networks and construct physician examination dashboard.', tasks: ['Fine-tune EfficientNet-B4 with focal loss', 'Build interactive pan-and-zoom fundus viewer in React'] },
          { phase: 4, phaseName: 'Integration', description: 'Package model in Docker container with sub-400ms inference on CPU/GPU.', tasks: ['Dockerize FastAPI backend', 'Test Grad-CAM heatmap alignment with ground truth annotations'] },
          { phase: 5, phaseName: 'Testing', description: 'Evaluate sensitivity and specificity against clinical benchmarks with 5-fold cross validation.', tasks: ['Run 5-fold cross validation test', 'Perform blind evaluation against ophthalmologist annotations'] },
          { phase: 6, phaseName: 'Deployment', description: 'Deploy web portal for clinical partner testing and author IEEE paper.', tasks: ['Deploy to staging server with SSL', 'Publish documentation and model cards'] },
        ],
      };
    }

    if (p.includes('security') || p.includes('cyber') || p.includes('network') || p.includes('rust')) {
      return {
        title: 'SentinelMesh: Zero-Trust Microsegmentation & eBPF Threat Sensor',
        domain: 'Cybersecurity',
        problemStatement: 'Modern distributed architectures suffer from lateral threat movement when attackers breach perimeter defenses, due to lack of granular east-west network visibility.',
        proposedSolution: 'A zero-trust kernel-space traffic monitor using Linux eBPF programs written in Rust (Aya) that enforces dynamic socket-level egress policies and spots stealthy port knocking and credential dumping.',
        keyFeatures: [
          'Zero-overhead packet inspection inside Linux kernel via eBPF XDP programs',
          'Automatic service topology mapping with dynamic flow graphs',
          'Real-time cryptographic mutual TLS identity attestation between pods',
          'Automated mitigation applying iptables and BPF map packet drops within 5ms',
          'Lightweight CLI utility with TUI visualization for security operations',
        ],
        requiredHardware: 'Linux Kernel 5.15+ development workstation or VPS',
        softwareStack: ['Rust', 'Go', 'Cybersecurity', 'Docker', 'Kubernetes', 'PostgreSQL'],
        difficulty: 'advanced',
        durationWeeks: 10,
        teamRoles: [
          { role: 'Kernel & eBPF Specialist', responsibilities: 'Compile BPF bytecode, attach kprobes/tracepoints, and manage lockless BPF ring buffers.' },
          { role: 'Systems Software Engineer', responsibilities: 'Build Rust daemon for userspace event consumption and security policy enforcement.' },
          { role: 'Security & Detection Engineer', responsibilities: 'Formulate threat detection heuristics for privilege escalation and C2 traffic.' },
          { role: 'Frontend & Operations Developer', responsibilities: 'Develop visual topology graph and security incident response timeline in React.' },
        ],
        roadmap: [
          { phase: 1, phaseName: 'Research', description: 'Study eBPF bytecode verifier limits and kernel tracepoint hooks.', tasks: ['Prototype simple sockops BPF filter', 'Evaluate Aya vs Cilium ebpf libraries'] },
          { phase: 2, phaseName: 'Architecture', description: 'Design BPF map schemas, ring buffers, and userspace RPC protocol.', tasks: ['Define security event protobuf schema', 'Design rate-limiting algorithm for audit log events'] },
          { phase: 3, phaseName: 'Development', description: 'Implement kernel probes, userspace dispatcher, and web console.', tasks: ['Write socket connection lifecycle tracker in Rust', 'Build live network topology map in React'] },
          { phase: 4, phaseName: 'Integration', description: 'Deploy on Kubernetes cluster and verify automated rule injection.', tasks: ['Run integration test inside Minikube', 'Verify sub-1% CPU overhead under 10Gbps traffic'] },
          { phase: 5, phaseName: 'Testing', description: 'Execute Red Team penetration testing and simulated DNS tunneling.', tasks: ['Simulate Cobalt Strike C2 beaconing', 'Verify zero false positive rate on benign traffic'] },
          { phase: 6, phaseName: 'Deployment', description: 'Publish open-source GitHub repository and submit to student security conference.', tasks: ['Draft documentation and setup guide', 'Record live attack demonstration video'] },
        ],
      };
    }

    // Default Fallback Generator for General Projects
    return {
      title: 'SynapseCollab: AI-Augmented Research & Knowledge Graph Platform',
      domain: 'Web Development',
      problemStatement: 'Undergraduate student research teams struggle to organize fragmented academic literature, connect related citations, and maintain synchronized task workflows.',
      proposedSolution: 'A collaborative web platform integrating PDF vector semantic search, interactive citation knowledge graphs, and real-time multiplayer markdown editing.',
      keyFeatures: [
        'Vector similarity search over uploaded arXiv and IEEE research papers',
        'Interactive 2D/3D citation force-directed graph with D3.js',
        'Real-time collaborative markdown notes using Yjs CRDTs',
        'AI paper summarizer and automatic bibtex citation exporter',
        'Integrated sprint task board and milestone deadline reminders',
      ],
      requiredHardware: 'Standard development environment',
      softwareStack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Redis', 'Tailwind CSS'],
      difficulty: 'intermediate',
      durationWeeks: 8,
      teamRoles: [
        { role: 'Full Stack Lead', responsibilities: 'Database schema, authentication, API routes, and deployment pipelines.' },
        { role: 'AI & Search Engineer', responsibilities: 'Document embedding pipeline, chunking, and vector cosine similarity search.' },
        { role: 'Frontend & Visualization Dev', responsibilities: 'D3.js graph visualization, markdown editor, and responsive SaaS UI.' },
        { role: 'Product & QA Specialist', responsibilities: 'User workflow testing, student usability interviews, and documentation.' },
      ],
      roadmap: [
        { phase: 1, phaseName: 'Research', description: 'Survey document embedding models and evaluate CRDT synchronization libraries.', tasks: ['Benchmark Yjs vs Automerge for multiplayer text', 'Compare pgvector vs ChromaDB for embeddings'] },
        { phase: 2, phaseName: 'Architecture', description: 'Design database relational schema, vector store, and REST/WebSocket APIs.', tasks: ['Draft PostgreSQL schema and indexes', 'Define WebSocket state synchronization protocol'] },
        { phase: 3, phaseName: 'Development', description: 'Build core application components, document ingestion, and graph views.', tasks: ['Build interactive D3.js citation graph component', 'Implement PDF text extractor and embedding worker'] },
        { phase: 4, phaseName: 'Integration', description: 'Connect frontend with vector store and verify live collaboration.', tasks: ['Wire real-time cursors into markdown editor', 'Verify sub-200ms semantic search queries'] },
        { phase: 5, phaseName: 'Testing', description: 'Conduct end-to-end tests and simulate concurrent multi-user editing.', tasks: ['Stress test with 25 concurrent typers on single document', 'Validate citation BibTeX accuracy'] },
        { phase: 6, phaseName: 'Deployment', description: 'Deploy to cloud staging environment and onboard initial student cohorts.', tasks: ['Configure CI/CD pipeline on GitHub Actions', 'Publish demo video and open-source guide'] },
      ],
    };
  },

  /**
   * AI Roadmap Generator - Creates or regenerates a 6-phase development roadmap
   */
  generateRoadmap(project: any): RoadmapPhase[] {
    const domain = (project.domain || 'Software').toLowerCase();
    const title = project.title || 'Project';

    const phases: RoadmapPhase[] = [
      {
        phaseNumber: 1,
        phaseName: 'Research & Discovery',
        description: `Survey state-of-the-art literature, review architectural benchmarks, and define functional requirements for ${title}.`,
        targetDeadline: 'Week 2',
        tasks: [
          { title: 'Define user requirements & project acceptance criteria', isCompleted: true, suggestedDeadline: 'Day 5' },
          { title: 'Benchmark relevant open-source libraries and hardware components', isCompleted: true, suggestedDeadline: 'Day 10' },
          { title: 'Draft technical design document (TDD) and risk matrix', isCompleted: false, suggestedDeadline: 'Day 14' },
        ],
      },
      {
        phaseNumber: 2,
        phaseName: 'Architecture & System Design',
        description: 'Design the relational database models, API contracts, communication protocols, and system block diagrams.',
        targetDeadline: 'Week 4',
        tasks: [
          { title: 'Formalize database schema, indexes, and entity relationships', isCompleted: false, suggestedDeadline: 'Day 18' },
          { title: 'Design REST/WebSocket API endpoints and payload validation schemas', isCompleted: false, suggestedDeadline: 'Day 22' },
          { title: 'Set up development environments, linting, and CI/CD pipelines', isCompleted: false, suggestedDeadline: 'Day 28' },
        ],
      },
      {
        phaseNumber: 3,
        phaseName: 'Core Feature Development',
        description: `Implement the foundational business logic, primary user workflows, and core ${domain} algorithms.`,
        targetDeadline: 'Week 7',
        tasks: [
          { title: 'Develop core backend services and state management controllers', isCompleted: false, suggestedDeadline: 'Day 35' },
          { title: 'Construct responsive frontend interfaces and data visualizations', isCompleted: false, suggestedDeadline: 'Day 42' },
          { title: 'Implement data persistence, caching, and error handling layers', isCompleted: false, suggestedDeadline: 'Day 49' },
        ],
      },
      {
        phaseNumber: 4,
        phaseName: 'Integration & Hardware/Cloud Sync',
        description: 'Connect disparate modules, wire edge devices to cloud brokers, and verify end-to-end telemetry flows.',
        targetDeadline: 'Week 9',
        tasks: [
          { title: 'Execute end-to-end integration between frontend, backend, and sensors/APIs', isCompleted: false, suggestedDeadline: 'Day 56' },
          { title: 'Validate data serialization, security handshakes, and rate limiting', isCompleted: false, suggestedDeadline: 'Day 60' },
          { title: 'Optimize network payload sizes and render performance', isCompleted: false, suggestedDeadline: 'Day 63' },
        ],
      },
      {
        phaseNumber: 5,
        phaseName: 'Testing & Stress Validation',
        description: 'Execute unit tests, automated integration suites, security checks, and load simulations.',
        targetDeadline: 'Week 11',
        tasks: [
          { title: 'Achieve >80% automated unit test coverage across critical paths', isCompleted: false, suggestedDeadline: 'Day 70' },
          { title: 'Perform edge-case stress validation under high concurrent load', isCompleted: false, suggestedDeadline: 'Day 74' },
          { title: 'Resolve discovered performance bottlenecks and UI regressions', isCompleted: false, suggestedDeadline: 'Day 77' },
        ],
      },
      {
        phaseNumber: 6,
        phaseName: 'Deployment & Final Documentation',
        description: 'Package containerized artifacts, publish project documentation, and present project demo to evaluators.',
        targetDeadline: 'Week 12',
        tasks: [
          { title: 'Deploy production release to staging cloud environment', isCompleted: false, suggestedDeadline: 'Day 80' },
          { title: 'Author IEEE-format project report, README, and API documentation', isCompleted: false, suggestedDeadline: 'Day 83' },
          { title: 'Record final demonstration video and conduct presentation review', isCompleted: false, suggestedDeadline: 'Day 84' },
        ],
      },
    ];

    return phases;
  },

  /**
   * AI Profile Summarizer
   */
  generateProfileSummary(data: { name: string; college: string; branch: string; skills: string[]; domains: string[]; prefRole: string }): string {
    const topSkills = data.skills.slice(0, 4).join(', ');
    const topDomains = data.domains.slice(0, 2).join(' & ');
    return `${data.branch} student at ${data.college} with demonstrated experience in ${topSkills || 'modern software engineering'}. Aspiring ${data.prefRole} focused on ${topDomains || 'cutting-edge projects'}, combining solid computer science fundamentals with rapid prototype execution.`;
  },

  /**
   * Project Copilot - Context-Aware Project Assistant
   */
  askProjectCopilot(projectId: number, userMessage: string): { response: string; promptAction?: string; metadata?: any } {
    const project = db.queryOne<any>('SELECT * FROM projects WHERE id = ?', [projectId]);
    if (!project) {
      return { response: "I couldn't locate the project details in the workspace database." };
    }

    // Gather project context
    const members = db.query<any>(
      `SELECT u.id, p.full_name, pm.role
       FROM project_members pm
       JOIN users u ON pm.user_id = u.id
       JOIN profiles p ON u.id = p.user_id
       WHERE pm.project_id = ?`,
      [projectId]
    );

    const skills = db.query<any>(
      `SELECT s.name FROM project_skills ps JOIN skills s ON ps.skill_id = s.id WHERE ps.project_id = ?`,
      [projectId]
    ).map((s: any) => s.name);

    const tasks = db.query<any>(
      'SELECT id, title, status, priority, assignee_id FROM tasks WHERE project_id = ?',
      [projectId]
    );

    const memberNames = members.map((m: any) => `${m.full_name} (${m.role})`).join(', ');
    const pendingTasks = tasks.filter((t: any) => t.status !== 'completed');
    const completedTasks = tasks.filter((t: any) => t.status === 'completed');
    const msg = userMessage.toLowerCase();

    // 1. "Divide this project into tasks for 4 members"
    if (msg.includes('divide') || msg.includes('break down') || msg.includes('assign tasks')) {
      return {
        response: `### 🎯 Recommended Task Breakdown for 4 Team Members

Based on **${project.title}** (${project.domain}) and your target software stack (${skills.join(', ')}), here is an equitable 4-way sprint delegation:

1. **Hardware / Core Systems Lead (${members[0]?.full_name || 'Member 1'}):**
   * Setup low-level device communication and protocol drivers.
   * Write firmware state machine with telemetry rate throttling.
   * Conduct breadboard wiring and power consumption benchmarks.

2. **Backend & Data Pipeline Lead (${members[1]?.full_name || 'Member 2'}):**
   * Design relational PostgreSQL schema and migration scripts.
   * Build authenticated REST/WebSocket endpoints for real-time telemetry.
   * Implement automated anomaly threshold detection and alert webhooks.

3. **Frontend & Telemetry UI Architect (${members[2]?.full_name || 'Member 3'}):**
   * Build responsive dashboard layout with dark theme and status indicators.
   * Implement real-time live data charts (Recharts/Chart.js) and device controls.
   * Create interactive team member roster and task tracking views.

4. **DevOps & QA Engineer (${members[3]?.full_name || 'Member 4'}):**
   * Configure Docker Compose multi-container staging environment.
   * Setup GitHub Actions CI pipeline for automated linting and test runs.
   * Execute load testing with simulated concurrent sensor streams.

Would you like me to automatically create these tasks on your Kanban board?`,
        promptAction: 'create_tasks_recommendation',
      };
    }

    // 2. "Why is our project behind schedule?"
    if (msg.includes('behind schedule') || msg.includes('schedule') || msg.includes('delay') || msg.includes('bottleneck')) {
      const urgentPending = pendingTasks.filter((t: any) => t.priority === 'urgent');
      return {
        response: `### ⏱️ Schedule Health & Bottleneck Diagnosis

**Project Status Overview:**
* **Overall Completion:** ${project.progress_pct}%
* **Tasks Remaining:** ${pendingTasks.length} pending / ${tasks.length} total (${completedTasks.length} completed)
* **Urgent Blockers:** ${urgentPending.length} high/urgent priority items

**Identified Risk Factors:**
1. **Critical Path Bottleneck:** ${urgentPending[0]?.title ? `"${urgentPending[0].title}" is marked as Urgent and is blocking downstream integration.` : 'High priority backlog items are awaiting assignment.'}
2. **Team Workload Imbalance:** Review member assignments—ensure firmware and frontend tasks are executing concurrently rather than sequentially.
3. **Integration Gate:** Phase 4 integration typically requires 30% more debugging time than initially estimated.

**Recommended Corrective Actions:**
* Pair program on the highest priority task for the next 48 hours.
* Scope out non-essential stretch features to protect your deadline (${project.deadline || 'upcoming target'}).`,
      };
    }

    // 3. "Suggest a better database architecture"
    if (msg.includes('database') || msg.includes('schema') || msg.includes('architecture') || msg.includes('storage')) {
      return {
        response: `### 🏗️ Recommended Database Architecture for ${project.title}

Given that your project operates in the **${project.domain}** domain with **${skills.join(', ')}**, here is an optimized architecture:

1. **Relational Storage (PostgreSQL):**
   * **Users & Teams:** Normalized tables for students, role permissions, and project workspaces.
   * **Project Metadata:** Foreign keys enforcing referential integrity with cascade deletes for tasks, milestones, and invites.
   * **Indexing Strategy:** Create composite B-Tree indexes on \`(project_id, status)\` and \`(project_id, created_at DESC)\` for instant Kanban queries.

2. **Time-Series / Telemetry (Hypertables or InfluxDB):**
   * If streaming sensor frequencies exceed 5Hz, use TimescaleDB hypertables partitioned by day.
   * Store compressed numeric metrics with automatic 30-day retention policies.

3. **In-Memory Cache (Redis):**
   * Cache active telemetry readings with a 60-second TTL to shield the primary SQL database.
   * Use Redis Pub/Sub for instantaneous multi-client WebSocket fan-out.`,
      };
    }

    // 4. "Find missing skills in our team"
    if (msg.includes('missing skills') || msg.includes('skill gap') || msg.includes('team gap')) {
      return {
        response: `### 🔍 Team Skill Coverage Analysis for ${project.title}

**Required Project Skills:** ${skills.join(', ')}
**Current Roster:** ${memberNames || '1 member'}

**Diagnostic:**
* **Hardware & Backend:** You have solid foundational coverage for core architecture.
* **Potential Blindspot:** Ensure you have dedicated expertise in **Machine Learning model quantization** or **Cloud deployment pipelines** before Phase 4.
* **Actionable Step:** Use the **Skill Gap** tab to inspect candidate recommendations or invite students directly from the **Discover Students** page.`,
      };
    }

    // 5. "Create a testing checklist"
    if (msg.includes('test') || msg.includes('checklist') || msg.includes('qa')) {
      return {
        response: `### 🧪 Production Quality Verification Checklist for ${project.title}

* [ ] **Unit Tests:** Verify core math transformations and sensor parsing functions with zero mocks.
* [ ] **API Contracts:** Validate HTTP status codes (200, 201, 400, 401, 403, 404, 500) and JSON schema error responses.
* [ ] **Network Resilience:** Test automatic reconnection and queueing when Wi-Fi/Ethernet drops unexpectedly.
* [ ] **Security Review:** Confirm no hardcoded API keys or database credentials exist in public git commits.
* [ ] **UI Responsiveness:** Verify dashboard scales cleanly from 375px mobile screens to 4K ultra-wide monitors.
* [ ] **Load Benchmark:** Confirm backend responds in < 150ms under 50 simultaneous HTTP requests.`,
      };
    }

    // 6. "Generate API documentation"
    if (msg.includes('api') || msg.includes('documentation') || msg.includes('docs')) {
      return {
        response: `### 📖 REST API Specification Draft for ${project.title}

#### 1. Telemetry Ingestion
\`\`\`http
POST /api/telemetry/stream
Content-Type: application/json
Authorization: Bearer <device_jwt>

{
  "node_id": "esp32_sensor_01",
  "timestamp": 1726071000,
  "metrics": {
    "temperature_c": 24.8,
    "power_watts": 142.5,
    "vibration_rms": 0.082
  }
}
\`\`\`

#### 2. Project Task Dispatch
\`\`\`http
POST /api/projects/${projectId}/tasks
Content-Type: application/json

{
  "title": "Calibrate optical sensor threshold",
  "priority": "high",
  "assignee_id": ${members[0]?.id || 1}
}
\`\`\`

#### 3. Health & Status
\`\`\`http
GET /api/projects/${projectId}/status
Response 200 OK:
{
  "progress_pct": ${project.progress_pct},
  "active_members": ${members.length},
  "system_health": "optimal"
}
\`\`\``,
      };
    }

    // Default Contextual Response
    return {
      response: `I'm **Project Copilot** for **${project.title}**. 

I have live context on your **${members.length} team members** (${memberNames}), **${skills.length} core technologies** (${skills.slice(0, 4).join(', ')}), and your **${tasks.length} sprint tasks** (${project.progress_pct}% completed).

You can ask me to:
* **"Divide this project into tasks for 4 members"**
* **"Why is our project behind schedule?"**
* **"Suggest a better database architecture"**
* **"Find missing skills in our team"**
* **"Generate API documentation"**
* **"Create a testing checklist"**

What would you like assistance with today?`,
    };
  },
};
