import { TeamMember } from '@/types';

export const DEFAULT_TEAM: TeamMember[] = [
  // Core Leaders
  {
    id: 'jeet-chauhan',
    name: 'Jeet Chauhan',
    role: 'Faculty Advisor / Lead',
    team: 'leader',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Jeet&gender=male',
    bio: 'Guiding the community with technical excellence and leadership.',
    socials: { linkedin: '#', github: '#' }
  },
  {
    id: 'anuj-bhadouria',
    name: 'Anuj Bhadouria',
    role: 'Lead',
    team: 'leader',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Anuj&gender=male',
    bio: 'Driving innovation and growth within the GDGOC ecosystem.',
    socials: { linkedin: '#', github: '#' }
  },
  // Tech Team
  {
    id: 'manthan-balani',
    name: 'Manthan Balani',
    role: 'Team Lead (Tech)',
    team: 'leader',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Manthan&gender=male',
    bio: 'Tech enthusiast and visionary leader for the technology department.',
    socials: { linkedin: '#', github: '#' }
  },
  {
    id: 'chidatma-patel',
    name: 'Chidatma Patel',
    role: 'Core Member',
    team: 'tech',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Chidatma&gender=male',
    bio: 'Passionate developer focusing on building robust core systems.',
    socials: { linkedin: '#', github: '#' }
  },
  {
    id: 'devashya-jethva',
    name: 'Devashya Jethva',
    role: 'Core Member',
    team: 'tech',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Devashya&gender=male',
    bio: 'Creative problem solver and technology enthusiast.',
    socials: { linkedin: '#', github: '#' }
  },
  {
    id: 'neil',
    name: 'Neil',
    role: 'Core Member',
    team: 'tech',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Neil&gender=male',
    bio: 'Fullstack developer committed to shipping high-quality code.',
    socials: { linkedin: '#', github: '#' }
  },
  // Documentation Team
  {
    id: 'naitri-mori',
    name: 'Naitri Mori',
    role: 'Team Lead (Docs)',
    team: 'leader',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Naitri&gender=female',
    bio: 'Detail-oriented leader bridging the gap between tech and storytelling.',
    socials: { linkedin: '#', github: '#' }
  },
  {
    id: 'alifiya-pisawadi',
    name: 'Alifiya Pisawadi',
    role: 'Core Member',
    team: 'documentation',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Alifiya&gender=female',
    bio: 'Passionate about clear and effective communication.',
    socials: { linkedin: '#', github: '#' }
  },
  {
    id: 'ruhan-chanchalani',
    name: 'Ruhan Chanchalani',
    role: 'Core Member',
    team: 'documentation',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Ruhan&gender=male',
    bio: 'Documentation expert with a knack for organization.',
    socials: { linkedin: '#', github: '#' }
  },
  // Marketing Team
  {
    id: 'dhruvil-mamtora',
    name: 'Dhruvil Mamtora',
    role: 'Team Lead (Marketing)',
    team: 'leader',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Dhruvil&gender=male',
    bio: 'Marketing strategist and community builder.',
    socials: { linkedin: '#', github: '#' }
  },
  {
    id: 'chauhan-rajvardhansingh',
    name: 'Chauhan Rajvardhansingh Narendrasingh',
    role: 'Core Member',
    team: 'marketing',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Rajvardhan&gender=male',
    bio: 'Creative marketer and outreach specialist.',
    socials: { linkedin: '#', github: '#' }
  },
  {
    id: 'radhe-thakkar',
    name: 'Radhe M Thakkar',
    role: 'Core Member',
    team: 'marketing',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Radhe&gender=male',
    bio: 'Social media growth and branding expert.',
    socials: { linkedin: '#', github: '#' }
  },
  {
    id: 'janvi-verma',
    name: 'Janvi Verma',
    role: 'Core Member',
    team: 'marketing',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Janvi&gender=female',
    bio: 'Creative designer and content curator.',
    socials: { linkedin: '#', github: '#' }
  },
  // Outreach Team
  {
    id: 'shailey-maheshwari',
    name: 'Shailey Maheshwari',
    role: 'Team Lead (Outreach)',
    team: 'leader',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Shailey&gender=female',
    bio: 'Passionate about community engagement and partnerships.',
    socials: { linkedin: '#', github: '#' }
  },
  {
    id: 'diya-dave',
    name: 'Diya Dave',
    role: 'Core Member',
    team: 'outreach',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Diya&gender=female',
    bio: 'Networking enthusiast and community advocate.',
    socials: { linkedin: '#', github: '#' }
  },
  // Operations Team
  {
    id: 'trusha-kansara',
    name: 'Trusha Kansara',
    role: 'Team Lead (Operations)',
    team: 'leader',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Trusha&gender=female',
    bio: 'Logistics and operations expert keeping things running smoothly.',
    socials: { linkedin: '#', github: '#' }
  },
  {
    id: 'vachna-shah',
    name: 'Vachna Shah',
    role: 'Core Member',
    team: 'operations',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Vachna&gender=female',
    bio: 'Operational strategist with a focus on efficiency.',
    socials: { linkedin: '#', github: '#' }
  },
  {
    id: 'shrusti-chauhan',
    name: 'Shrusti Chauhan',
    role: 'Core Member',
    team: 'operations',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Shrusti&gender=female',
    bio: 'Detail-oriented operations assistant.',
    socials: { linkedin: '#', github: '#' }
  }
];
