# VRC
## What is this?
- This is a discord bot that records voices of users in a voice channel.

## How to use it?
- Clone the repository.
- I've used version 15.8 of Node, so I'm not sure if it'll work with a different version; Anyways make sure you have node installed.
- You have to include the bot's token in an environment variable called **VRC_BOT_TOKEN**.
- Run `npm install` to install dependancies.
- Run the bot using `npm run bot` from inside the cloned repository.
- Use the command `;start;` while mentioning members you'd like to start recording for.
- Example: `;start; @XtratoS @Abdo` will start recording for both @XtratoS and @Abdo.
- Use the command `;stop;` to stop recording and convert the recording files to .wav.

## Current Limitations:
- The filenames are just the ids of each person being recorded, so it will be overwritten once you start recording again.
- The bot can currently record only 4 users.