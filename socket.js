const db = require("./models/v1/index");
const { Op } = require("sequelize");

module.exports = (io) => {
    io.on('connection', async (socket) => {
        console.log('New user connected: ' + socket.id);
        
        socket.on('joining msg', async (userId) => {
            try {
                const messageHistory = await db.messages.findAll({ 
                    where: {
                        [Op.or]: [{ sender_id: userId }, { receiver_id: userId }]
                    }
                });
                io.emit('chat message', `---${userId} joined the chat---`);
                io.emit('message history', messageHistory);
            } catch (error) {
                console.error('Error fetching message history:', error);
            }
        });
        
        socket.on('message', async (data) => {
            console.log('Message received:', data);
            try {
                await db.messages.create({
                    sender_id: data.sender,
                    receiver_id: data.receiver,
                    message: data.message
                });
                console.log('Message saved to database.');
                io.emit('message', data);
            } catch (error) {
                console.error('Error saving message to database:', error);
            }
        });
        
        socket.on('disconnect', () => {
            console.log('User disconnected');
            io.emit('chat message', `---${socket.username} left the chat---`);
        });
    });
};
