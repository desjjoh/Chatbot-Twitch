type IUseNumberUtil = {
  mins2ms: (payload: number) => number
  generateRandomNum: (min: number, max: number) => number
}

function useNumberUtil(): IUseNumberUtil {
  function mins2ms(payload: number): number {
    return payload * 60 * 1000
  }

  function generateRandomNum(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  return {
    mins2ms,
    generateRandomNum
  }
}

export { useNumberUtil }
