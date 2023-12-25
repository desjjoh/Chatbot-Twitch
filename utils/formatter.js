function dehash(string) {
  return string.replace(/^#/, '')
}

function capitalize(payload) {
  return payload[0].toUpperCase() + string.slice(1)
}

function mins2ms(number) {
  return number * 60 * 1000
}

function timeConversion(payload) {
  let duration = payload
  const portions = []

  const msInDay = 1000 * 60 * 60 * 24
  const days = Math.trunc(duration / msInDay)
  portions.push(days + 'd')
  duration = duration - days * msInDay

  const msInHour = 1000 * 60 * 60
  const hours = Math.trunc(duration / msInHour)
  portions.push(hours + 'h')
  duration = duration - hours * msInHour

  const msInMinute = 1000 * 60
  const minutes = Math.trunc(duration / msInMinute)
  portions.push(minutes + 'm')
  duration = duration - minutes * msInMinute

  const seconds = Math.trunc(duration / 1000)
  portions.push(seconds + 's')

  return portions.join(' ')
}

export { dehash, capitalize, mins2ms, timeConversion }
