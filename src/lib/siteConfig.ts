export interface BioLink {
  text: string;
  url: string;
  external?: boolean;
}

export interface ContactItem {
  label: string;
  value: string;
  url: string;
  type: 'email' | 'social';
  external?: boolean;
}

export interface SiteConfig {
name: string;
title: string;
description: string;
author: string;
keywords: string[];
url: string;
locale: string;
type: string;
bio: {
text: string;
links?: BioLink[];
};
stats: {
hackathonsEntered: number;
hackathonsWon: number;
hosted: number;
commitsFloor: number;
nations: number;
firstGlobalRank: number;
publicRepos: number;
videos: number;
};
contact: {
email: string;
linkedin: string;
x: string;
github: string;
};
contactDisplay: ContactItem[];
}

export const siteConfig: SiteConfig = {
  name: 'Inky Ganbold',
  title: 'Inky Ganbold - Hackathon Winner & Open Source Contributor',
  description: 'Portfolio of Inky Ganbold, a CS student at De Anza who has won 11 prizes across 26 hackathons including YC Agent Hack, Stanford TreeHacks, HackMIT, and MIT Energy Hack. Active open-source contributor and hackathon organizer.',
  author: 'Inky Ganbold',
  keywords: ['Inky Ganbold', 'hackathon winner', 'computer science', 'open source', 'Stanford TreeHacks', 'HackMIT', 'YC Agent Hack', 'De Anza College', 'software developer', 'hackathon organizer'],
  url: 'https://enk.icu',
  locale: 'en_US',
  type: 'website',
  bio: {
    text: 'I build at the seam of hardware and software — brain–computer interfaces, autonomous robots, and AI systems. 11× winner across 26 hackathons (YC Agent Hack, TreeHacks, HackMIT, MIT Energy, Harvard) and host of 4 ([DAHacks], [DAHacks 3.0]). ~5,900 commits on [Github]; open hardware on [OSHWLab]; selected for [Google I/O] 2024 & 2025. Led Mongolia at [FIRST Global 2019]. More on [blogs] and [medium].',
    links: [
      {
        text: 'medium',
        url: 'https://enkhy.medium.com/',
        external: true
      },
      {
        text: 'OSHWLab',
        url: 'https://oshwlab.com/enkhbold470',
        external: true
      },
      {
        text: 'DAHacks',
        url: 'https://deanzahacks.com',
        external: true
      },
      {
        text: 'DAHacks 3.0',
        url: 'https://lavozdeanza.com/multimedia/video/2024/10/31/student-hackers-compete-at-da-hacks-3-0-hack-a-thon-for-over-7500-in-prizes/',
        external: true
      },
      {
        text: 'Github',
        url: 'https://github.com/enkhbold470',
        external: true
      },
      {
        text: 'Google I/O',
        url: 'https://www.linkedin.com/posts/enkhbold470_googleio-googleio-activity-7330860474412032001-yrzG',
        external: true
      },
      {
        text: 'FIRST Global 2019',
        url: 'https://first.global/2019-nations/mongolia-2019/',
        external: true
      },
      {
        text: 'blogs',
        url: '/blog',
        external: false
      }

    ]

  },
  stats: {
    hackathonsEntered: 26,
    hackathonsWon: 11,
    hosted: 4,
    commitsFloor: 5900,
    nations: 190,
    firstGlobalRank: 32,
    publicRepos: 200,
    videos: 70
  },
  contact: {
    email: 'inky@enk.icu',
    linkedin: 'https://www.linkedin.com/in/enkhbold470/',
    x: 'https://x.com/1nkfy',
    github: 'https://github.com/enkhbold470'
  },
  contactDisplay: [
    {
      label: 'Twitter',
      value: 'Twitter',
      url: 'https://x.com/1nkfy',
      type: 'social',
      external: true
    },
    {
      label: 'GitHub',
      value: 'Github',
      url: 'https://github.com/enkhbold470',
      type: 'social',
      external: true
    },
    {
      label: 'LinkedIn',
      value: 'LinkedIn',
      url: 'https://www.linkedin.com/in/enkhbold470/',
      type: 'social',
      external: true
    }
  ]
};

export const recentUpdates = [
  {
    date: 'October 31, 2024',
    title: 'Student hackers compete at DAHacks 3.0 hack-a-thon',
    url: 'https://lavozdeanza.com/multimedia/video/2024/10/31/student-hackers-compete-at-da-hacks-3-0-hack-a-thon-for-over-7500-in-prizes/'
  },
  {
    date: 'November 3, 2023',
    title: 'Electricity calculator design shocks De Anza Hackathon',
    url: 'https://lavozdeanza.com/features/2023/11/03/electricity-calculator-design-shocks-de-anza-hackathon/'
  }
];

// ── O-1 "extraordinary ability" dossier (evidence, only verified facts) ──────

export const heroTagline = 'NEURAL INTERFACES · AUTONOMOUS ROBOTICS · AI';

export interface EducationItem {
  school: string;
  detail: string;
  when: string;
}
export const education: EducationItem[] = [
  {
    school: 'San Jose State University',
    detail: 'B.S. Computer Science & Linguistics — incoming junior (transfer)',
    when: 'Expected 2028'
  },
  {
    school: 'De Anza College',
    detail: 'A.S. Computer Science & Engineering Physics',
    when: 'Transfer completed'
  }
];

// Original contributions of major significance
export interface FlagshipProject {
  ref: string;
  name: string;
  tag: string;
  pitch: string;
  contribution: string;
  stack: string[];
  href?: string;
}
export const projects: FlagshipProject[] = [
  {
    ref: 'U2',
    name: 'NeuroFocus V4 · bci-mcp',
    tag: 'Brain–Computer Interface',
    pitch:
      'A single-channel neural interface (Seeed Xiao ESP32-S3 + ADS1220 ADC) that acquires real EEG and exposes it to LLMs over the Model Context Protocol — open-sourced as bci-mcp.',
    contribution:
      'Authoring the protocol layer for how AI reads neural signals in real time — bleeding-edge human–computer interaction, not another app wrapper.',
    stack: ['ESP32-S3', 'ADS1220', 'MCP', 'Python'],
    href: 'https://github.com/enkhbold470/bci-mcp'
  },
  {
    ref: 'U3',
    name: 'GreenMate',
    tag: 'Spatial AR · IoT',
    pitch:
      'AR plant-health ecosystem: an ESP32-S3 sensor payload streams soil/light/humidity to ThingSpeak + MATLAB, visualized live through Snap AR Spectacles built in Lens Studio.',
    contribution:
      'Won the Snap AR Challenge at Columbia DivHacks 2024 — AR, embedded firmware, and cloud executed end-to-end across one stack.',
    stack: ['ESP32-S3', 'Lens Studio / GLSL', 'ThingSpeak', 'MATLAB'],
    href: 'https://github.com/enkhbold470/GreenMate'
  },
  {
    ref: 'U4',
    name: 'NeuroMouse V2.0 · RoboTrace',
    tag: 'Autonomous Robotics',
    pitch:
      'Maze-solving micromouse and line-tracing robots on ESP32-S3 / STM32 with custom PCBs, flood-fill search, and position-PID motion control.',
    contribution:
      '3rd overall at the All-America Micromouse Contest (IEEE @ UCLA, 2026) — deep embedded + hardware design, iterated fast on a hand-soldered prototype board.',
    stack: ['ESP32-S3', 'STM32F4', 'PID + Flood-fill', 'Custom PCB'],
    href: 'https://oshwlab.com/enkhbold470/micromouse'
  },
  {
    ref: 'U5',
    name: 'INKY · inky-gigachad',
    tag: 'Developer Tooling',
    pitch:
      'Open-source repo-intelligence tool that maps a codebase’s style and spins up a local MCP daemon enforcing architectural consistency across Cursor, Windsurf, and Claude Code.',
    contribution:
      'Selected for YC Vibecon; 100+ users within hours of launch — infrastructure other developers build on top of.',
    stack: ['TypeScript', 'MCP', 'Node.js'],
    href: 'https://github.com/enkhbold470/inky-gigachad'
  }
];

// Critical / essential roles for distinguished organizations
export interface Role {
  ref: string;
  org: string;
  title: string;
  period: string;
  points: string[];
}
export const roles: Role[] = [
  {
    ref: 'J5',
    org: 'TTF Robotics · Mongolian National Team',
    title: 'Founder & Team Lead',
    period: '2018 – 2019',
    points: [
      'Founded the robotics club and led Mongolia’s teen national team to FIRST Global 2019 in Dubai.',
      'Ranked 32nd of 190 nations (per the official FIRST Global archive) with a Java/C++ semi-autonomous, PID-controlled robot.'
    ]
  },
  {
    ref: 'J6',
    org: 'JLCPCB',
    title: 'North American Campus Ambassador',
    period: 'Apr 2025 – Present',
    points: [
      'Appointed by the global PCB manufacturer to lead hardware workshops on schematic capture, routing, and PCB-layout optimization.',
      'Organizes and hosts competitive regional robotics events across North American campuses.'
    ]
  },
  {
    ref: 'J7',
    org: 'De Anza College · ISP Office',
    title: 'Technical Lead',
    period: 'Apr 2025 – Present',
    points: [
      'Built and deployed a live production transfer-fair app upgrading internal institutional infrastructure.',
      'Engineered localized RAG chatbots automating onboarding for incoming student workers.'
    ]
  },
  {
    ref: 'J8',
    org: 'Beelog Technologies',
    title: 'Hardware Engineering Fellow',
    period: 'Oct 2020 – Apr 2022',
    points: [
      'Designed production-ready PCBs for IoT water-well grids and computer-vision reverse-vending recycling machines (ESP32 + OpenCV).'
    ]
  }
];

// Judging the work of others
export interface JudgingItem {
  ref: string;
  title: string;
  org: string;
  detail: string;
}
export const judging: JudgingItem[] = [
  {
    ref: 'TP1',
    title: 'Official Project Judge',
    org: 'UC Berkeley · Cal Hacks 12.0 (2025)',
    detail: 'Judged submissions at the largest collegiate hackathon (~700 projects, ~3,000 hackers).'
  },
  {
    ref: 'TP2',
    title: 'Tech Lead, Organizing Team',
    org: 'DA Hacks 3.0 & 3.5 · De Anza',
    detail: 'On the organizing/tech team for both events; built the judging tooling used to run them.'
  },
  {
    ref: 'TP3',
    title: 'Workshops Taught',
    org: 'De Anza · Google Developer Student Clubs',
    detail: 'Algorithms & Data Structures · Interactive Data Apps with Python + Streamlit · Arduino hardware.'
  }
];

// Awards & honors
export interface Award {
  date: string;
  title: string;
  org: string;
  href?: string;
}
export const awards: Award[] = [
  { date: '2026', title: '3rd Overall — NeuroMouse V2.0', org: 'All-America Micromouse Contest · IEEE @ UCLA' },
  { date: '2026', title: '2nd Place — CTF / Cybersecurity', org: 'Cloudathon · San Jose State University' },
  { date: '2025', title: 'Hackathon Prize', org: 'Dedalus Labs Hackathon' },
  { date: '2025', title: 'KnotAPI Sponsor Prize', org: 'HackMIT · MIT' },
  { date: '2025', title: 'Student Delegate', org: 'Google I/O · via GDSC' },
  { date: '2025', title: 'Best Student Life Hack — Naccent', org: 'UC Santa Barbara', href: 'https://github.com/enkhbold470/naccent' },
  { date: '2024', title: '1st — Snap AR Challenge — GreenMate', org: 'Columbia DivHacks', href: 'https://dorahacks.io/buidl/16986' },
  { date: '2024', title: 'Best Photoshoot', org: 'Columbia DivHacks' },
  { date: '2024', title: 'Best use of Multi-on', org: 'Agent Ops Hackathon' },
  { date: '2024', title: 'Best use of Groq', org: 'Agents Ops Hackathon' },
  { date: '2024', title: 'Student Delegate', org: 'Google I/O' },
  { date: '2024', title: 'Best Hardware — Clean Mars', org: 'San Francisco State University' },
  { date: '2024', title: '2nd Overall — NeuralNurse', org: 'Hack For Impact · UC Berkeley' },
  {
    date: '2023',
    title: '1st Place + Best Environment Hack',
    org: 'De Anza Hackathon (EnergyMate)',
    href: 'https://lavozdeanza.com/features/2023/11/03/electricity-calculator-design-shocks-de-anza-hackathon/'
  },
  { date: '2020', title: '1st Prize — Creative Thon', org: 'Huree University · TTF Robotics' },
  { date: '2019', title: 'Excellence of Innovation', org: 'TESO Corporation · TTF Robotics' },
  { date: '2019', title: 'Certificate of Excellence', org: 'FIRST Global · Dubai' }
];

// Authorship & open source
export interface AuthorItem {
  ref: string;
  label: string;
  detail: string;
  href?: string;
}
export const authorship: AuthorItem[] = [
  {
    ref: 'PUB1',
    label: 'Medium',
    detail: 'Long-form writing on robotics hardware and a 15-year build journey.',
    href: 'https://enkhy.medium.com/'
  },
  {
    ref: 'PUB2',
    label: 'OSHWLab / EasyEDA',
    detail: 'Open-source PCB schematics published for public reuse.',
    href: 'https://oshwlab.com/enkhbold470'
  },
  {
    ref: 'PUB3',
    label: 'Open Source',
    detail: 'Contributions to warpdotdev/warp and modelcontextprotocol/typescript-sdk.',
    href: 'https://github.com/enkhbold470'
  },
  {
    ref: 'PUB4',
    label: 'YouTube',
    detail: '70+ videos building hardware and software in public.'
  }
]
