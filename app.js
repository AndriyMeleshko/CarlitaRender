const express = require('express');
const app = express();
const port = process.env.PORT || 3001;


const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Carlíta</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello Carlíta!
    </section>
  </body>
</html>
`;

app.get('/', (req, res) => res.type('html').send(html));
app.listen(port, () => console.log(`Carlíta listening on port: ${port}`));

// Discord

const fs = require('node:fs');
const moment = require('moment');
const fetch = require('node-fetch');

if (!fs.existsSync('./node_modules/dotenv')) {
  console.log('Missing module: dotenv');
}
else {
  require('dotenv').config();
  console.log('Running module: dotenv');
}

const env = process.env;

fetch(`${env.ClientUrl}`)
  .then(() => console.log('Request: Glitch'))
  .catch(err => console.error(err));

setInterval(() => {
  fetch(`${env.ClientUrl}`);
}, 300 * 1000);

const { Client, Events, GatewayIntentBits, ActivityType, EmbedBuilder } = require('discord.js');

const ClientDiscord = new Client({ intents: [GatewayIntentBits.Guilds] });

ClientDiscord.once(Events.ClientReady, async (c) => {

  const DateReady = moment().utc().locale('en').add(2, 'h').format('h:mm A, MMMM D, dddd, YYYY');

  console.log(DateReady);

  // const ClientCategory = `${DateReady}`;

  // ClientDiscord.user.setActivity(ClientCategory, { type: ActivityType.Listening });

  const result = 'Render';

  ClientDiscord.user.setActivity(result, { type: ActivityType.Custom });

  console.log(`Client Discord Ready: ${c.user.username} #${c.user.discriminator} / ${c.user.tag}`);

  const channelLog = ClientDiscord.channels.cache.get(`${env.RenderLog}`);

  if (!channelLog) return;

  channelLog.send(`${DateReady}`);
});

ClientDiscord.on('error', async (err) => {
  ClientDiscord.user.setPresence({ activities: [{ name: 'Error', type: 3 }], status: 'dnd' })
    .then(() => console.log(err));
});

ClientDiscord.on(Events.MessageCreate, async (msg) => {
  if (msg.author.bot) return;

  const myPref = env.ClientPrefix;

  if (!msg.content.startsWith(myPref)) return;
  const args = msg.content.slice(myPref.length).toLowerCase().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command) {
    ClientDiscord.user.setStatus('online');

    setTimeout(async () => {
      ClientDiscord.user.setStatus('idle');
    }, 300 * 1000);
  }

  if (command === 'ping') {

    const EmbedEn = new EmbedBuilder()
      .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
      .setDescription('Discord Ping')
      .addFields(
        { name: '\u200B', value: `Ping: ${new Date().getTime() - msg.createdTimestamp} ms`, inline: true },
      )
      .setImage(env.Strip)
      .setFooter({ text: 'Discord', iconURL: env.Gif });

    msg.channel.send({ embeds: [EmbedEn] });
  }
});

ClientDiscord.login(env.ClientToken);
