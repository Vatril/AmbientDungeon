const {
    Client,
    GatewayIntentBits
} = require('discord.js')
const {
    joinVoiceChannel,
    NoSubscriberBehavior,
    createAudioPlayer,
    VoiceConnectionStatus,
    getVoiceConnection,
} = require('@discordjs/voice')


const client = new Client({intents: [GatewayIntentBits.Guilds, (1 << 7)]})
let currentChannel = {}


const player = createAudioPlayer({
    behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
    },
})


client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) {
        return
    }

    if (interaction.commandName === 'join') {
        let channel = interaction.member.voice.channel

        if (!channel) {
            await interaction.reply('No Channel to join')
            return
        }

        currentChannel.name = channel.name
        currentChannel.id = channel.id

        console.log(`Joined ${channel.name}`)

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        })

        connection.on(VoiceConnectionStatus.Disconnected, async () => {
            currentChannel.name = null
            currentChannel.id = null
            client.user.setPresence({status: 'idle'})
        })

        connection.subscribe(player)
        client.user.setPresence({status: 'online', activities: [{name: "the waiting game", type: 0}]})

        await interaction.reply('OK')
    } else if (interaction.commandName === 'leave') {
        getVoiceConnection(interaction.guildId).disconnect()
        await interaction.reply('bye')
    }
})

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`)
    client.user.setPresence({status: 'idle'})
})

module.exports = {
    client,
    currentChannel,
    player
}
