function dehash(string) {
  return string.replace(/^#/, '')
}

function mins2ms(number) {
  return number * 60 * 1000
}

export { dehash, mins2ms }
