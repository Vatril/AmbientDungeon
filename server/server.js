const {
    ApolloServerPluginLandingPageLocalDefault
} = require('apollo-server-core')
const {ApolloServer, gql} = require('apollo-server')
const {client, player, currentChannel} = require("../bot/bot")
const {createAudioResource, AudioPlayerStatus} = require("@discordjs/voice")
const {readdirSync, readFileSync} = require('fs')
const path = require('path')


const settingData = readFileSync('settings.json', 'utf8')
const jsonSettingData = JSON.parse(settingData)


const genreList = []
const specialList = []
const genres = {}
let genre = ""
let songName = ""

const scanFolders = (scanFolder, rootPath) => {
    const folders = readdirSync(scanFolder, {withFileTypes: true})
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
    genreList.push(...(rootPath ? folders.map(f => path.join(rootPath, f)) : folders))
    for (const folder of folders) {
        scanFolders(path.join(scanFolder, folder), rootPath ? path.join(rootPath, folder) : folder)
    }
}

scanFolders(jsonSettingData["musicFolder"])

for (const genre of genreList) {
    if(path.join(jsonSettingData["musicFolder"], genre) === jsonSettingData["specialFolder"]){
        continue
    }
    genres[genre] = readdirSync(path.join(jsonSettingData["musicFolder"], genre), {withFileTypes: true})
        .filter(dirent => !dirent.isDirectory())
        .map(dirent => dirent.name)
        .filter(dirent => jsonSettingData["formats"].some(e => dirent.toLowerCase().endsWith(e)))
}

readdirSync(jsonSettingData["specialFolder"], {withFileTypes: true})
    .filter(dirent => !dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(dirent => jsonSettingData["formats"].some(e => dirent.toLowerCase().endsWith(e)))
    .forEach(s => specialList.push(s))

console.log(`Scanning folder ${jsonSettingData["musicFolder"]}`)
console.log(`Found:`)
console.table(Object.entries(genres).map(g => ({
    "name": g[0],
    "amount": g[1].length
})))
console.log(`Specials:`)
console.table(specialList)


const typeDefs = gql`

  type Genre {
    name: String!
    amount: Int!
  }
  
  type Status {
    channel: String
    genre: String
    song: String
    isPlaying: Boolean
  }

  type Query {
    genres: [Genre]
    specials: [String]
    status: Status
  }

  type Mutation {
    play(genre: String!): Boolean
    playSpecial(song: String!): Boolean
    pause: Boolean
    unpause: Boolean
    skip: Boolean
  }
`


player.on(AudioPlayerStatus.Idle, () => {
    playRandom()
})

const playRandom = () => {
    if (genre) {

        let position = -1

        while (true) {
            position = Math.floor(Math.random() * genres[genre].length)
            if (genres[genre][position] !== songName || genres[genre].length < 2) {
                break
            }
        }
        songName = genres[genre][position]

        client.user.setPresence({status: 'online', activities: [{name: songName, type: 2}]})

        player.play(createAudioResource(path.join(jsonSettingData["musicFolder"], genre, songName), {
            metadata: {
                title: songName,
            },
        }))
        return true
    } else {
        client.user.setPresence({status: 'online', activities: [{name: "the waiting game", type: 0}]})
        songName = null
        return false
    }
}

const playSong = (song) => {
    if (song) {

        songName = song
        genre = null

        client.user.setPresence({status: 'online', activities: [{name: songName, type: 2}]})

        player.play(createAudioResource(path.join(jsonSettingData["specialFolder"], songName), {
            metadata: {
                title: songName,
            },
        }))
        return true
    } else {
        client.user.setPresence({status: 'online', activities: [{name: "the waiting game", type: 0}]})
        songName = null
        return false
    }
}

const resolvers = {
    Mutation: {
        play: (parent, args) => {
            genre = args.genre
            return playRandom()
        },
        playSpecial: (parent, args) => {
            return playSong(args.song)
        },
        pause: () => {
            player.pause()
            return true
        },
        unpause: () => {
            player.unpause()
            return true
        },
        skip: () => {
            return playRandom()
        }
    },
    Query: {
        genres: () => Object.entries(genres).map(g => ({
            "amount": g[1].length,
            "name": g[0]
        })),
        specials: () => specialList,
        status: () => ({
            channel: currentChannel?.name,
            genre,
            song: songName,
            isPlaying: player.state.status === AudioPlayerStatus.Playing
        })
    }
}


const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',

    plugins: [
        ApolloServerPluginLandingPageLocalDefault({embed: true}),
    ],

})

server.listen().then(() => {
    client.login(jsonSettingData["token"])
    console.log(`Server started`)
})