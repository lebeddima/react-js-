import type { TPairBalances } from '@/types/global'

export const balanceMock: TPairBalances = {
  main: {
    holdenBalance: '0',
    availableBalance: '2',
    totalBalance: '2',
    userId: 1,
    assetId: 1
  },
  base: {
    holdenBalance: '0',
    availableBalance: '4',
    totalBalance: '4',
    userId: 1,
    assetId: 2
  }
}
