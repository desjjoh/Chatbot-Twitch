import { IUseStringFormatter, IPluralize, IUseNumberFormatter } from '../lib/types/formatter.ts'

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

export { useStringFormatter, useNumberFormatter }
