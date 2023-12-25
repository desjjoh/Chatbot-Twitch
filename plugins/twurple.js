/* eslint-disable no-undef */
import { RefreshingAuthProvider } from '@twurple/auth'
import { ApiClient } from '@twurple/api'

import { promises as fs } from 'fs'
import path from 'path'

const { CLIENTID, CLIENTSECRET } = process.env
const tokenPath = path.join(process.cwd(), './config/tokens.json')

const tokenData = JSON.parse(await fs.readFile(tokenPath, 'UTF-8'))

const authProvider = new RefreshingAuthProvider({
  clientId: CLIENTID,
  clientSecret: CLIENTSECRET
})

await authProvider.addUserForToken(tokenData)

authProvider.onRefresh(async (userId, newTokenData) => {
  await fs.writeFile(tokenPath, JSON.stringify(newTokenData, null, 4), 'UTF-8')
  authProvider.addUser(userId, tokenData)
})

const apiClient = new ApiClient({ authProvider })

export { apiClient }
