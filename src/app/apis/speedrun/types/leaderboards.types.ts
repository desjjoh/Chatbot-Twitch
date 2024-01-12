// https://github.com/speedruncomorg/api/blob/master/version1/leaderboards.md

import { TDateISO } from "../../../../lib/types/date.types";

type values = { [key: string]: string }
type runs = { place: number; run: run }
type links = { rel: string; uri: string }
type uri = { uri: string }
type videos = { links: Array<uri> }

type status = {
  status: string
  examiner: string
  ['verify-date']: Date
}

type times = {
  primary: string
  primary_t: number
  realtime: string | null
  realtime_t: number
  realtime_noloads: string | null
  realtime_noloads_t: number
  ingame: string | null
  ingame_t: number
}
type system = {
  platform: string
  emulated: boolean
  region: string
}

type run = {
  id: string
  weblink: string
  game: string
  category: string
  videos: videos
  comment: string
  status: status
  date: string
  submitted: Date
  times: times
  system: system
  values: values
}

type leaderboard = {
  data: {
    weblink: string
    game: string
    category: string
    level: string | null
    platform: string | null
    region: string | null
    emulators: boolean | null
    ['video-only']: boolean | null
    timing: string | null
    values: values
    runs: Array<runs>
    links: Array<links>
  }
}

type leaderboardParams = {
  [key: `var-${string}`]: string // additional custom variable values
  top?: number // only return the top N places (this can result in more than N runs!)
  platform?: string // platform ID; when given, only returns runs done on that particular platform
  region?: string // region ID; when given, only returns runs done in that particular region
  emulators?: boolean // when not given, real devices and emulators are shown. When set to a true value, only emulators are shown, else only real devices are shown
  ['video-only']?: boolean // false by default; when set to a true value, only runs with a video will be returned
  timing?: 'realtime' | 'realtime_noloads' | 'ingame' // controls the sorting; can be one of realtime, realtime_noloads or ingame
  date?: TDateISO // ISO 8601 date string; when given, only returns runs done before or on this date
}

export { leaderboard, leaderboardParams }
