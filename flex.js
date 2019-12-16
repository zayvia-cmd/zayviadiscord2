const request = require('request')

const emojiUnicodes = require('discord-unicodes')
const randomColors = require("randomcolor");


module.exports = class FunCommands {
    constructor(discord, client, prefix) {
        // if (typeof discord !== 'object')
        //     throw new Error('Expected a value of type object')

        if (typeof client !== 'object')
            throw new Error('Expected a value of type object')

        if (typeof prefix !== 'string')
            throw new Error('Expected a value of type string')


        this.client = client;
        this.prefix = prefix;
        this.discord = discord;

        this.Discord_ = function (obj) {
            if (obj === 'RichEmbed') return new this.discord.RichEmbed();
            if (obj === 'Attachment') return new this.discord.Attachment();
        }
    }

    initialize(token) {
        if (typeof token !== 'string')
            throw new Error('Expected a value of type string');

        this.client.login(token);
        this.client.on('ready', () => console.log(`Logged in as ${this.client.user.tag}`));
    }

    spam(MessageObject, on_command, content, amount, id) {
        if (typeof MessageObject !== 'object')
            throw new Error('Expected a value of type object');

        if (typeof content !== 'string' || typeof on_command !== 'string' || typeof id !== 'string')
            throw new Error("Expected a value of type string");

        if (typeof amount !== 'number')
            throw new Error('Expected a value of type number');


        if (MessageObject.author.id !== this.client.user.id) return;
        if (MessageObject.content !== on_command) return;

        const personToSpam = this.client.users.get(id)
        for (let i = 1; i <= amount; i++) {
            personToSpam.send(content);
        }
    }

    async react(MessageObject, content) {
        if (typeof MessageObject !== 'object')
            throw new Error('Error: Expected a value of type object')

        if (typeof content !== 'string')
            throw new Error('Error: Expected a value of type string')

        if (MessageObject.author.id !== this.client.user.id) return;

        function rejectDelay(reason) {
            return new Promise(function (resolve, reject) {
                setTimeout(reject.bind(null, reason), 500);
            });
        }

        if (content) {
            const emojiUnicodesList = emojiUnicodes.list;
            // let numberOfReactions = 0;

            for (let i = 0; i <= 19; i++) {
                await MessageObject.react(emojiUnicodesList[Math.floor(Math.random() * emojiUnicodesList.length) + 1].unicode)
                    .catch(rejectDelay)
            }

        }
    }

    dictionary(MessageObject, command_name) {
        if (typeof MessageObject !== 'object')
            throw new Error('Error: Expected a value of type object')

        if (typeof command_name !== 'string')
            throw new Error('Error: Expected a value of type string')

        if (MessageObject.author.id !== this.client.user.id) return;

        //these both variables are created because "this" keyword is undefined inside the request function
        const RichEmbed = this.Discord_('RichEmbed');
        const client = this.client;


        const args = MessageObject.content
            .slice(this.prefix.length)
            .trim()
            .split(/ +/g);
        const cmd = args.shift().toLowerCase();
        const query = MessageObject.content.slice(command_name.length + 2).trim();

        if (cmd === command_name && !query) return MessageObject.channel.send("`Missing search query.`");

        if (cmd === command_name) {
            request(
                {
                    uri: `http://api.urbandictionary.com/v0/define?term=${query}`
                },
                function (err, res, body) {
                    const parsed = JSON.parse(body);
                    const parsedInfo = parsed.list[0];
                    const regex = /\b([a-z])/g;

                    if (parsed.list == "") {
                        MessageObject.reply("`Word not found.`");
                    } else {
                        MessageObject.reply("`One moment...`").then((msg) => {
                            const embed = RichEmbed
                                .setAuthor(this.client.user.username, this.client.user.avatarURL)
                                .setColor("#1D2439")
                                .setTitle(
                                    parsedInfo.word.replace(regex, function (word) {
                                        return word.charAt(0).toUpperCase();
                                    })
                                )
                                .setURL(parsed.list[0].permalink)
                                .setThumbnail(
                                    "https://glassschool.com.br/wp-content/uploads/2016/07/Urban-Dictionary-logo.png?lang=en"
                                )
                                .setDescription(`Definition:\n\n${parsedInfo.definition} `)
                                .addField("Author", parsedInfo.author, true)
                                .addField(
                                    "Rating",
                                    `Upvotes: ${parsedInfo.thumbs_up} | Downvotes: ${parsedInfo.thumbs_down}`
                                );
                            msg.delete()
                            MessageObject.channel.send(embed);
                        });
                    }
                }
            );
        }
    }

    cat(MessageObject, command_name) {
        if (typeof MessageObject !== 'object')
            throw new Error('Error: Expected a value of type object')

        if (typeof command_name !== 'string')
            throw new Error('Error: Expected a value of type string')

        if (MessageObject.author.id !== this.client.user.id) return;

        const args = MessageObject.content
            .slice(this.prefix.length)
            .trim()
            .split(/ +/g);
        const command = args.shift().toLowerCase();

        const Attachment = this.Discord_('Attachment')

        if (command === command_name && args[0]) return;
        if (command === command_name) {
            request(
                {
                    uri: "http://aws.random.cat/meow"
                },
                function (err, res, body) {
                    const parsed = JSON.parse(body);
                    MessageObject.reply("One moment...").then(msg => {
                        // const attachment = Attachment().file()
                        if (Attachment.file = parsed.file) {
                            msg.delete();
                            msg.channel.send(Attachment.file = parsed.file);
                        }
                    });
                }
            );
        }
    }

    async rainbowRole(MessageObject, command_name) {
        if (typeof MessageObject !== 'object') {
            throw new Error('Error: Expected a value of type object');
        }

        if (typeof command_name !== 'string') {
            throw new Error('Error; Expected a value of type string');
        }
        const args = MessageObject.content
            .slice(this.prefix.length)
            .trim()
            .split(/ +/g);
        const cmd = args.shift().toLowerCase();

        const guild = this.client.guilds.get(MessageObject.guild.id);

        const RichEmbed = this.Discord_('RichEmbed');
        const client = this.client;
        const prefix = this.prefix;

        if (typeof this.running == "undefined") this.running = {};

        if (cmd === command_name) {
            if (!MessageObject.member.hasPermission("MANAGE_ROLES")) return MessageObject.channel.send("Insufficient permissions!");
            if (cmd === command_name && !args[0]) return howto();
            // if (Object.keys(this.running).length !== 0 && Object.constructor === Object) return MessageObject.channel.send("Only 1 role can be discoed at a time");



            const roleChosen = MessageObject.content.slice(command_name.length + 2);
            const roleName = guild.roles.find(role => role.name === roleChosen);

            if (roleName === null || roleName === undefined) return MessageObject.channel.send("That role does not exist");

            //This line is here because the user could input an invalid role.
            const defaultRoleColor = roleName.color;

            this.running.role = roleName;
            this.running.defRoleColor = defaultRoleColor;

            this.running[MessageObject.author.id] = setInterval(() => {
                roleName.setColor(
                    randomColors({
                        luminosity: "bright",
                        format: "hex",
                        opacity: 1
                    })
                );
            }, 1000);
            await MessageObject.channel.send("Discoing!");

        } else if (cmd === 'stop') {
            //Checks if there's any roles being discoed.
            if (!this.running.role) return MessageObject.channel.send("There are no instances of any roles being intervaled");

            //Sets the color of the role to its default
            this.running.role.setColor(this.running.defRoleColor);
            if (this.running[MessageObject.author.id] != undefined) {
                clearInterval(this.running[MessageObject.author.id]);
                await MessageObject.channel.send("Stopped discoing");
                console.log(this.running[MessageObject.author.id])

            }
        } else {
            console.log('Something went wrong!')
        }

        //How to use embed
        function howto() {
            let roles = [];
            let guild = client.guilds.get(MessageObject.guild.id);
            guild.roles.map(role => roles.push(role.name));
            function listOfRoles() {
                let list = "";
                for (let i = 1; i < roles.length; i++) {
                    list += `${roles[i]}\n`;
                }
                return list;
            }
            const embed = RichEmbed
                .setTitle("Choose a role")
                .setDescription(
                    `Include the prefix and command name when typing a role.\nFor e.g., ${prefix}disco ${roles[1]}`
                )
                .addField(
                    "Stopping the disco",
                    "To stop all roles from discoing simply type -stopdisco\nTo stop specific roles from discoing will be imported soon!"
                )
                .addField(
                    "Note:",
                    "Case sensitive"
                )
                .addField("Roles", `${listOfRoles()}`)
            MessageObject.channel.send(embed);
        }
    }
}