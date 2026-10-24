import type { GameId } from '@/data/games';

export type Match = {
  id: string;
  gameId: GameId;
  label: string;
  mode: string;
  entryFee: number;
  firstPrize: number;
  secondPrize: number;
  slotsFilled: number;
  slotsTotal: number;
};

export const matches: Match[] = [
  {
    id: 'mm-3v3-001',
    gameId: 'mini-militia',
    label: 'Match #001',
    mode: '3v3',
    entryFee: 30,
    firstPrize: 150,
    secondPrize: 60,
    slotsFilled: 4,
    slotsTotal: 6,
  },
  {
    id: 'mm-ffa-002',
    gameId: 'mini-militia',
    label: 'Match #002',
    mode: '6-FFA',
    entryFee: 50,
    firstPrize: 250,
    secondPrize: 100,
    slotsFilled: 3,
    slotsTotal: 6,
  },
  {
    id: 'mm-3v3-003',
    gameId: 'mini-militia',
    label: 'Match #003',
    mode: '3v3',
    entryFee: 100,
    firstPrize: 500,
    secondPrize: 200,
    slotsFilled: 2,
    slotsTotal: 6,
  },
  {
    id: 'ludo-1v1-001',
    gameId: 'ludo-3d',
    label: 'Match #001',
    mode: '1v1',
    entryFee: 20,
    firstPrize: 35,
    secondPrize: 0,
    slotsFilled: 1,
    slotsTotal: 2,
  },
  {
    id: 'ludo-2v2-002',
    gameId: 'ludo-3d',
    label: 'Match #002',
    mode: '2v2',
    entryFee: 40,
    firstPrize: 70,
    secondPrize: 0,
    slotsFilled: 2,
    slotsTotal: 4,
  },
  {
    id: 'carrom-1v1-001',
    gameId: 'carrom-pool',
    label: 'Match #001',
    mode: '1v1',
    entryFee: 20,
    firstPrize: 35,
    secondPrize: 0,
    slotsFilled: 1,
    slotsTotal: 2,
  },
  {
    id: 'carrom-2v2-002',
    gameId: 'carrom-pool',
    label: 'Match #002',
    mode: '2v2',
    entryFee: 40,
    firstPrize: 70,
    secondPrize: 0,
    slotsFilled: 0,
    slotsTotal: 4,
  },
  {
    id: 'guti-1v1-001',
    gameId: '16-guti',
    label: 'Match #001',
    mode: '1v1',
    entryFee: 25,
    firstPrize: 45,
    secondPrize: 0,
    slotsFilled: 1,
    slotsTotal: 2,
  },
  {
    id: 'guti-1v1-002',
    gameId: '16-guti',
    label: 'Match #002',
    mode: '1v1',
    entryFee: 60,
    firstPrize: 100,
    secondPrize: 0,
    slotsFilled: 0,
    slotsTotal: 2,
  },
  {
    id: 'free-001',
    gameId: 'free-match',
    label: 'Casual #001',
    mode: 'Any',
    entryFee: 0,
    firstPrize: 0,
    secondPrize: 0,
    slotsFilled: 5,
    slotsTotal: 8,
  },
  {
    id: 'free-20-001',
    gameId: 'free-20',
    label: 'Daily Bonus',
    mode: '1v1',
    entryFee: 0,
    firstPrize: 20,
    secondPrize: 0,
    slotsFilled: 1,
    slotsTotal: 2,
  },
];
