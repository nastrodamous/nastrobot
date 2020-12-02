module.exports = {
    name: 'aboutme',
    description: "gets my resume",
    execute(message, args) {
        message.channel.send('resume')
    }
}