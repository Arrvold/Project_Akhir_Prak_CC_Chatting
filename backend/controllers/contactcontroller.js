import Contact from "../models/contactmodel.js";
import User from "../models/usermodel.js";
import { Op } from "sequelize";

// GET My Contacts (pakai param :id)
export const getMyContacts = async (req, res) => {
    try {

        const myId = req.params.userId;

        const contacts = await Contact.findAll({
            where: {
                id_useradder: myId 
            },
            include: [
                {
                    model: User,
                    as: "ReceiverContact", 
                    attributes: ["id_user", "username", "nickname", "email"]
                }
            ]
        });


        const result = contacts.map(contact => {

            if (!contact.ReceiverContact) {
                console.warn(`Kontak ${contact.id_contact} tidak memiliki ReceiverContact.`);
                return null; 
            }

            const target = contact.ReceiverContact; 

            return {
                id_contact: contact.id_contact,
                nickname: contact.nickname,
                user: {
                    id_user: target.id_user,
                    username: target.username,
                    email: target.email
                }
            };
        }).filter(item => item !== null); 

        res.status(200).json(result);
    } catch (error) {

        console.error("Error fetching contacts:", error);
        res.status(500).json({ msg: "Gagal mengambil kontak", error: error.message });
    }
};



export const addContact = async (req, res) => {
  try {
    const { id_user, username, nickname } = req.body;

    const userToAdd = await User.findOne({ where: { username } });
    if (!userToAdd) {
      return res.status(404).json({ msg: "Username tidak ditemukan" });
    }

    if (userToAdd.id_user === id_user) {
      return res.status(400).json({ msg: "Tidak bisa menambahkan diri sendiri sebagai kontak" });
    }


    const existing = await Contact.findOne({
      where: {
        [Op.or]: [
          { id_useradder: id_user, id_userreceiver: userToAdd.id_user },
          { id_useradder: userToAdd.id_user, id_userreceiver: id_user }
        ]
      }
    });

    if (existing) {
      return res.status(400).json({ msg: "Kontak sudah ada di salah satu arah" });
    }


    const contact1 = await Contact.create({
      id_useradder: id_user,
      id_userreceiver: userToAdd.id_user,
      nickname: nickname || userToAdd.nickname
    });

    const user = await User.findByPk(id_user);

    const contact2 = await Contact.create({
      id_useradder: userToAdd.id_user,
      id_userreceiver: id_user,
      nickname: user.username 
    });

    res.status(201).json({ 
      msg: "Kontak dua arah berhasil ditambahkan", 
      contacts: [contact1, contact2] 
    });
  } catch (error) {
    res.status(500).json({ msg: "Gagal menambahkan kontak", error: error.message });
  }
};


// Update Contact Nickname
export const updateContact = async (req, res) => {
    try {
        const contact = await Contact.findByPk(req.params.id);
        if (!contact) return res.status(404).json({ msg: "Kontak tidak ditemukan" });

        await Contact.update({ nickname: req.body.nickname }, {
            where: { id_contact: req.params.id }
        });
        res.status(200).json({ msg: "Nickname kontak diperbarui" });
    } catch (error) {
        res.status(500).json({ msg: "Gagal memperbarui kontak", error: error.message });
    }
};

// Delete Contact
export const deleteContact = async (req, res) => {
  try {
    const id_contact = req.params.id;

    const contact = await Contact.findByPk(id_contact);
    if (!contact) return res.status(404).json({ msg: "Kontak tidak ditemukan" });


    await Contact.destroy({ where: { id_contact } });

    await Contact.destroy({
      where: {
        id_useradder: contact.id_userreceiver,
        id_userreceiver: contact.id_useradder
      }
    });

    res.status(200).json({ msg: "Kontak dua arah berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ msg: "Gagal menghapus kontak", error: error.message });
  }
};
