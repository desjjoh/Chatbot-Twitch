import { IUseStringFormatter, IPluralize, IUseNumberFormatter, IUseDateTimeFormatter } from '../lib/types/formatter.ts'

function useStringFormatter(): IUseStringFormatter {
  function dehash(payload: string): string {
    return payload.replace(/^#/, '')
  }

  function capitalize(payload: string): string {
    return payload[0].toUpperCase() + payload.slice(1)
  }

  function pluralize({ value, word, plural = word + 's' }: IPluralize): string {
    if (value == 1) return word
    return plural
  }

  return {
    dehash,
    capitalize,
    pluralize
  }
}

function useNumberFormatter(): IUseNumberFormatter {
  function mins2ms(payload: number): number {
    return payload * 60 * 1000
  }

  return {
    mins2ms
  }
}

function useDateTimeFormatter(): IUseDateTimeFormatter {
  function formatMilliseconds(payload: number) {
    const useSF = useStringFormatter()
    let asSeconds = payload / 1000

    let hours = undefined
    let minutes = Math.floor(asSeconds / 60)

    if (minutes > 59) {
      hours = Math.floor(minutes / 60)
      minutes %= 60
    }

    return hours
      ? `${hours} ${useSF.pluralize({ word: 'hour', value: hours })} ${minutes} ${useSF.pluralize({
          word: 'min',
          value: minutes
        })}`
      : `${minutes} ${useSF.pluralize({ word: 'minute', value: minutes })}`
  }

  return {
    formatMilliseconds
  }
}

export { useStringFormatter, useNumberFormatter, useDateTimeFormatter }
