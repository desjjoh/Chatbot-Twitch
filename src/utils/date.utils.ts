import { useStringUtil } from './string.utils.ts'

type IUseDateTimeUtil = {
  formatMilliseconds: (payload: number, padStart?: boolean) => string
}

const STRING = useStringUtil()

function useDateTimeUtil(): IUseDateTimeUtil {
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

  return {
    formatMilliseconds
  }
}

export { useDateTimeUtil }
