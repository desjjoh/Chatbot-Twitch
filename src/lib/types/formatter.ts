type IPluralize = { value: number; word: string; plural?: string }

type IUseStringFormatter = {
  dehash: (payload: string) => string
  capitalize: (payload: string) => string
  pluralize: (payload: IPluralize) => string
}

type IUseNumberFormatter = {
  mins2ms: (payload: number) => number
}

export { IPluralize, IUseStringFormatter, IUseNumberFormatter }
