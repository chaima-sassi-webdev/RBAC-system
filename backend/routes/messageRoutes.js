const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getConversation,
  getUserConversations,
  markAsRead,
  getAllUsers,
} = require("../controllers/messageController");

// Envoyer un message
router.post("/message", sendMessage);
router.get("/getAllUsers", getAllUsers);
// Récupérer une conversation entre deux utilisateurs
router.get("/conversation/:senderId/:receiverId", getConversation);

// Récupérer toutes les conversations d'un utilisateur
router.get("/user/:userId", getUserConversations);

// Marquer un message comme lu
router.put("/read/:messageId", markAsRead);

module.exports = router;