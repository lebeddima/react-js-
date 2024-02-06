import type { TPair } from '@/types/global'

export const pairMock: TPair = {
  id: 54,
  lastPrice: '6',
  lastPriceFiat: '21459.53',
  minPrice: '0.9999',
  maxPrice: '1.0001',
  mainVolume: '7368.82',
  baseVolume: '7369.187802',
  change: '0',
  changeAbs: '0',
  priceDecimals: 4,
  quantityDecimals: 6,
  totalDecimals: 8,
  marketCup: '0',
  isFavourite: false,
  mainCurrency: {
    id: 55,
    name: 'Bitcoin Additional',
    code: 'btca',
    logo: 'https://api.quan2um.com/images/currencies/6AqslQvMlgezUMxRaZXqRWQ3ItpyWtp7JExNHIqR.svg',
    logoPng:
      'https://api.quan2um.com/images/currencies/xsCKVv77suK6hqDzo1Gv79hA1TmffPGowwPZHV53.png',
    logoAlt: 'Bitcoin Additional',
    colorHex: '#1CC5BD',
    isFiat: false,
    decimals: 8,
    canDeposit: false,
    canWithdrawal: true
  },
  baseCurrency: {
    id: 2,
    name: 'Bitcoin',
    code: 'btc',
    logo: 'https://api.quan2um.com/images/currencies/iUyC6O6tZz2dUPjSVzG6sRbZMJ5KQmfyweZTPUgk.svg',
    logoPng:
      'https://api.quan2um.com/images/currencies/3VTISKrjSJkN4sXG5W0YeEy5bDAD0XoFsvp8QERV.png',
    logoAlt: 'Bitcoin',
    colorHex: '#FFAA00',
    isFiat: false,
    decimals: 8,
    canDeposit: true,
    canWithdrawal: true
  }
}
