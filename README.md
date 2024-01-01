# TwitchBot

<!-- async function onFollowage(payload: ACTION_CMD, \_regExpMatchArray: RegExpMatchArray): Promise<string> {
if (!payload.userstate.username) throw Error('Payload userstate.username is undefined')

const user = await apiClient.users.getUserByName(payload.userstate.username)
if (!user) throw new Error(`Get user by name ${payload.userstate.username} has failed.`)

const broadcaster = await apiClient.users.getUserByName(STRING.dehash(payload.channel))
if (!broadcaster) throw new Error(`Get user by name ${payload.channel} has failed.`)

return broadcaster.getChannelFollower(user.id).then((follower: HelixChannelFollower | null) => {
if (follower) return `The user @${user.name} followed the channel ${moment(follower.followDate).fromNow()}.`
throw new Error(`Get channel follower ${user.name} for broadcaser ${broadcaster.name} has failed.`)
})
} -->
