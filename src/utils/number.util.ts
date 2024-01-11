type IUseNumberUtil = {
  generateRandomNum: (min: number, max: number) => number
}

function useNumberUtil(): IUseNumberUtil {
  function generateRandomNum(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  return {
    generateRandomNum
  }
}

export { useNumberUtil }
