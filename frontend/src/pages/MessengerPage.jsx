import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/messenger.module.css";

function MessengerPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

const currentUser = JSON.parse(localStorage.getItem("user"));
const currentUserId = currentUser?._id;
  // 1. Charger les utilisateurs
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/admin/getAllUsers");
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  // 2. Charger conversation
  const fetchMessages = async (userId) => {
    

    if (!currentUserId || !userId) return;

    try {
        const res = await axios.get(
        `http://localhost:5000/api/messages/conversation/${currentUserId}/${selectedUser._id}`
        );

        setMessages(res.data.messages);
    } catch (err) {
        console.log(err);
    }
};
    useEffect(() => {
    if (selectedUser) {
        fetchMessages(selectedUser._id);
    }
    }, [selectedUser]);
  useEffect(() => {
    fetchUsers();
  }, []);

  // 3. sélectionner un utilisateur
  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  // 4. envoyer message
  const sendMessage = async () => {
    if (!text.trim() || !selectedUser) return;


  if (!currentUserId) return;

    try {
        await axios.post("http://localhost:5000/api/messages/message", {
        sender: currentUserId,
        receiver: selectedUser._id,
        content: text,
        });

        setText("");
        fetchMessages(selectedUser._id);
    } catch (err) {
        console.log(err);
    }
};

  return (
    <div className={styles.container}>

      {/* LISTE USERS */}
      <div className={styles.sidebar}>
        <h3>Users</h3>
        <br /> <br />
        {users.map((user) => (
          <div
            key={user._id}
            className={styles.userItem}
            onClick={() => handleSelectUser(user)}
          >
            {user.name} ({user.role})
          </div>
        ))}
      </div>

      {/* CHAT */}
      <div className={styles.chatBox}>

        {selectedUser ? (
          <>
            <h3>Chat with {selectedUser.name}</h3>

            <div className={styles.messages}>
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={
                    msg.sender?._id === currentUserId
                      ? styles.myMessage
                      : styles.theirMessage
                  }
                >
                  {msg.content}
                </div>
              ))}
            </div>

            <div className={styles.inputBox}>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
              />

              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <h3>Select a user to start chatting</h3>
        )}
      </div>
    </div>
  );
}

export default MessengerPage;