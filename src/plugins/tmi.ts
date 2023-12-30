import { Client, Options } from 'tmi.js'

const { CHANNEL_NAME, TTV_USERNAME, PASSWORD } = process.env
const CONFIG: Options = {
  identity: {
    username: TTV_USERNAME as string,
    password: PASSWORD as string
  },
  channels: [CHANNEL_NAME as string],
  options: {
    // debug: true
  }
}

const client: Client = new Client(CONFIG)

export { client }
