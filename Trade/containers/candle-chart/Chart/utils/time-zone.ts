import moment from 'moment-timezone'

import {
  Timezone,
  CustomTimezones
} from '../../../../../../../public/charting_library/charting_library'

type TGetTimeZone = () => Timezone

const SUPPORTED_TZ: CustomTimezones[] = [
  'Africa/Cairo',
  'Africa/Johannesburg',
  'Africa/Lagos',
  'America/Argentina/Buenos_Aires',
  'America/Bogota',
  'America/Caracas',
  'America/Chicago',
  'America/El_Salvador',
  'America/Juneau',
  'America/Lima',
  'America/Los_Angeles',
  'America/Mexico_City',
  'America/New_York',
  'America/Phoenix',
  'America/Santiago',
  'America/Sao_Paulo',
  'America/Toronto',
  'America/Vancouver',
  'Asia/Almaty',
  'Asia/Ashkhabad',
  'Asia/Bahrain',
  'Asia/Bangkok',
  'Asia/Chongqing',
  'Asia/Dubai',
  'Asia/Ho_Chi_Minh',
  'Asia/Hong_Kong',
  'Asia/Jakarta',
  'Asia/Jerusalem',
  'Asia/Kathmandu',
  'Asia/Kolkata',
  'Asia/Kuwait',
  'Asia/Muscat',
  'Asia/Qatar',
  'Asia/Riyadh',
  'Asia/Seoul',
  'Asia/Shanghai',
  'Asia/Singapore',
  'Asia/Taipei',
  'Asia/Tehran',
  'Asia/Tokyo',
  'Atlantic/Reykjavik',
  'Australia/ACT',
  'Australia/Adelaide',
  'Australia/Brisbane',
  'Australia/Perth',
  'Australia/Sydney',
  'Europe/Athens',
  'Europe/Belgrade',
  'Europe/Berlin',
  'Europe/Copenhagen',
  'Europe/Helsinki',
  'Europe/Istanbul',
  'Europe/London',
  'Europe/Luxembourg',
  'Europe/Madrid',
  'Europe/Moscow',
  'Europe/Oslo',
  'Europe/Paris',
  'Europe/Riga',
  'Europe/Rome',
  'Europe/Stockholm',
  'Europe/Tallinn',
  'Europe/Vilnius',
  'Europe/Warsaw',
  'Europe/Zurich',
  'Pacific/Auckland',
  'Pacific/Chatham',
  'Pacific/Fakaofo',
  'Pacific/Honolulu',
  'Pacific/Norfolk',
  'US/Mountain'
]

const DEFAULT_TZ = 'Etc/UTC' as const

const getTimezoneOffset = (tz: CustomTimezones) => moment.utc().tz(tz).utcOffset()

export const getTimeZone: TGetTimeZone = () => {
  const currentTZ = Intl.DateTimeFormat().resolvedOptions().timeZone as CustomTimezones

  if (!currentTZ) {
    return DEFAULT_TZ
  }

  if (SUPPORTED_TZ.includes(currentTZ)) {
    return currentTZ
  }

  const currentOffset = getTimezoneOffset(currentTZ)

  let similarTZ: Timezone = DEFAULT_TZ

  SUPPORTED_TZ.some((TZ) => {
    if (currentOffset === getTimezoneOffset(TZ)) {
      similarTZ = TZ
      return true
    }
    return false
  })

  return similarTZ
}
