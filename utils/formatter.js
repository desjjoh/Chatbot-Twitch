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

  const msInHour = 1000 * 60 * 60
  const hours = Math.trunc(duration / msInHour)

  if (hours > 0) {
    portions.push(hours + 'h')
    duration = duration - hours * msInHour
  }

  const msInMinute = 1000 * 60
  const minutes = Math.trunc(duration / msInMinute)

  if (minutes > 0) {
    portions.push(minutes + 'm')
    duration = duration - minutes * msInMinute
  }

  const seconds = Math.trunc(duration / 1000)
  if (seconds > 0) {
    portions.push(seconds + 's')
  }

  return portions.join(' ')
}

export { dehash, capitalize, mins2ms, timeConversion }
