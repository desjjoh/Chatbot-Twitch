import { RefreshingAuthProvider } from '@twurple/auth'
import { ApiClient } from '@twurple/api'

import { promises as fs } from 'fs'
import path from 'path'

const { CLIENTID, CLIENTSECRET } = process.env

const tokenPath: string = path.join(process.cwd(), './src/lib/config/twurple.tokens.json')
const tokenData = JSON.parse(await fs.readFile(tokenPath, 'utf8'))

const authProvider: RefreshingAuthProvider = new RefreshingAuthProvider({
  clientId: CLIENTID as string,
  clientSecret: CLIENTSECRET as string
})

const apiClient: ApiClient = new ApiClient({ authProvider })

await authProvider.addUserForToken(tokenData)

authProvider.onRefresh(async (userId, newTokenData) => {
  await fs.writeFile(tokenPath, JSON.stringify(newTokenData, null, 4), 'utf8')
  authProvider.addUser(userId, tokenData)
})

export default apiClient
