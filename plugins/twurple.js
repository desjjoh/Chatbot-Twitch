import { AppTokenAuthProvider } from '@twurple/auth'
import { ApiClient } from '@twurple/api'

const { CLIENTID, CLIENTSECRET } = process.env

const authProvider = new AppTokenAuthProvider(CLIENTID, CLIENTSECRET)
const apiClient = new ApiClient({ authProvider })

export { apiClient }
