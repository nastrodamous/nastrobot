module.exports = {
    name: 'ping',
    description: "this is a ping command",
    execute(message, args) {
        if(message.member.roles.cache.has('783769487409283125')) {
            message.channel.send('pong')
        } else  {
            message.channel.send("you dont have permissions")
            message.member.roles.add('783769487409283125')

        }
    }
}