export type GameId =
  | 'mini-militia'
  | 'ludo-3d'
  | 'carrom-pool'
  | '16-guti'
  | 'free-match'
  | 'free-20'
  | 'premium';

export type GameCard = {
  id: GameId;
  title: string;
  subtitle: string;
  image: string;
  accent: string;
  badge?: string;
  customArt?: 'mini-militia' | 'free-match' | 'premium';
  section?: 'games' | 'premium';
};

export const games: GameCard[] = [
  {
    id: 'mini-militia',
    title: 'Mini Militia',
    subtitle: '3v3 · 6-FFA',
    image:
      'https://images.pexels.com/photos/5795433/pexels-photo-5795433.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    accent: '#22f0e6',
    badge: 'HOT',
  },
  {
    id: 'ludo-3d',
    title: 'Ludo 3D',
    subtitle: '1v1 · 2v2',
    image:
      'https://images.pexels.com/photos/11646952/pexels-photo-11646952.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    accent: '#39ff8a',
  },
  {
    id: 'carrom-pool',
    title: 'Carrom Pool 3D',
    subtitle: '1v1 · 2v2',
    image:
      'https://images.pexels.com/photos/31686613/pexels-photo-31686613.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    accent: '#ff3df0',
  },
  {
    id: '16-guti',
    title: '16-Guti',
    subtitle: '1v1',
    image:
      'https://images.pexels.com/photos/32072058/pexels-photo-32072058.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    accent: '#ffe94e',
  },
  {
    id: 'free-match',
    title: 'Free Match',
    subtitle: 'Casual Play',
    image:
      'https://images.pexels.com/photos/9072216/pexels-photo-9072216.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    accent: '#22f0e6',
    customArt: 'free-match',
  },
  {
    id: 'free-20',
    title: 'ফ্রি ২০ টাকা',
    subtitle: 'Daily Bonus',
    image:
      'https://images.pexels.com/photos/20843727/pexels-photo-20843727.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    accent: '#39ff8a',
    badge: 'FREE',
  },
  {
    id: 'premium',
    title: 'Premium',
    subtitle: 'VIP Membership',
    image: '',
    accent: '#d4af37',
    badge: 'VIP',
    customArt: 'premium',
    section: 'premium',
  },
];
