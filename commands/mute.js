module.exports = {
    name: 'mute',
    description: "adds mute role",
    execute(message, args) {
        message.member.roles.add('783769487409283125')
    }
}