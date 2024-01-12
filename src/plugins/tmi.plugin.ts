import { Client, Options } from 'tmi.js'

declare const process: {
  env: {
    CHANNEL_NAME: string
    TTV_USERNAME: string
    PASSWORD: string
  }
}

const { CHANNEL_NAME, TTV_USERNAME, PASSWORD } = process.env

const CONFIG: Options = {
  identity: {
    username: TTV_USERNAME,
    password: PASSWORD
  },
  channels: [CHANNEL_NAME],
  options: {
    // debug: true
  }
}

const client: Client = new Client(CONFIG)

export default client
