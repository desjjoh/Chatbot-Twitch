import * as fs from 'fs'
import Path from 'path'
import Bull from 'bull'
import Moment from 'moment'

import { LoggerPayloadType } from '../lib/types/logger.ts'

const CONFIG: Bull.QueueOptions = {}
const logger: Bull.Queue<LoggerPayloadType> = new Bull<LoggerPayloadType>('logger', CONFIG)

function readFile(srcPath: string): string | undefined {
  if (fs.existsSync(srcPath)) return fs.readFileSync(srcPath, { encoding: 'utf8' })
  else return undefined
}

async function logEvent({ action, message }: LoggerPayloadType): Promise<void> {
  const moment: Moment.Moment = Moment()
  const timeString: string = moment.format('HH:mm')
  const dateString: string = moment.format('YYYYMMDD')
  const calendar: string = moment.calendar()

  const MSG: string = `[${timeString}] ${action}: ${message}`
  console.log(MSG)

  const srcPath: string = Path.join(process.cwd(), `./logs/${dateString}.log`)
  let logs: string = readFile(srcPath) || `[${timeString}] LOG START -- ${calendar}`
  logs += `\n${MSG}`

  await new Promise<void>((resolve, reject) => {
    fs.writeFile(srcPath, logs, (err) => {
      if (err) {
        reject(`Could not write to file ${srcPath}.`)
      } else resolve()
    })
  })
}

logger.empty()
logger.process(async (job: Bull.Job<LoggerPayloadType>, done: Bull.DoneCallback) => {
  await logEvent(job.data).then(
    () => done(),
    (err) => done(err)
  )
})

export { logger }
