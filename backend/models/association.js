import User from './usermodel.js';
import Chat from './chatmodel.js';
import Contact from './contactmodel.js';

// ASOSIASI CHAT
User.hasMany(Chat, { foreignKey: 'id_sender', as: 'SentMessages' });
User.hasMany(Chat, { foreignKey: 'id_receiver', as: 'ReceivedMessages' });


Chat.belongsTo(User, {
    foreignKey: 'id_sender',
    as: 'Sender',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'  
});
// Setiap Chat dimiliki oleh satu User sebagai penerima
Chat.belongsTo(User, {
    foreignKey: 'id_receiver',
    as: 'Receiver',
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE'  
});



User.hasMany(Contact, { foreignKey: 'id_useradder', as: 'OwnedContacts' });

User.hasMany(Contact, { foreignKey: 'id_userreceiver', as: 'AppearsInContacts' });



Contact.belongsTo(User, {
    foreignKey: 'id_useradder', 
    as: 'Adder',
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
});

Contact.belongsTo(User, {
    foreignKey: 'id_userreceiver', 
    as: 'ReceiverContact',
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE'  
});

export { User, Chat, Contact };