// require the discord.js module
const Discord = require('discord.js');

// create a new Discord client
const client = new Discord.Client();

let users = {};

client.once('ready', () => {
  console.log('Ready!');
});

client.on('guildMemberAdd', member => {
  member.user.send(
    `Introduce yourself to us. Say **~yes** to get started! :heart:`
  );
});

client.on('message', message => {
  const { username } = message.author;
  if (message.author.username !== 'Welcome') {
    if (message.content === '~yes' && !users[username]) {
      users[username] = { ...users };
      users[username]['step'] = 'name';
      message.author.send(`What's your name?`);
    } else if (users[username] && users[username].step === 'name') {
      users[username]['name'] = message.content;
      users[username]['step'] = 'intro';
      message.author.send(
        `Express yourself! what do you like doing? *Be careful by pressing enter you will send your response*`
      );
    } else if (users[username] && users[username].step === 'intro') {
      users[username]['intro'] = message.content;
      users[username]['step'] = 'social';
      message.author.send(
        `Post your social media tags, in game names and games you play. *Be careful by pressing enter you will send your response*`
      );
    } else if (users[username] && users[username].step === 'social') {
      users[username]['step'] = false;
      users[username]['social'] = message.content;
      sendEmbed(message.author, users[username]);
      message.author.send(
        `All done! Check out <#692586801474437170> for other people's bio.`
      );
    }
  }
});

const sendEmbed = (author, response) => {
  const exampleEmbed = new Discord.MessageEmbed()
    .setColor('#0x0099ff')
    .setTitle(author.username)
    .setAuthor(
      `${author.username} #${author.discriminator}`,
      author.displayAvatarURL()
    )
    .setThumbnail(author.displayAvatarURL())
    .addFields(
      { name: 'name', value: response.name },
      { name: 'who am i?', value: response.intro },
      { name: 'more about me', value: response.social }
    )
    .setTimestamp();

  client.channels
    .fetch('692586801474437170')
    .then(channel => channel.send({ embed: exampleEmbed }));
};

// const chann = message.guild.channels.cache.find(
//   channel => channel.name === 'playground'
// );

// login to Discord with your app's token
client.login(process.env.BOT_TOKEN);
