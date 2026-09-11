import bcrypt from 'bcryptjs';
import db from './database.js';

export async function seedDatabase() {
  console.log('🌱 Starting comprehensive database seeding...');

  // Clear existing data safely
  db.exec('PRAGMA foreign_keys = OFF;');
  db.exec('DELETE FROM reports;');
  db.exec('DELETE FROM ai_recommendations;');
  db.exec('DELETE FROM repositories;');
  db.exec('DELETE FROM github_profiles;');
  db.exec('DELETE FROM notifications;');
  db.exec('DELETE FROM invitations;');
  db.exec('DELETE FROM roadmap_tasks;');
  db.exec('DELETE FROM roadmaps;');
  db.exec('DELETE FROM tasks;');
  db.exec('DELETE FROM project_skills;');
  db.exec('DELETE FROM project_members;');
  db.exec('DELETE FROM projects;');
  db.exec('DELETE FROM user_skills;');
  db.exec('DELETE FROM skills;');
  db.exec('DELETE FROM profiles;');
  db.exec('DELETE FROM users;');
  db.exec('PRAGMA foreign_keys = ON;');

  const passwordHash = bcrypt.hashSync('password123', 10);

  // 1. Seed Skills (36 industry-relevant skills across 7 categories)
  const skillsData = [
    // Languages
    { name: 'TypeScript', category: 'languages', icon: 'FileCode' },
    { name: 'JavaScript', category: 'languages', icon: 'FileCode' },
    { name: 'Python', category: 'languages', icon: 'Terminal' },
    { name: 'C++', category: 'languages', icon: 'Cpu' },
    { name: 'Rust', category: 'languages', icon: 'Shield' },
    { name: 'Go', category: 'languages', icon: 'Zap' },
    { name: 'Solidity', category: 'languages', icon: 'Coins' },
    // Frameworks & Libraries
    { name: 'React', category: 'frameworks', icon: 'Layers' },
    { name: 'Next.js', category: 'frameworks', icon: 'Globe' },
    { name: 'Node.js', category: 'frameworks', icon: 'Server' },
    { name: 'FastAPI', category: 'frameworks', icon: 'Zap' },
    { name: 'Flutter', category: 'frameworks', icon: 'Smartphone' },
    { name: 'Express', category: 'frameworks', icon: 'Server' },
    { name: 'Tailwind CSS', category: 'frameworks', icon: 'Palette' },
    // AI & Machine Learning
    { name: 'PyTorch', category: 'ai_ml', icon: 'Brain' },
    { name: 'TensorFlow', category: 'ai_ml', icon: 'Brain' },
    { name: 'Computer Vision', category: 'ai_ml', icon: 'Eye' },
    { name: 'NLP', category: 'ai_ml', icon: 'MessageSquare' },
    { name: 'Graph Neural Networks', category: 'ai_ml', icon: 'Share2' },
    { name: 'Machine Learning', category: 'ai_ml', icon: 'Sparkles' },
    // Embedded & Hardware
    { name: 'ESP32', category: 'embedded_iot', icon: 'Cpu' },
    { name: 'Raspberry Pi', category: 'embedded_iot', icon: 'Cpu' },
    { name: 'Arduino', category: 'embedded_iot', icon: 'Cpu' },
    { name: 'ROS2', category: 'embedded_iot', icon: 'Bot' },
    { name: 'MQTT', category: 'embedded_iot', icon: 'Radio' },
    { name: 'IoT', category: 'embedded_iot', icon: 'Wifi' },
    // Cloud & DevOps
    { name: 'Docker', category: 'cloud_devops', icon: 'Box' },
    { name: 'Kubernetes', category: 'cloud_devops', icon: 'Boxes' },
    { name: 'AWS', category: 'cloud_devops', icon: 'Cloud' },
    { name: 'GitHub Actions', category: 'cloud_devops', icon: 'GitBranch' },
    // Databases
    { name: 'PostgreSQL', category: 'databases', icon: 'Database' },
    { name: 'MongoDB', category: 'databases', icon: 'Database' },
    { name: 'Redis', category: 'databases', icon: 'Zap' },
    // Design & Systems
    { name: 'UI/UX Design', category: 'design', icon: 'Figma' },
    { name: 'System Architecture', category: 'design', icon: 'Grid' },
    { name: 'Cybersecurity', category: 'cloud_devops', icon: 'ShieldCheck' },
  ];

  const skillIdMap = new Map<string, number>();
  for (const s of skillsData) {
    const res = db.execute(
      'INSERT INTO skills (name, category, icon) VALUES (?, ?, ?)',
      [s.name, s.category, s.icon]
    );
    skillIdMap.set(s.name, Number(res.lastInsertRowid));
  }
  console.log(`✅ Seeded ${skillsData.length} skills`);

  // 2. Seed Users & Profiles (20 Students + 1 Platform Admin)
  const students = [
    {
      id: 1,
      email: 'yashwanth@college.edu',
      name: 'Yashwanth Kumar',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      college: 'IIT Bombay',
      branch: 'Electrical Engineering & IoT',
      gradYear: 2026,
      bio: 'Full-stack builder passionate about embedded hardware, edge AI, and high-performance IoT telemetry dashboards.',
      github: 'yashwanth-iot',
      linkedin: 'https://linkedin.com/in/yashwanth-kumar',
      weeklyHours: 20,
      teamSize: 4,
      prefRole: 'Full Stack & Embedded Lead',
      remote: 'hybrid',
      domains: ['IoT', 'Web Development', 'AI/ML'],
      aiSummary: 'Versatile builder bridging hardware sensors and cloud architectures with extensive ESP32, C++, and React experience.',
      skills: [
        { name: 'ESP32', level: 'expert', exp: 3 },
        { name: 'C++', level: 'advanced', exp: 3 },
        { name: 'React', level: 'advanced', exp: 2.5 },
        { name: 'Node.js', level: 'intermediate', exp: 2 },
        { name: 'IoT', level: 'expert', exp: 3 },
        { name: 'MQTT', level: 'advanced', exp: 2 },
      ]
    },
    {
      id: 2,
      email: 'rahul.sharma@college.edu',
      name: 'Rahul Sharma',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      college: 'BITS Pilani',
      branch: 'Electronics & Instrumentation',
      gradYear: 2026,
      bio: 'Firmware enthusiast and hardware hacker. Experienced with microcontrollers, FreeRTOS, and low-power IoT networks.',
      github: 'rahul-embedded',
      linkedin: 'https://linkedin.com/in/rahul-embedded',
      weeklyHours: 18,
      teamSize: 4,
      prefRole: 'Hardware & Firmware Lead',
      remote: 'in-person',
      domains: ['IoT', 'Robotics'],
      aiSummary: 'Strong match for embedded systems and hardware firmware. Deep expertise in ESP32, C++, low-level serial bus protocols and micro-soldering.',
      skills: [
        { name: 'ESP32', level: 'expert', exp: 3.5 },
        { name: 'C++', level: 'expert', exp: 4 },
        { name: 'Arduino', level: 'expert', exp: 4 },
        { name: 'MQTT', level: 'advanced', exp: 2.5 },
        { name: 'Raspberry Pi', level: 'intermediate', exp: 2 },
      ]
    },
    {
      id: 3,
      email: 'priya.patel@college.edu',
      name: 'Priya Patel',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      college: 'RVCE Bangalore',
      branch: 'Computer Science',
      gradYear: 2025,
      bio: 'Frontend architect and design system lover. Dedicated to crafting fluid, accessible, and high-conversion SaaS interfaces.',
      github: 'priyapatel-ui',
      linkedin: 'https://linkedin.com/in/priya-patel-design',
      weeklyHours: 16,
      teamSize: 3,
      prefRole: 'Frontend Developer & UI/UX Designer',
      remote: 'remote',
      domains: ['Web Development', 'FinTech'],
      aiSummary: 'Exceptional visual communicator and modern frontend specialist with production experience in React, Next.js, and design tokens.',
      skills: [
        { name: 'React', level: 'expert', exp: 3 },
        { name: 'Next.js', level: 'expert', exp: 2.5 },
        { name: 'TypeScript', level: 'advanced', exp: 2.5 },
        { name: 'Tailwind CSS', level: 'expert', exp: 3 },
        { name: 'UI/UX Design', level: 'advanced', exp: 3 },
      ]
    },
    {
      id: 4,
      email: 'arjun.mehta@college.edu',
      name: 'Arjun Mehta',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      college: 'NIT Trichy',
      branch: 'Data Science & AI',
      gradYear: 2025,
      bio: 'Machine learning researcher focused on computer vision, medical imaging, and model quantization for edge inference.',
      github: 'arjun-vision-ai',
      linkedin: 'https://linkedin.com/in/arjun-mehta-ai',
      weeklyHours: 22,
      teamSize: 4,
      prefRole: 'ML Engineer',
      remote: 'hybrid',
      domains: ['AI/ML', 'Healthcare'],
      aiSummary: 'PyTorch power user with published research on convolutional neural networks and transfer learning applied to clinical scans.',
      skills: [
        { name: 'Python', level: 'expert', exp: 4 },
        { name: 'PyTorch', level: 'expert', exp: 3 },
        { name: 'Computer Vision', level: 'expert', exp: 2.5 },
        { name: 'FastAPI', level: 'advanced', exp: 2 },
        { name: 'Docker', level: 'intermediate', exp: 1.5 },
      ]
    },
    {
      id: 5,
      email: 'sneha.reddy@college.edu',
      name: 'Sneha Reddy',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      college: 'IIIT Hyderabad',
      branch: 'Computer Science',
      gradYear: 2026,
      bio: 'Cybersecurity researcher, CTF player, and systems programmer writing high-throughput packet inspectors in Rust and Go.',
      github: 'sneha-sec',
      linkedin: 'https://linkedin.com/in/sneha-reddy-sec',
      weeklyHours: 15,
      teamSize: 3,
      prefRole: 'Security & Backend Engineer',
      remote: 'remote',
      domains: ['Cybersecurity', 'Cloud/DevOps'],
      aiSummary: 'Systems engineer with deep knowledge of network protocols, zero-trust architectures, and memory-safe packet capture.',
      skills: [
        { name: 'Rust', level: 'advanced', exp: 2 },
        { name: 'Go', level: 'advanced', exp: 2 },
        { name: 'Cybersecurity', level: 'expert', exp: 3 },
        { name: 'Docker', level: 'advanced', exp: 2 },
        { name: 'PostgreSQL', level: 'intermediate', exp: 1.5 },
      ]
    },
    {
      id: 6,
      email: 'devansh.gupta@college.edu',
      name: 'Devansh Gupta',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      college: 'IIT Delhi',
      branch: 'Mechanical & Robotics',
      gradYear: 2025,
      bio: 'Robotics engineer specializing in autonomous path planning, SLAM, and ROS2 navigation stacks for agricultural rovers.',
      github: 'devansh-robotics',
      linkedin: 'https://linkedin.com/in/devansh-gupta-robo',
      weeklyHours: 20,
      teamSize: 4,
      prefRole: 'Robotics & Control Systems Lead',
      remote: 'in-person',
      domains: ['Robotics', 'IoT'],
      aiSummary: 'Hands-on roboticist bridging ROS2 nodes, lidar odometry, and motor controllers for outdoor navigation tasks.',
      skills: [
        { name: 'ROS2', level: 'expert', exp: 3 },
        { name: 'C++', level: 'advanced', exp: 3 },
        { name: 'Python', level: 'advanced', exp: 2.5 },
        { name: 'Raspberry Pi', level: 'advanced', exp: 3 },
        { name: 'Computer Vision', level: 'intermediate', exp: 1.5 },
      ]
    },
    {
      id: 7,
      email: 'ananya.iyer@college.edu',
      name: 'Ananya Iyer',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      college: 'VIT Vellore',
      branch: 'Information Technology',
      gradYear: 2026,
      bio: 'Web3 developer building decentralized credit protocols and automated market makers with Solidity and ethers.js.',
      github: 'ananya-eth',
      linkedin: 'https://linkedin.com/in/ananya-iyer-web3',
      weeklyHours: 14,
      teamSize: 3,
      prefRole: 'Smart Contract & DApp Engineer',
      remote: 'remote',
      domains: ['FinTech', 'Web Development'],
      aiSummary: 'Smart contract developer well-versed in EVM mechanics, formal verification, gas optimization, and React web3 hooks.',
      skills: [
        { name: 'Solidity', level: 'expert', exp: 2.5 },
        { name: 'TypeScript', level: 'advanced', exp: 2 },
        { name: 'React', level: 'advanced', exp: 2 },
        { name: 'Node.js', level: 'intermediate', exp: 1.5 },
      ]
    },
    {
      id: 8,
      email: 'vikram.malhotra@college.edu',
      name: 'Vikram Malhotra',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      college: 'DTU Delhi',
      branch: 'Software Engineering',
      gradYear: 2025,
      bio: 'Cloud and platform engineer obsessed with Kubernetes operators, Helm charts, and CI/CD automation pipelines.',
      github: 'vikram-cloud',
      linkedin: 'https://linkedin.com/in/vikram-malhotra-k8s',
      weeklyHours: 18,
      teamSize: 4,
      prefRole: 'DevOps & Cloud Architect',
      remote: 'hybrid',
      domains: ['Cloud/DevOps', 'Cybersecurity'],
      aiSummary: 'Infrastructure expert skilled in multi-cluster Kubernetes deployments, infrastructure-as-code, and container security scanners.',
      skills: [
        { name: 'Kubernetes', level: 'expert', exp: 2.5 },
        { name: 'Docker', level: 'expert', exp: 3 },
        { name: 'Go', level: 'advanced', exp: 2 },
        { name: 'AWS', level: 'advanced', exp: 2.5 },
        { name: 'GitHub Actions', level: 'expert', exp: 2.5 },
      ]
    },
    {
      id: 9,
      email: 'kavya.nair@college.edu',
      name: 'Kavya Nair',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      college: 'PES University Bangalore',
      branch: 'Computer Science',
      gradYear: 2026,
      bio: 'Full stack engineer with a knack for real-time WebSockets, distributed databases, and collaborative editors.',
      github: 'kavya-realtime',
      linkedin: 'https://linkedin.com/in/kavya-nair-dev',
      weeklyHours: 16,
      teamSize: 4,
      prefRole: 'Full Stack Engineer',
      remote: 'hybrid',
      domains: ['Web Development', 'Smart Campus'],
      aiSummary: 'Backend and collaborative tooling specialist with hands-on OT/CRDT synchronization algorithms and Node.js microservices.',
      skills: [
        { name: 'Node.js', level: 'expert', exp: 3 },
        { name: 'TypeScript', level: 'advanced', exp: 2.5 },
        { name: 'React', level: 'advanced', exp: 2.5 },
        { name: 'PostgreSQL', level: 'expert', exp: 2.5 },
        { name: 'Redis', level: 'advanced', exp: 2 },
      ]
    },
    {
      id: 10,
      email: 'rohan.verma@college.edu',
      name: 'Rohan Verma',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      college: 'IIT Roorkee',
      branch: 'Civil & Environmental Analytics',
      gradYear: 2025,
      bio: 'Sustainability technologist modeling carbon offsets, satellite NDVI imagery, and supply chain emissions.',
      github: 'rohan-green',
      linkedin: 'https://linkedin.com/in/rohan-verma-eco',
      weeklyHours: 15,
      teamSize: 3,
      prefRole: 'Data Analyst & Backend Lead',
      remote: 'remote',
      domains: ['Sustainability', 'Smart Campus'],
      aiSummary: 'Passionate climate tech developer fluent in geospatial Python libraries, PostGIS geospatial indexes, and React dashboard visualizations.',
      skills: [
        { name: 'Python', level: 'expert', exp: 3 },
        { name: 'PostgreSQL', level: 'advanced', exp: 2 },
        { name: 'React', level: 'intermediate', exp: 1.5 },
        { name: 'Node.js', level: 'intermediate', exp: 1.5 },
        { name: 'Machine Learning', level: 'intermediate', exp: 2 },
      ]
    },
    {
      id: 11,
      email: 'tanvi.joshi@college.edu',
      name: 'Tanvi Joshi',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      college: 'COEP Pune',
      branch: 'Biomedical Engineering',
      gradYear: 2026,
      bio: 'Neurotech developer processing EEG brainwave signals for mental wellness, fatigue tracking, and neurofeedback games.',
      github: 'tanvi-bci',
      linkedin: 'https://linkedin.com/in/tanvi-joshi-bci',
      weeklyHours: 16,
      teamSize: 4,
      prefRole: 'Biosignal & Mobile Engineer',
      remote: 'hybrid',
      domains: ['Healthcare', 'AI/ML'],
      aiSummary: 'Specialist in digital biosignal filtering, time-frequency wavelets, and on-device machine learning for Flutter mobile apps.',
      skills: [
        { name: 'Python', level: 'advanced', exp: 2.5 },
        { name: 'Flutter', level: 'advanced', exp: 2 },
        { name: 'TensorFlow', level: 'intermediate', exp: 2 },
        { name: 'FastAPI', level: 'intermediate', exp: 1.5 },
      ]
    },
    {
      id: 12,
      email: 'aditya.rao@college.edu',
      name: 'Aditya Rao',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      college: 'IIIT Bangalore',
      branch: 'Computer Science',
      gradYear: 2025,
      bio: 'Graph theory geek building intelligent transportation systems and electric vehicle routing algorithms.',
      github: 'aditya-graphs',
      linkedin: 'https://linkedin.com/in/aditya-rao-graphs',
      weeklyHours: 20,
      teamSize: 4,
      prefRole: 'Algorithm & Backend Engineer',
      remote: 'hybrid',
      domains: ['Smart Campus', 'AI/ML'],
      aiSummary: 'Deep theoretical foundation in graph neural networks, heuristic search, and high-concurrency API service development.',
      skills: [
        { name: 'Python', level: 'expert', exp: 3.5 },
        { name: 'Graph Neural Networks', level: 'expert', exp: 2 },
        { name: 'FastAPI', level: 'advanced', exp: 2.5 },
        { name: 'PostgreSQL', level: 'advanced', exp: 2 },
        { name: 'Redis', level: 'advanced', exp: 2 },
      ]
    },
    {
      id: 13,
      email: 'meera.krishnan@college.edu',
      name: 'Meera Krishnan',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
      college: 'IIT Madras',
      branch: 'Computer Science & Engineering',
      gradYear: 2026,
      bio: 'Natural Language Processing enthusiast training transformer models for code generation and automated test synthesis.',
      github: 'meera-nlp',
      linkedin: 'https://linkedin.com/in/meera-krishnan-ai',
      weeklyHours: 18,
      teamSize: 3,
      prefRole: 'NLP & AI Researcher',
      remote: 'remote',
      domains: ['AI/ML', 'Web Development'],
      aiSummary: 'NLP specialist with deep understanding of attention mechanisms, tokenizers, parameter-efficient fine-tuning (LoRA), and LangChain.',
      skills: [
        { name: 'Python', level: 'expert', exp: 3 },
        { name: 'PyTorch', level: 'advanced', exp: 2.5 },
        { name: 'NLP', level: 'expert', exp: 2.5 },
        { name: 'FastAPI', level: 'advanced', exp: 2 },
      ]
    },
    {
      id: 14,
      email: 'siddharth.jain@college.edu',
      name: 'Siddharth Jain',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      college: 'BITS Goa',
      branch: 'Electronics & Communication',
      gradYear: 2026,
      bio: 'Hardware engineer with circuit board design chops in KiCad, PCB layout, and wireless mesh protocols.',
      github: 'sid-circuits',
      linkedin: 'https://linkedin.com/in/siddharth-jain-hw',
      weeklyHours: 15,
      teamSize: 4,
      prefRole: 'PCB & Hardware Designer',
      remote: 'in-person',
      domains: ['IoT', 'Robotics'],
      aiSummary: 'Experienced in mixed-signal schematics, power management ICs, ESP32 boards, and EMC compliance testing.',
      skills: [
        { name: 'ESP32', level: 'advanced', exp: 2.5 },
        { name: 'Arduino', level: 'expert', exp: 3 },
        { name: 'C++', level: 'intermediate', exp: 2 },
        { name: 'IoT', level: 'advanced', exp: 2.5 },
      ]
    },
    {
      id: 15,
      email: 'pooja.hegde@college.edu',
      name: 'Pooja Hegde',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
      college: 'Manipal Institute of Technology',
      branch: 'Information Technology',
      gradYear: 2025,
      bio: 'Product designer and frontend craftsperson obsessed with micro-interactions, typography hierarchy, and accessibility.',
      github: 'pooja-ux',
      linkedin: 'https://linkedin.com/in/pooja-hegde-design',
      weeklyHours: 15,
      teamSize: 4,
      prefRole: 'UI/UX Designer & Frontend',
      remote: 'remote',
      domains: ['Web Development', 'Healthcare'],
      aiSummary: 'Skilled in Figma component systems, interactive prototyping, Tailwind CSS, and user empathy interviews.',
      skills: [
        { name: 'UI/UX Design', level: 'expert', exp: 3 },
        { name: 'React', level: 'advanced', exp: 2 },
        { name: 'Tailwind CSS', level: 'expert', exp: 2.5 },
        { name: 'TypeScript', level: 'intermediate', exp: 1.5 },
      ]
    },
    {
      id: 16,
      email: 'farhan.ali@college.edu',
      name: 'Farhan Ali',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
      college: 'IIT Kanpur',
      branch: 'Computer Science',
      gradYear: 2025,
      bio: 'Systems software developer contributing to Linux kernel modules and high-speed BPF tracing utilities.',
      github: 'farhan-kernel',
      linkedin: 'https://linkedin.com/in/farhan-ali-sys',
      weeklyHours: 18,
      teamSize: 3,
      prefRole: 'Systems & Kernel Programmer',
      remote: 'hybrid',
      domains: ['Cybersecurity', 'Cloud/DevOps'],
      aiSummary: 'Deep comprehension of OS internals, memory layout, system calls, eBPF filters, and low-latency C code.',
      skills: [
        { name: 'C++', level: 'expert', exp: 3.5 },
        { name: 'Rust', level: 'advanced', exp: 2 },
        { name: 'Cybersecurity', level: 'advanced', exp: 2.5 },
        { name: 'Docker', level: 'advanced', exp: 2 },
      ]
    },
    {
      id: 17,
      email: 'neha.singhania@college.edu',
      name: 'Neha Singhania',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1534751516642-a171ed28a0e5?w=150&auto=format&fit=crop&q=80',
      college: 'Thapar University',
      branch: 'Computer Engineering',
      gradYear: 2026,
      bio: 'Full stack JavaScript/TypeScript developer creating reactive dashboard applications and serverless webhooks.',
      github: 'neha-ts',
      linkedin: 'https://linkedin.com/in/neha-singhania-dev',
      weeklyHours: 16,
      teamSize: 4,
      prefRole: 'Full Stack Engineer',
      remote: 'remote',
      domains: ['Web Development', 'FinTech'],
      aiSummary: 'Reliable full stack developer with fast velocity in Next.js, Express, Tailwind, and relational SQL queries.',
      skills: [
        { name: 'TypeScript', level: 'advanced', exp: 2 },
        { name: 'React', level: 'advanced', exp: 2 },
        { name: 'Node.js', level: 'advanced', exp: 2 },
        { name: 'PostgreSQL', level: 'intermediate', exp: 1.5 },
      ]
    },
    {
      id: 18,
      email: 'karthik.sundaram@college.edu',
      name: 'Karthik Sundaram',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
      college: 'PSG College of Technology',
      branch: 'Robotics & Automation',
      gradYear: 2025,
      bio: 'Mechatronics specialist programming robotic arms, inverse kinematics, and real-time sensor fusion.',
      github: 'karthik-mechatronics',
      linkedin: 'https://linkedin.com/in/karthik-sundaram-robo',
      weeklyHours: 20,
      teamSize: 4,
      prefRole: 'Hardware & Control Engineer',
      remote: 'in-person',
      domains: ['Robotics', 'IoT'],
      aiSummary: 'Practical expertise in PID controllers, stepper motors, microcontrollers, and Kalman filtering.',
      skills: [
        { name: 'ROS2', level: 'advanced', exp: 2.5 },
        { name: 'C++', level: 'advanced', exp: 3 },
        { name: 'Arduino', level: 'expert', exp: 3.5 },
        { name: 'Raspberry Pi', level: 'advanced', exp: 2.5 },
      ]
    },
    {
      id: 19,
      email: 'riya.sen@college.edu',
      name: 'Riya Sen',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
      college: 'Jadavpur University',
      branch: 'Computer Science',
      gradYear: 2026,
      bio: 'Machine learning practitioner specializing in reinforcement learning for game AI and multi-agent coordination.',
      github: 'riya-rl',
      linkedin: 'https://linkedin.com/in/riya-sen-rl',
      weeklyHours: 15,
      teamSize: 3,
      prefRole: 'RL & Algorithms Engineer',
      remote: 'hybrid',
      domains: ['AI/ML', 'Robotics'],
      aiSummary: 'Analytical thinker skilled in Q-learning, PPO algorithms, gym environments, and mathematical modeling.',
      skills: [
        { name: 'Python', level: 'expert', exp: 3 },
        { name: 'PyTorch', level: 'advanced', exp: 2 },
        { name: 'Machine Learning', level: 'expert', exp: 2.5 },
        { name: 'FastAPI', level: 'intermediate', exp: 1.5 },
      ]
    },
    {
      id: 20,
      email: 'aman.choudhary@college.edu',
      name: 'Aman Choudhary',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      college: 'IIT Kharagpur',
      branch: 'Instrumentation & IoT',
      gradYear: 2025,
      bio: 'Edge computing enthusiast working on TinyML model deployment on low-cost ARM Cortex microcontrollers.',
      github: 'aman-tinyml',
      linkedin: 'https://linkedin.com/in/aman-choudhary-edge',
      weeklyHours: 22,
      teamSize: 4,
      prefRole: 'Edge AI & Embedded Engineer',
      remote: 'hybrid',
      domains: ['IoT', 'AI/ML'],
      aiSummary: 'Rare blend of firmware engineering and embedded machine learning using TensorFlow Lite for Microcontrollers.',
      skills: [
        { name: 'ESP32', level: 'expert', exp: 3 },
        { name: 'C++', level: 'expert', exp: 3.5 },
        { name: 'Python', level: 'advanced', exp: 2 },
        { name: 'TensorFlow', level: 'intermediate', exp: 2 },
        { name: 'IoT', level: 'expert', exp: 3 },
      ]
    },
  ];

  // Insert Students & Profiles
  for (const s of students) {
    db.execute(
      'INSERT INTO users (id, email, password_hash, role, is_active, is_onboarded) VALUES (?, ?, ?, ?, 1, 1)',
      [s.id, s.email, passwordHash, s.role]
    );

    const scheduleMatrix = JSON.stringify({
      mon: ['evening'],
      tue: ['afternoon', 'evening'],
      wed: ['evening'],
      thu: ['morning', 'evening'],
      fri: ['afternoon'],
      sat: ['morning', 'afternoon', 'evening'],
      sun: ['morning', 'afternoon'],
    });

    db.execute(
      `INSERT INTO profiles (
        user_id, full_name, avatar_url, college, branch, graduation_year,
        bio, github_username, linkedin_url, weekly_hours, preferred_team_size,
        preferred_role, remote_preference, domains, schedule_matrix, ai_summary
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        s.id,
        s.name,
        s.avatar,
        s.college,
        s.branch,
        s.gradYear,
        s.bio,
        s.github,
        s.linkedin,
        s.weeklyHours,
        s.teamSize,
        s.prefRole,
        s.remote,
        JSON.stringify(s.domains),
        scheduleMatrix,
        s.aiSummary,
      ]
    );

    // Insert user skills
    for (const sk of s.skills) {
      const skillId = skillIdMap.get(sk.name);
      if (skillId) {
        db.execute(
          'INSERT INTO user_skills (user_id, skill_id, proficiency, years_experience) VALUES (?, ?, ?, ?)',
          [s.id, skillId, sk.level, sk.exp]
        );
      }
    }

    // Insert GitHub Profile & Mock Repos
    const topLangs = s.skills.slice(0, 3).map(x => ({ language: x.name, percentage: Math.floor(60 / (s.skills.indexOf(x) + 1)) }));
    db.execute(
      `INSERT INTO github_profiles (
        user_id, username, total_stars, total_repos, contributions_year, top_languages, ai_github_analysis
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        s.id,
        s.github,
        Math.floor(Math.random() * 45) + 12,
        Math.floor(Math.random() * 18) + 6,
        Math.floor(Math.random() * 320) + 110,
        JSON.stringify(topLangs),
        `Strong track record in ${s.skills[0]?.name || 'software'} with regular commit cadence and solid test hygiene.`,
      ]
    );

    // Add 2 mock repositories per student
    db.execute(
      `INSERT INTO repositories (user_id, repo_name, description, language, stars_count, forks_count, repo_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        s.id,
        `${s.github}-core-lab`,
        `Experimental benchmarks and algorithms implemented for ${s.domains[0]} coursework.`,
        s.skills[0]?.name || 'TypeScript',
        Math.floor(Math.random() * 25) + 3,
        Math.floor(Math.random() * 8) + 1,
        `https://github.com/${s.github}/${s.github}-core-lab`,
      ]
    );
  }
  console.log(`✅ Seeded ${students.length} student profiles and user_skills`);

  // Insert Admin Account
  const adminId = 99;
  db.execute(
    'INSERT INTO users (id, email, password_hash, role, is_active, is_onboarded) VALUES (?, ?, ?, ?, 1, 1)',
    [adminId, 'admin@aiprojectmate.dev', passwordHash, 'admin']
  );
  db.execute(
    `INSERT INTO profiles (
      user_id, full_name, avatar_url, college, branch, graduation_year,
      bio, github_username, linkedin_url, weekly_hours, preferred_team_size,
      preferred_role, remote_preference, domains, ai_summary
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      adminId,
      'Platform Administrator',
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      'AI ProjectMate Central',
      'Administration & Analytics',
      2024,
      'Platform administrator supervising student projects, team matching quality, and moderation.',
      'aiprojectmate-admin',
      'https://linkedin.com',
      40,
      4,
      'System Admin',
      'remote',
      JSON.stringify(['Administration', 'Analytics']),
      'Platform supervisor and data scientist monitoring team matches and safety.',
    ]
  );
  console.log('✅ Seeded Admin account (admin@aiprojectmate.dev)');

  // 3. Seed Projects (10 realistic projects across diverse domains)
  const projectsData = [
    {
      id: 1,
      ownerId: 1, // Yashwanth
      title: 'IoT Smart Campus Energy Monitor',
      description: 'A distributed sensor network deployed across university classrooms and laboratories measuring real-time power draw, ambient temperature, and occupancy. Features predictive energy shedding using TinyML on ESP32 microcontrollers and a real-time telemetry dashboard in React.',
      domain: 'IoT',
      difficulty: 'intermediate',
      status: 'in_progress',
      teamSizeTarget: 4,
      progressPct: 65,
      deadline: '2026-11-30',
      repoUrl: 'https://github.com/yashwanth-iot/smart-campus-energy',
      hardwareReqs: 'ESP32 NodeMCU, ACS712 Current Sensors, DHT22 Temp Sensors, Raspberry Pi 4 MQTT Broker',
      skills: ['ESP32', 'C++', 'React', 'Node.js', 'MQTT', 'IoT'],
      members: [
        { userId: 1, role: 'Project Lead & Full Stack' },
        { userId: 2, role: 'Hardware & Sensor Engineer' },
      ],
      tasks: [
        { title: 'Calibrate ACS712 Hall-Effect current sensor', desc: 'Verify zero-current analog voltage drift on ESP32 ADC pin 34.', status: 'completed', prio: 'high', assignee: 2 },
        { title: 'Establish TLS connection to Mosquitto broker', desc: 'Configure X.509 client certificates on ESP32 firmware.', status: 'completed', prio: 'urgent', assignee: 1 },
        { title: 'Build live power gauge widget in React', desc: 'Create SVG arc meter with color-coded power consumption thresholds.', status: 'in_progress', prio: 'medium', assignee: 1 },
        { title: 'Implement energy anomaly detection alert', desc: 'Trigger webhook when after-hours baseline power spikes by >20%.', status: 'todo', prio: 'high', assignee: 1 },
        { title: 'Design modular DIN-rail 3D printed enclosure', desc: 'Ensure thermal venting for 240V relay modules.', status: 'backlog', prio: 'low', assignee: 2 },
      ],
      roadmaps: [
        { phase: 1, name: 'Sensor Benchmarking & Research', desc: 'Test current sensors against digital multimeter reference.', deadline: '2026-09-25' },
        { phase: 2, name: 'Firmware & Broker Architecture', desc: 'Build FreeRTOS tasks for sampling, averaging, and MQTT publishing.', deadline: '2026-10-10' },
        { phase: 3, name: 'Web Telemetry Dashboard', desc: 'Develop responsive React charts and WebSocket streaming pipeline.', deadline: '2026-10-28' },
        { phase: 4, name: 'Campus Pilot Deployment', desc: 'Install 5 prototype nodes in Lab 204 and monitor 24/7 reliability.', deadline: '2026-11-15' },
        { phase: 5, name: 'Machine Learning Power Profiling', desc: 'Train model on 2-week power consumption logs for peak shaving.', deadline: '2026-11-25' },
        { phase: 6, name: 'Final Presentation & Documentation', desc: 'Compile IEEE format project report and open-source schematics.', deadline: '2026-11-30' },
      ]
    },
    {
      id: 2,
      ownerId: 4, // Arjun Mehta
      title: 'MediScan AI: Chest X-Ray Diagnostics',
      description: 'Deep learning diagnostic assistant that screens frontal chest radiographs for pneumonia, cardiomegaly, and pleural effusion with Grad-CAM visual heatmaps. Packaged with a physician review interface and DICOM parsing engine.',
      domain: 'AI/ML',
      difficulty: 'advanced',
      status: 'in_progress',
      teamSizeTarget: 4,
      progressPct: 40,
      deadline: '2026-12-15',
      repoUrl: 'https://github.com/arjun-vision-ai/mediscan-ai',
      hardwareReqs: 'NVIDIA RTX 4090 GPU Workstation for model fine-tuning',
      skills: ['Python', 'PyTorch', 'Computer Vision', 'FastAPI', 'React', 'Docker'],
      members: [
        { userId: 4, role: 'Lead ML Researcher' },
        { userId: 3, role: 'UI/UX & Frontend Architect' },
      ],
      tasks: [
        { title: 'Fine-tune DenseNet-121 on NIH Chest X-ray 14 dataset', desc: 'Use weighted binary cross entropy loss to handle class imbalance.', status: 'completed', prio: 'urgent', assignee: 4 },
        { title: 'Implement Grad-CAM overlay endpoint', desc: 'Compute gradients from last convolutional layer and return heatmap PNG.', status: 'in_progress', prio: 'high', assignee: 4 },
        { title: 'Design DICOM viewer component in Next.js', desc: 'Render multi-slice contrast windowing with cornerstone.js.', status: 'todo', prio: 'high', assignee: 3 },
        { title: 'Conduct radiologist validation review', desc: 'Compare AI confidence scores with 50 annotated test studies.', status: 'backlog', prio: 'medium', assignee: null },
      ],
      roadmaps: [
        { phase: 1, name: 'Dataset Preparation & Augmentation', desc: 'Normalize 112,000 radiograph images and balance diagnosis labels.', deadline: '2026-10-01' },
        { phase: 2, name: 'Model Architecture & Training', desc: 'Benchmark ResNet-50 vs DenseNet-121 with ROC-AUC validation.', deadline: '2026-10-25' },
        { phase: 3, name: 'Explainability & Heatmap Generation', desc: 'Generate high-resolution Grad-CAM bounding overlays.', deadline: '2026-11-10' },
        { phase: 4, name: 'Physician Portal & Clinical UI', desc: 'Create fast web-based diagnostic viewer with instant report export.', deadline: '2026-11-30' },
        { phase: 5, name: 'Dockerized Staging & Stress Test', desc: 'Benchmark inference latency under concurrent clinical requests.', deadline: '2026-12-08' },
        { phase: 6, name: 'Research Paper Submission', desc: 'Submit findings to medical imaging student symposium.', deadline: '2026-12-15' },
      ]
    },
    {
      id: 3,
      ownerId: 5, // Sneha Reddy
      title: 'CyberGuard: Zero-Trust Network Traffic Analyzer',
      description: 'High-speed packet capture and behavioral anomaly detector written in Rust. Reconstructs network sessions in microsecond intervals, identifies DNS tunneling and command-and-control beacons, and emits automated firewall rules.',
      domain: 'Cybersecurity',
      difficulty: 'advanced',
      status: 'recruiting',
      teamSizeTarget: 3,
      progressPct: 25,
      deadline: '2026-11-20',
      repoUrl: 'https://github.com/sneha-sec/cyberguard-zt',
      hardwareReqs: 'Gigabit NIC with Promiscuous Mode support',
      skills: ['Rust', 'Go', 'Cybersecurity', 'Docker', 'PostgreSQL'],
      members: [
        { userId: 5, role: 'Security Architect & Rust Core' },
      ],
      tasks: [
        { title: 'Implement AF_PACKET zero-copy ring buffer in Rust', desc: 'Achieve 1Gbps wire rate without packet loss.', status: 'completed', prio: 'urgent', assignee: 5 },
        { title: 'Write Shannon entropy calculator for DNS queries', desc: 'Flag high-entropy subdomains indicative of exfiltration.', status: 'in_progress', prio: 'high', assignee: 5 },
        { title: 'Create REST API in Go for security incident queries', desc: 'Provide paginated search over indexed PCAP sessions.', status: 'todo', prio: 'medium', assignee: null },
      ],
      roadmaps: [
        { phase: 1, name: 'Protocol Parser Specifications', desc: 'Define state machines for IPv4, IPv6, TCP, UDP, and TLS handshakes.', deadline: '2026-10-05' },
        { phase: 2, name: 'Zero-Copy Engine Implementation', desc: 'Develop lock-free ring buffer parser in safe Rust.', deadline: '2026-10-20' },
        { phase: 3, name: 'Threat Signature & Heuristic Rules', desc: 'Implement automated detection for port scanning and C2 channels.', deadline: '2026-11-01' },
        { phase: 4, name: 'Management Dashboard', desc: 'Expose telemetry metrics to Grafana and Prometheus.', deadline: '2026-11-12' },
        { phase: 5, name: 'Penetration Test & Red Team Attack Simulation', desc: 'Run simulated attacks and evaluate detection recall.', deadline: '2026-11-18' },
        { phase: 6, name: 'Open Source Release & CLI Packaging', desc: 'Publish Cargo crate and container images.', deadline: '2026-11-20' },
      ]
    },
    {
      id: 4,
      ownerId: 6, // Devansh Gupta
      title: 'AgroBot: Autonomous Crop Health Rover',
      description: 'An autonomous field robot equipped with multispectral cameras, RTK-GPS centimeter-accurate navigation, and onboard weed detection. Uses ROS2 navigation stack to traverse agricultural furrows and log crop NDVI values.',
      domain: 'Robotics',
      difficulty: 'advanced',
      status: 'in_progress',
      teamSizeTarget: 4,
      progressPct: 50,
      deadline: '2026-12-20',
      repoUrl: 'https://github.com/devansh-robotics/agrobot-ros2',
      hardwareReqs: 'Differential drive chassis, Jetson Orin Nano, Ouster Lidar, RTK-GPS rover',
      skills: ['ROS2', 'C++', 'Python', 'Raspberry Pi', 'Computer Vision'],
      members: [
        { userId: 6, role: 'Navigation & ROS2 Lead' },
        { userId: 18, role: 'Chassis & Motor Controller Lead' },
      ],
      tasks: [
        { title: 'Tune Nav2 costmaps for uneven soil terrain', desc: 'Set inflation radius to 0.4m to prevent chassis high-centering.', status: 'completed', prio: 'high', assignee: 6 },
        { title: 'Integrate RTK-GPS fix via NMEA serial parser', desc: 'Achieve sub-2cm positioning accuracy outdoors.', status: 'in_progress', prio: 'urgent', assignee: 18 },
        { title: 'Train YOLOv8-crop weed classification model', desc: 'Distinguish broadleaf weeds from young corn shoots.', status: 'todo', prio: 'medium', assignee: 6 },
      ],
      roadmaps: [
        { phase: 1, name: 'Chassis Fabrication & Motor Tuning', desc: 'Assemble 4-wheel skid steer base with high-torque planetary motors.', deadline: '2026-10-15' },
        { phase: 2, name: 'ROS2 Nav2 Stack Configuration', desc: 'Implement visual odometry and dual EKF state estimation.', deadline: '2026-11-05' },
        { phase: 3, name: 'Multispectral Camera Integration', desc: 'Capture normalized difference vegetation index (NDVI) imagery.', deadline: '2026-11-25' },
        { phase: 4, name: 'Autonomous Field Trials', desc: 'Complete 500-meter autonomous run on agricultural test plot.', deadline: '2026-12-10' },
        { phase: 5, name: 'Telemetry & Web Mission Control', desc: 'Stream rover battery, coordinates, and live video to base station.', deadline: '2026-12-18' },
        { phase: 6, name: 'Field Day Demonstration', desc: 'Live showcase for agricultural science faculty.', deadline: '2026-12-20' },
      ]
    },
    {
      id: 5,
      ownerId: 7, // Ananya Iyer
      title: 'DeFi Micro-Lending Protocol for Students',
      description: 'A decentralized peer-to-peer microcredit market built on Ethereum Layer 2. Uses verified student academic credentials and soulbound tokens for reputation-weighted collateralization, slashing borrowing rates for textbook and hardware loans.',
      domain: 'FinTech',
      difficulty: 'intermediate',
      status: 'recruiting',
      teamSizeTarget: 3,
      progressPct: 30,
      deadline: '2026-11-15',
      repoUrl: 'https://github.com/ananya-eth/student-defilend',
      hardwareReqs: 'Sepolia / Arbitrum Testnet Nodes',
      skills: ['Solidity', 'TypeScript', 'React', 'Node.js'],
      members: [
        { userId: 7, role: 'Protocol & Smart Contract Lead' },
      ],
      tasks: [
        { title: 'Write LiquidityPool.sol with flash loan protection', desc: 'Implement reentrancy guards and dynamic interest rate curves.', status: 'completed', prio: 'high', assignee: 7 },
        { title: 'Design student borrower application UI', desc: 'Connect RainbowKit and wagmi hooks for wallet onboarding.', status: 'todo', prio: 'medium', assignee: null },
      ],
      roadmaps: [
        { phase: 1, name: 'Tokenomics & Smart Contract Modeling', desc: 'Model collateral ratios, liquidation triggers, and APR equations.', deadline: '2026-09-30' },
        { phase: 2, name: 'Smart Contract Development & Unit Tests', desc: 'Achieve 100% test coverage with Foundry and Hardhat.', deadline: '2026-10-18' },
        { phase: 3, name: 'EVM Security Audit & Slither Analysis', desc: 'Eliminate vulnerabilities and optimize gas usage.', deadline: '2026-10-30' },
        { phase: 4, name: 'DApp Web Interface', desc: 'Build responsive lending dashboard with supply/borrow interest trackers.', deadline: '2026-11-08' },
        { phase: 5, name: 'Testnet Beta Launch', desc: 'Distribute mock tokens to 50 student testers.', deadline: '2026-11-12' },
        { phase: 6, name: 'Hackathon Final Pitch', desc: 'Demo live loan cycle from disbursement to repayment.', deadline: '2026-11-15' },
      ]
    },
    {
      id: 6,
      ownerId: 9, // Kavya Nair
      title: 'CodeSphere: Real-time Collaborative Web IDE',
      description: 'Browser-based collaborative cloud IDE featuring operational transformation, shared terminal sandboxes running in isolated Docker microVMs, AI inline autocomplete, and instant project container previews.',
      domain: 'Web Development',
      difficulty: 'intermediate',
      status: 'in_progress',
      teamSizeTarget: 4,
      progressPct: 70,
      deadline: '2026-10-31',
      repoUrl: 'https://github.com/kavya-realtime/codesphere',
      hardwareReqs: 'Server with VT-x virtualization and Docker Daemon',
      skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'],
      members: [
        { userId: 9, role: 'Backend & CRDT Architect' },
        { userId: 3, role: 'Editor UI & Monaco Integration' },
      ],
      tasks: [
        { title: 'Implement Yjs CRDT document synchronization', desc: 'Broadcast awareness states and multi-cursor positions over WebSocket.', status: 'completed', prio: 'urgent', assignee: 9 },
        { title: 'Mount ephemeral Docker containers per user workspace', desc: 'Limit each container to 512MB RAM and 1 vCPU with 30s idle timeout.', status: 'completed', prio: 'high', assignee: 9 },
        { title: 'Integrate Monaco Editor themes and keybindings', desc: 'Support Vim and VS Code keymaps with dark-mode syntax highlight.', status: 'in_progress', prio: 'medium', assignee: 3 },
      ],
      roadmaps: [
        { phase: 1, name: 'Real-time Sync & State Architecture', desc: 'Benchmark OT vs CRDT under high simulated packet latency.', deadline: '2026-09-15' },
        { phase: 2, name: 'Sandbox Container Orchestration', desc: 'Build secure container lifecycle daemon with resource cgroups.', deadline: '2026-09-30' },
        { phase: 3, name: 'Monaco Editor Integration', desc: 'Build multi-tab file explorer and tree view in React.', deadline: '2026-10-12' },
        { phase: 4, name: 'Interactive Web Terminal (xterm.js)', desc: 'Pipe pseudo-terminal PTY streams bidirectionally over WebSockets.', deadline: '2026-10-22' },
        { phase: 5, name: 'Load Testing & Concurrent Pairing', desc: 'Simulate 100 simultaneous coders in shared documents.', deadline: '2026-10-28' },
        { phase: 6, name: 'Campus Launch', desc: 'Deploy for introductory CS lab sections.', deadline: '2026-10-31' },
      ]
    },
    {
      id: 7,
      ownerId: 10, // Rohan Verma
      title: 'EcoTrack: Campus Carbon Offset Platform',
      description: 'Automated campus carbon accounting system that ingests utility meter data, dining hall food supply manifests, and commuter surveys to calculate real-time carbon equivalent emissions and suggest high-impact offset programs.',
      domain: 'Sustainability',
      difficulty: 'beginner',
      status: 'recruiting',
      teamSizeTarget: 3,
      progressPct: 35,
      deadline: '2026-11-25',
      repoUrl: 'https://github.com/rohan-green/ecotrack-campus',
      hardwareReqs: 'Cloud server instance',
      skills: ['React', 'Node.js', 'PostgreSQL', 'Python'],
      members: [
        { userId: 10, role: 'Sustainability Analyst & Lead' },
      ],
      tasks: [
        { title: 'Compute GHG Protocol Scope 1 and Scope 2 emissions factors', desc: 'Standardize kilowatt-hour to kg CO2e conversions for regional power grid.', status: 'completed', prio: 'high', assignee: 10 },
        { title: 'Build student commuting modal split calculator', desc: 'Create interactive survey component estimating bike vs bus vs car footprint.', status: 'in_progress', prio: 'medium', assignee: 10 },
      ],
      roadmaps: [
        { phase: 1, name: 'Methodology & Data Pipeline', desc: 'Adopt ISO 14064-1 corporate carbon accounting guidelines.', deadline: '2026-10-10' },
        { phase: 2, name: 'Database Architecture & Schema', desc: 'Create relational models for building energy, diesel generators, and fleet fuel.', deadline: '2026-10-25' },
        { phase: 3, name: 'Interactive Emissions Dashboard', desc: 'Build Sankey diagrams and breakdown bar charts in React.', deadline: '2026-11-08' },
        { phase: 4, name: 'Student Gamification Features', desc: 'Introduce dormitory energy reduction competitions and badges.', deadline: '2026-11-18' },
        { phase: 5, name: 'University Administration Review', desc: 'Present platform to campus sustainability office.', deadline: '2026-11-22' },
        { phase: 6, name: 'Production Deployment', desc: 'Host on university subdomain for public viewing.', deadline: '2026-11-25' },
      ]
    },
    {
      id: 8,
      ownerId: 11, // Tanvi Joshi
      title: 'NeuroSync: BCI Focus & Stress Monitor',
      description: 'Wearable EEG brainwave companion application connecting to OpenBCI and Muse headbands. Computes theta/beta band power ratios to track cognitive fatigue during study sessions and guides students through personalized neurofeedback breathing.',
      domain: 'Healthcare',
      difficulty: 'advanced',
      status: 'in_progress',
      teamSizeTarget: 4,
      progressPct: 45,
      deadline: '2026-12-10',
      repoUrl: 'https://github.com/tanvi-bci/neurosync',
      hardwareReqs: 'Muse 2 or OpenBCI Ganglion EEG headband with Bluetooth Low Energy',
      skills: ['Python', 'Flutter', 'TensorFlow', 'FastAPI'],
      members: [
        { userId: 11, role: 'Biosignal Processing Lead' },
        { userId: 4, role: 'Neural Network Advisor' },
      ],
      tasks: [
        { title: 'Implement 50Hz notch filter and bandpass (4-40Hz) in SciPy', desc: 'Eliminate power line electrical interference from raw electrode voltage.', status: 'completed', prio: 'urgent', assignee: 11 },
        { title: 'Extract fast Fourier transform (FFT) bandpowers over 2s epochs', desc: 'Calculate alpha, beta, theta, and delta absolute powers.', status: 'in_progress', prio: 'high', assignee: 11 },
      ],
      roadmaps: [
        { phase: 1, name: 'Hardware SDK & BLE Driver', desc: 'Connect to EEG headband streams over Bluetooth L2CAP socket.', deadline: '2026-10-05' },
        { phase: 2, name: 'Digital Signal Processing Pipeline', desc: 'Apply artifact removal for eye blinks and jaw clenches.', deadline: '2026-10-25' },
        { phase: 3, name: 'Cognitive State Classifier', desc: 'Train lightweight classifier for deep focus vs mind wandering.', deadline: '2026-11-15' },
        { phase: 4, name: 'Mobile App User Experience', desc: 'Develop calm, non-distracting Flutter interface with ambient sounds.', deadline: '2026-11-30' },
        { phase: 5, name: 'User Study with 20 Students', desc: 'Measure focus improvements during Pomodoro study intervals.', deadline: '2026-12-05' },
        { phase: 6, name: 'Final Release & Biofeedback Docs', desc: 'Publish open research repository and setup guides.', deadline: '2026-12-10' },
      ]
    },
    {
      id: 9,
      ownerId: 12, // Aditya Rao
      title: 'IntelliRoute: Dynamic EV Charging Optimizer',
      description: 'Smart campus electric vehicle fleet router using Graph Neural Networks and spatio-temporal traffic predictions. Optimizes charging queue schedules to minimize campus peak demand surcharges and student wait times.',
      domain: 'Smart Campus',
      difficulty: 'intermediate',
      status: 'in_progress',
      teamSizeTarget: 4,
      progressPct: 55,
      deadline: '2026-11-28',
      repoUrl: 'https://github.com/aditya-graphs/intelliroute-ev',
      hardwareReqs: 'Campus EV Charger OCPI API Integration',
      skills: ['Python', 'Graph Neural Networks', 'FastAPI', 'PostgreSQL', 'Redis'],
      members: [
        { userId: 12, role: 'Optimization & Graph Lead' },
        { userId: 10, role: 'Geospatial Data Engineer' },
      ],
      tasks: [
        { title: 'Construct campus road network graph in NetworkX/PyG', desc: 'Model 42 intersection nodes with elevation and speed limits.', status: 'completed', prio: 'high', assignee: 12 },
        { title: 'Formulate MILP solver for charging station slot reservation', desc: 'Maximize renewable solar utilization during 11 AM - 3 PM window.', status: 'in_progress', prio: 'urgent', assignee: 12 },
      ],
      roadmaps: [
        { phase: 1, name: 'Graph Topology Modeling', desc: 'Ingest campus OpenStreetMap data and charger locations.', deadline: '2026-10-02' },
        { phase: 2, name: 'Queue Prediction GNN Training', desc: 'Train spatio-temporal graph convolutional model on historical occupancy.', deadline: '2026-10-22' },
        { phase: 3, name: 'Dispatch & Route API', desc: 'Build sub-100ms FastAPI recommendation endpoints with Redis caching.', deadline: '2026-11-05' },
        { phase: 4, name: 'Driver Navigation PWA', desc: 'Provide turn-by-turn routing with charger slot reservation countdown.', deadline: '2026-11-18' },
        { phase: 5, name: 'Simulation Benchmark', desc: 'Simulate 200 EV arrivals and quantify reduction in grid peak strain.', deadline: '2026-11-24' },
        { phase: 6, name: 'Pilot Rollout with Campus Security Vehicles', desc: 'Deploy app to 8 campus patrol electric carts.', deadline: '2026-11-28' },
      ]
    },
    {
      id: 10,
      ownerId: 8, // Vikram Malhotra
      title: 'CloudSentry: Automated Kubernetes Security Scanner',
      description: 'Continuous cloud native posture management tool that scans running Kubernetes clusters for misconfigured RBAC privileges, privileged container escapes, unpatched CVEs in image registries, and overly permissive NetworkPolicies.',
      domain: 'Cloud/DevOps',
      difficulty: 'advanced',
      status: 'in_progress',
      teamSizeTarget: 3,
      progressPct: 60,
      deadline: '2026-11-10',
      repoUrl: 'https://github.com/vikram-cloud/cloudsentry-k8s',
      hardwareReqs: 'Minikube / k3s development cluster',
      skills: ['Kubernetes', 'Docker', 'Go', 'AWS', 'GitHub Actions'],
      members: [
        { userId: 8, role: 'Cloud Infrastructure Lead' },
        { userId: 5, role: 'Security Vulnerability Analyst' },
      ],
      tasks: [
        { title: 'Build Admission Controller webhook in Go', desc: 'Intercept Pod creation requests and deny root execution or hostPath mounts.', status: 'completed', prio: 'urgent', assignee: 8 },
        { title: 'Integrate Trivy container image vulnerability scanner', desc: 'Cache vulnerability DB in Redis for fast delta scans.', status: 'completed', prio: 'high', assignee: 8 },
        { title: 'Write compliance reporter for CIS Kubernetes Benchmark', desc: 'Generate downloadable PDF and JSON compliance audit audits.', status: 'in_progress', prio: 'medium', assignee: 5 },
      ],
      roadmaps: [
        { phase: 1, name: 'Kubernetes Controller Architecture', desc: 'Design informer caches and CRDs for SecurityPolicy custom resources.', deadline: '2026-09-20' },
        { phase: 2, name: 'Runtime Inspection Engine', desc: 'Implement automated RBAC graph traversal to spot privilege escalation.', deadline: '2026-10-05' },
        { phase: 3, name: 'Vulnerability Scanner Pipeline', desc: 'Automate image scanning upon every deployment event.', deadline: '2026-10-18' },
        { phase: 4, name: 'Web Dashboard & Remediation CLI', desc: 'Provide one-click kubectl patch generation for discovered flaws.', deadline: '2026-10-30' },
        { phase: 5, name: 'End-to-End Cluster Chaos Testing', desc: 'Deploy intentionally vulnerable pods and confirm 100% detection.', deadline: '2026-11-05' },
        { phase: 6, name: 'Helm Chart & Public Release', desc: 'Publish open-source Helm repository for one-line installation.', deadline: '2026-11-10' },
      ]
    },
  ];

  for (const p of projectsData) {
    const res = db.execute(
      `INSERT INTO projects (
        id, owner_id, title, description, domain, difficulty, status,
        team_size_target, progress_pct, deadline, repo_url, hardware_reqs
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        p.id,
        p.ownerId,
        p.title,
        p.description,
        p.domain,
        p.difficulty,
        p.status,
        p.teamSizeTarget,
        p.progressPct,
        p.deadline,
        p.repoUrl,
        p.hardwareReqs,
      ]
    );

    // Project Skills
    for (const skName of p.skills) {
      const skillId = skillIdMap.get(skName);
      if (skillId) {
        db.execute(
          'INSERT INTO project_skills (project_id, skill_id, is_required) VALUES (?, ?, 1)',
          [p.id, skillId]
        );
      }
    }

    // Project Members
    for (const m of p.members) {
      db.execute(
        'INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)',
        [p.id, m.userId, m.role]
      );
    }

    // Project Tasks
    for (const t of p.tasks) {
      db.execute(
        `INSERT INTO tasks (project_id, title, description, assignee_id, status, priority, deadline, labels)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          p.id,
          t.title,
          t.desc,
          t.assignee,
          t.status,
          t.prio,
          '2026-10-20',
          JSON.stringify(['core', p.domain.toLowerCase()]),
        ]
      );
    }

    // Roadmaps
    for (const r of p.roadmaps) {
      const rRes = db.execute(
        `INSERT INTO roadmaps (project_id, phase_number, phase_name, description, target_deadline)
         VALUES (?, ?, ?, ?, ?)`,
        [p.id, r.phase, r.name, r.desc, r.deadline]
      );
      const roadmapId = Number(rRes.lastInsertRowid);

      // Seed 2 sub-tasks per phase
      db.execute(
        `INSERT INTO roadmap_tasks (roadmap_id, title, is_completed, suggested_deadline)
         VALUES (?, ?, ?, ?)`,
        [roadmapId, `${r.name}: Milestone 1 Setup & Verification`, r.phase <= 2 ? 1 : 0, r.deadline]
      );
      db.execute(
        `INSERT INTO roadmap_tasks (roadmap_id, title, is_completed, suggested_deadline)
         VALUES (?, ?, ?, ?)`,
        [roadmapId, `${r.name}: Peer Review & Documentation`, r.phase === 1 ? 1 : 0, r.deadline]
      );
    }
  }
  console.log(`✅ Seeded ${projectsData.length} projects with tasks, roadmaps, and member rosters`);

  // 4. Seed Invitations & Notifications
  // Yashwanth invited Rahul Sharma to IoT project
  db.execute(
    `INSERT INTO invitations (project_id, sender_id, recipient_id, role_offered, status, message)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      1,
      1,
      2,
      'Hardware Lead',
      'accepted',
      'Hey Rahul, saw your deep ESP32 experience. Would love to have you lead the firmware development for our campus energy monitor!',
    ]
  );

  // Yashwanth pending invitation to Priya Patel (UI)
  db.execute(
    `INSERT INTO invitations (project_id, sender_id, recipient_id, role_offered, status, message)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      1,
      1,
      3,
      'Frontend Architect',
      'pending',
      'Hi Priya, we need your React and UI design skills to build a stellar real-time telemetry dashboard. Interested?',
    ]
  );

  // Yashwanth pending invitation to Arjun Mehta (ML)
  db.execute(
    `INSERT INTO invitations (project_id, sender_id, recipient_id, role_offered, status, message)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      1,
      1,
      4,
      'ML Edge Specialist',
      'pending',
      'Arjun, we are adding TinyML power anomaly detection to our smart meter. Your expertise would be invaluable!',
    ]
  );

  // Seed Notifications for User 1 (Yashwanth)
  const notificationsData = [
    {
      userId: 1,
      type: 'invitation',
      title: 'Rahul Sharma accepted your invitation!',
      message: 'Rahul has joined IoT Smart Campus Energy Monitor as Hardware Lead.',
      link: '/projects/1/team',
      isRead: 1,
    },
    {
      userId: 1,
      type: 'recommendation',
      title: 'AI Match Alert: 96% Match Found',
      message: 'Arjun Mehta is an ideal candidate for your pending Machine Learning role.',
      link: '/students/4',
      isRead: 0,
    },
    {
      userId: 1,
      type: 'task',
      title: 'Task Assigned: Build live power gauge widget',
      message: 'You have been assigned to finish the SVG power meter component in React.',
      link: '/projects/1/tasks',
      isRead: 0,
    },
    {
      userId: 1,
      type: 'deadline',
      title: 'Roadmap Milestone Approaching',
      message: 'Phase 2: Firmware & Broker Architecture is due on Oct 10, 2026.',
      link: '/projects/1/roadmap',
      isRead: 0,
    },
  ];

  for (const n of notificationsData) {
    db.execute(
      `INSERT INTO notifications (user_id, type, title, message, link, is_read)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [n.userId, n.type, n.title, n.message, n.link, n.isRead]
    );
  }
  console.log(`✅ Seeded sample invitations and notifications`);

  // 5. Seed Reports for Admin Moderation
  db.execute(
    `INSERT INTO reports (reporter_id, target_type, target_id, reason, status)
     VALUES (?, ?, ?, ?, ?)`,
    [2, 'project', 5, 'Spam duplicate project listing during hackathon test.', 'pending']
  );
  db.execute(
    `INSERT INTO reports (reporter_id, target_type, target_id, reason, status)
     VALUES (?, ?, ?, ?, ?)`,
    [3, 'user', 14, 'Inactive user missing scheduled standup meetings.', 'reviewed']
  );
  console.log(`✅ Seeded admin moderation reports`);

  console.log('🎉 Database seeding completed successfully!');
}

// Run immediately if executed directly
if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  seedDatabase().catch(err => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  });
}
