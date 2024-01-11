import { useStringUtil } from './string.util.ts'

type IUseDateTimeUtil = {
  formatMilliseconds: (payload: number, padStart?: boolean) => string
  mins2ms(payload: number): number
}

const STRING = useStringUtil()

function useDateTimeUtil(): IUseDateTimeUtil {
  function mins2ms(payload: number): number {
    return payload * 60 * 1000
  }

  function formatMilliseconds(payload: number) {
    let asSeconds = payload / 1000

    let hours = undefined
    let minutes = Math.floor(asSeconds / 60)

    if (minutes > 59) {
      hours = Math.floor(minutes / 60)
      minutes %= 60
    }

    return hours
      ? `${hours} ${STRING.pluralize({ word: 'hour', value: hours })} ${minutes} ${STRING.pluralize({
          word: 'min',
          value: minutes
        })}`
      : `${minutes} ${STRING.pluralize({ word: 'minute', value: minutes })}`
  }

  return { formatMilliseconds, mins2ms }
}

export { useDateTimeUtil }
