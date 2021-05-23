const id = document.querySelector('#currentUser').getAttribute('data-user-id');
console.log(id);
currentUser = {};
document.addEventListener('load', () => {
    axios.get('api/user/5f936fad24a5982fa8145b0f')
        .then((res) => {
            console.log(res.data);
        }).catch((err) => {
            console.log(err);
        });
});
console.log(currentUser);
// console.log(currentUser._id);
// const interactions = document.querySelectorAll('.interaction');
// var to = document.querySelector('#to');
// socket.emit('online', userId);

// Select User to Talk With
// interactions.forEach(interaction => {
//     let toId = interaction.getAttribute('data-id');
//     to.value = toId;

// });

// $('#message-to-send').keypress((e) => {
//     if (e.which == '13') {
//         let msg = sendMsg.value;
//         let msgBody = { userId, to, msg };
//         // Emit message to server
//         socket.emit('pvtMessage', msgBody);
//         // Clear input
//         msgText.value = "";
//         msgText.focus();
//     }
// });

// sendMsg.addEventListener('click', (e) => {
//     e.preventDefault();

//     // Get message text
//     let msg = msgText.value;
//     console.log(to);
//     let toId = to.value;
//     let msgBody = { userId, toId, msg };
//     console.log(msgBody);
//     // Emit message to server
//     socket.emit('pvtMessage', msgBody);
//     // Clear input
//     msgText.value = "";
//     msgText.focus();
// });
