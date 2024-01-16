import Path from 'path'
import Bull from 'bull'
import Moment from 'moment'

import { LoggerPayloadType } from '../../lib/types/logger.types.ts'
import { useFileManager } from '../../lib/utils/fileManager.util.ts'

const logger: Bull.Queue<LoggerPayloadType> = new Bull<LoggerPayloadType>('logger')
const FM = useFileManager()

async function logEvent({ action, message }: LoggerPayloadType): Promise<void> {
  const moment: Moment.Moment = Moment()
  const timeString: string = moment.format('HH:mm')
  const dateString: string = moment.format('YYYYMMDD')
  const calendar: string = moment.format('L')

  const MSG: string = `[${timeString}] ${action}: ${message}`
  console.log(MSG)

  const srcPath: string = Path.join(process.cwd(), `./logs/${dateString}.log`)
  let logs: string = FM.readFile(srcPath) || `[${timeString}] LOG START -- ${calendar}`
  logs += `\n${MSG}`

  await FM.writeFile(srcPath, logs)
}

logger.empty()
logger.process(async (job: Bull.Job<LoggerPayloadType>, done: Bull.DoneCallback) => {
  await logEvent(job.data).then(
    () => done(),
    (err) => done(err)
  )
})

export { logger }
