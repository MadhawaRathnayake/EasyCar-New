import { useContext, useEffect, useRef, useState } from "react";
import "./chat.scss";
import { AuthContext } from "../../context/authContext"
import apiRequest from "../../lib/apiRequests";
import { format } from "timeago.js"
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";

function Chat({ chats, initialReceiverId }) {
  const [chat, setChat] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  console.log(chats)
  const messageEndRef = useRef();

  const decrease = useNotificationStore(state => state.decrease);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleOpenChat = async (id, receiver) => {
    try {
      const res = await apiRequest("/chats/" + id);
      if (!res.data.seenBy.includes(currentUser.id)) {
        decrease();
      }
      setChat({ ...res.data, receiver })
    } catch (err) {
      console.log(err);
    }
  };

  // Auto-open a chat when `initialReceiverId` is provided (e.g., navigated from a post)
  // This runs after `chats` are available and will open the matching chat.
  useEffect(() => {
    if (!initialReceiverId || !chats || chats.length === 0) return;
    const run = async () => {
      console.log("auto-open initialReceiverId:", initialReceiverId, "chats:", chats);
      const target = chats.find((c) => {
        const rid = c.receiver?.id ?? c.receiverId ?? (c.participants && c.participants.find(p => p.id !== currentUser.id)?.id);
        return String(rid) === String(initialReceiverId);
      });
      if (target) {
        await handleOpenChat(target.id, target.receiver ?? null);
        return;
      }

      // No existing chat found — create one then open it
      try {
        if (String(initialReceiverId) === String(currentUser?.id)) return; // don't create chat with self
        const res = await apiRequest.post("/chats", { receiverId: initialReceiverId });
        // res.data should contain the new chat id. Open it — provide a minimal receiver object so UI can render.
        await handleOpenChat(res.data.id, { id: initialReceiverId });
      } catch (err) {
        console.log("failed to create/open chat:", err);
      }
    };
    run();
  }, [initialReceiverId, chats]);

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get("text");
    if (!text) return;
    try {
      const res = await apiRequest.post("/messages/" + chat.id, { text });
      setChat(prev => ({ ...prev, messages: [...prev.messages, res.data] }));
      e.target.reset();
      socket.emit("sendMessage", {
        receiverId: chat.receiver.id,
        data: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const read = async () => {
      try {
        await apiRequest.put("/chats/read/" + chat.id);
      } catch (err) {
        console.log(err);
      }
    };

    if (chat && socket) {
      socket.on("getMessage", (data) => {
        if (chat.id === data.chatId) {
          setChat((prev) => ({ ...prev, messages: [...prev.messages, data] }));
          read();
        }
      });
    }
    return () => {
      socket.off("getMessage");
    };
  }, [socket, chat]);

  return (
    <div className="chat">
      <div className="messages">
        <h1>Messages</h1>
        {chats?.map(c => (
          <div className="message" key={c.id}
            style={{
              backgroundColor:
                c.seenBy.includes(currentUser.id) || chat?.id === c.id
                  ? "white"
                  : "#4ccaf049",
            }}
            onClick={() => handleOpenChat(c.id, c.receiver)}>
            <img
              src={c.receiver.avatar || "/noavatar.jpg"}
              alt=""
            />
            <span>{c.receiver.username}</span>
            <p>{c.lastMessage}</p>
          </div>
        ))}
      </div>
      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img
                src={chat.receiver.avatar || "/noavatar.jpg"}
                alt=""
              />
              {chat.receiver.username}
            </div>
            <span className="close" onClick={() => setChat(null)}>X</span>
          </div>
          <div className="center">
            {chat.messages.map(message => (
              <div className="chatMessage"
                style={{
                  alignSelf: message.userId === currentUser.id ? "flex-end" : "flex-start",
                  textAlign: message.userId === currentUser.id ? "right" : "left",
                }}
                key={message.id}>
                <p>{message.text}</p>
                <span>{format(message.createdAt)}</span>
              </div>
            ))}
            <div ref={messageEndRef}></div>
          </div>
          <form onSubmit={handleSubmit} className="bottom">
            <textarea name="text"></textarea>
            <button>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
