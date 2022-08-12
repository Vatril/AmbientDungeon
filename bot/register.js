const {REST, Routes} = require('discord.js')
const fs = require("fs")

const commands = [
    {
        name: 'join',
        description: 'Joins the VC',
    },
    {
        name: 'leave',
        description: 'Leaves the VC',
    }
]


const register = async () => {
    const data = fs.readFileSync('settings.json', 'utf8')
    const jsonData = JSON.parse(data)

    const rest = new REST({version: '10'}).setToken(jsonData["token"])
    try {
        console.log('Started refreshing application (/) commands.')

        await rest.put(Routes.applicationGuildCommands(jsonData["clientID"], jsonData["guildID"]), {body: commands})

        console.log('Successfully reloaded application (/) commands.')
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    register
}