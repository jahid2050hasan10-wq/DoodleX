export type DepositRequest = {
  id: string;
  user: string;
  method: 'bkash' | 'nagad' | 'rocket' | 'upay';
  amount: number;
  trxId: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
};

export type AppUser = {
  id: string;
  name: string;
  phone: string;
  balance: number;
  matchesPlayed: number;
  matchesWon: number;
  joinedDate: string;
  status: 'active' | 'banned';
};

export const depositRequests: DepositRequest[] = [
  { id: 'd1', user: 'rahim_07', method: 'bkash', amount: 200, trxId: '8N7K4M2XYZ', date: '22 Oct, 3:15 PM', status: 'pending' },
  { id: 'd2', user: 'karim_bd', method: 'nagad', amount: 500, trxId: '9P2Q8R1ABC', date: '22 Oct, 2:40 PM', status: 'pending' },
  { id: 'd3', user: 'sadia_x', method: 'rocket', amount: 100, trxId: '7T6Y3U9LMN', date: '22 Oct, 1:20 PM', status: 'pending' },
  { id: 'd4', user: 'nayem99', method: 'upay', amount: 300, trxId: '5W1E2R4OPQ', date: '22 Oct, 12:05 PM', status: 'approved' },
  { id: 'd5', user: 'tania_z', method: 'bkash', amount: 150, trxId: '3K8J5H1DEF', date: '21 Oct, 11:30 PM', status: 'rejected' },
];

export const users: AppUser[] = [
  { id: 'u1', name: 'Rahim Ahmed', phone: '01711-223344', balance: 850, matchesPlayed: 24, matchesWon: 11, joinedDate: '15 Oct 2026', status: 'active' },
  { id: 'u2', name: 'Karim Hossain', phone: '01811-445566', balance: 1200, matchesPlayed: 42, matchesWon: 28, joinedDate: '10 Oct 2026', status: 'active' },
  { id: 'u3', name: 'Sadia Islam', phone: '01911-778899', balance: 320, matchesPlayed: 18, matchesWon: 7, joinedDate: '18 Oct 2026', status: 'active' },
  { id: 'u4', name: 'Nayem Rahman', phone: '01611-112233', balance: 50, matchesPlayed: 9, matchesWon: 2, joinedDate: '20 Oct 2026', status: 'active' },
  { id: 'u5', name: 'Tania Zaman', phone: '01511-667788', balance: 0, matchesPlayed: 5, matchesWon: 0, joinedDate: '21 Oct 2026', status: 'banned' },
  { id: 'u6', name: 'Fahim Kabir', phone: '01711-998877', balance: 430, matchesPlayed: 31, matchesWon: 19, joinedDate: '12 Oct 2026', status: 'active' },
];
