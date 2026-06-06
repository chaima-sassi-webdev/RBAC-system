const Message = require("../models/Message");
const User = require("../models/User");
// Envoyer un message
exports.sendMessage = async (req, res) => {
  try {
    const { sender, receiver, content } = req.body;

    const message = await Message.create({
      sender,
      receiver,
      content,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name email role")
      .populate("receiver", "name email role");

    res.status(201).json({
      success: true,
      message: populatedMessage,
    });
  } catch (error) {
    console.error("sendMessage error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};

// Récupérer une conversation entre deux utilisateurs
exports.getConversation = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    const messages = await Message.find({
      $or: [
        {
          sender: senderId,
          receiver: receiverId,
        },
        {
          sender: receiverId,
          receiver: senderId,
        },
      ],
    })
      .populate("sender", "name email role")
      .populate("receiver", "name email role")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.error("getConversation error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch conversation",
      error: error.message,
    });
  }
};

// Récupérer tous les messages d'un utilisateur
exports.getUserConversations = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: userId },
        { receiver: userId },
      ],
    })
      .populate("sender", "name email role")
      .populate("receiver", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.error("getUserConversations error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
};

// Marquer un message comme lu
exports.markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findByIdAndUpdate(
      messageId,
      {
        isRead: true,
      },
      {
        new: true,
      }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("markAsRead error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update message",
      error: error.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
    try{
        const users = await User.find();
        res.status(200).json(users);
    } catch(error){
        res.status(500).json({ message: error.message });
    }
}