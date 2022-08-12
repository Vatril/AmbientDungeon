const fs = require('fs')
const readline = require('readline')
const {exec} = require('child-process-async')
const {register} = require("./bot/register")

const settingFields = {
    "token": "",
    "clientID": "",
    "guildID": "",
    "musicFolder": "",
    "specialFolder": "",
    "formats": [".mp3"]
}

const pressEnterToContinue = () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })

    return new Promise(resolve => rl.question("Press any key to continue", ans => {
        rl.close()
        resolve(ans)
    }))
}

const checkSettingsExist = () => {
    console.log("Checking Config")
    try {
        const data = fs.readFileSync('settings.json', 'utf8')
        const jsonData = JSON.parse(data)
        for (const field of Object.keys(settingFields)) {
            if (!jsonData.hasOwnProperty(field)) {
                console.log(`Missing Field ${field}. Please add it or delete the settings file and rerun the setup.`)
                process.exit(1)
            } else if (jsonData[field].length === 0) {
                console.error(`${field} is empty.`)
                process.exit(1)
            }
        }
    } catch {
        console.log("Creating settings file...")
        fs.writeFileSync('settings.json', JSON.stringify(settingFields))
        console.log("Created settings.json. Please fill in the required creds.")
        process.exit(1)
    }
}

const inviteBot = async () => {
    const data = fs.readFileSync('settings.json', 'utf8')
    const jsonData = JSON.parse(data)
    console.log("Click this link to invite the bot\n============")
    console.log(`https://discord.com/api/oauth2/authorize?client_id=${jsonData["clientID"]}&permissions=277062093824&scope=bot%20applications.commands`)
    console.log("============")
    await pressEnterToContinue()
}

const buildWebApp = async () => {
    console.log("Building Webapp")
    await exec("npm run build")
    console.log("Built Webapp")
}

const run = async () => {
    console.log("Welcome to ambient dungeon")
    checkSettingsExist()
    await inviteBot()
    await register()
    await buildWebApp()
}

run()