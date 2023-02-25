# Ambient Dungeon

## Advanced version with tagging now available
https://github.com/Vatril/AdvancedAmbientDungeon


# Ambient Dungeon

This is a small discord music bot that allows you to easily switch between different shuffled playlists.
The playlists are generated by having the music files in different folders on your computer.
This way music you bought or extracted from games or similar can be used.

The original intent for this bot was to make it easy to switch between different playlists like combat, tavern or exploration
while playing TTRPGs via discord. The bot is controllable via a web interface on the host computer.
This was done to avoid distraction by typing commands while also trying to GM a game.

This bot was made in a day and is fairly simple, only allowing to play local music and only with the controls to switch playlists, pause/resume and skip.
When setting it up, also a "Special Folder" is designated. Music in this folder shows up in a separate list in the web interface and can be played as a one off song,
useful for villain introductions or success songs.

## Setup

Requires minimum Node.js version 16.

Install dependencies:
```SH
npm i
```

Run setup
```SH
npm run setup
```

Fill out `settings.json`

```JSON
{
  "token": "<Your Bot Token>",
  "clientID": "<Your Bot Client ID>",
  "guildID": "<Guild ID of the discord the bot should be registered in>",
  "musicFolder": "<Absolute path to your music folder>",
  "specialFolder": "<Absolute path to your music folder of special songs>",
  "formats": [
    ".mp3",
    "<Additional formats>"
  ]
}
```

Run setup again. Make sure the bot is in your guild so the slash-commands can be registered correctly
```SH
npm run setup
```

## Start

Run start script
```SH
npm run start
```

After that you can go to http://localhost:3080 to control the bot.