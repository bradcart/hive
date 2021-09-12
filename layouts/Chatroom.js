import { useEffect, useRef, useState } from "react";
import Image from "next/image";
// import { formatRelative } from "date-fns";
import { useUser } from "../context/userContext";
import {
  firebase,
  // db,
  // attachMessageListener,
  // addNewMessage,
  useOnlinePresence,
} from "../firebase/clientApp";
import { UserList } from "../components/UserList";

export const Chatroom = () => {
  useOnlinePresence();
  const { user, db } = useUser();
  const { uid, displayName, photoURL } = user;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // TODO: add cleanup
  useEffect(() => {
    db.collection("messages")
      .orderBy("createdAt")
      .limit(100)
      .onSnapshot((snap) => {
        const data = snap.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setMessages(data);
        console.log("triggered");
      });
  }, [db]);

  const dummySpace = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();

    db.collection("messages").add({
      text: newMessage,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      displayName,
      photoURL,
    });

    setNewMessage("");
    dummySpace.current.scrollIntoView({ behavor: "smooth" });
  };

  function sentByUser(userId) {
    if (userId === uid) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <main id="chatroom">
      <div className="chatroom-content">
        <div>
          <UserList />
        </div>
        <div className="messages-container">
          <ul className="messages-list">
            {messages.map((message) => (
              <li
                key={message.id}
                className={
                  sentByUser(message.uid)
                    ? "messages-list--right"
                    : "messages-list--left"
                }
              >
                <div>
                  <div
                    className={
                      sentByUser(message.uid)
                        ? "message-sent"
                        : "message-received"
                    }
                  >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {message.displayName ? (
                        <span className="name">{message.displayName}</span>
                      ) : null}
                      <div
                        className={
                          sentByUser(message.uid)
                            ? "message-sent--text"
                            : "message-received--text"
                        }
                      >
                        <span>{message.text}</span>
                      </div>
                    </div>
                    <div className="avatar-wrapper">
                      {message.photoURL ? (
                        <Image
                          className="avatar"
                          src={message.photoURL}
                          alt={`${message.displayName}'s avatar`}
                          width={48}
                          height={48}
                          quality={100}
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <section ref={dummySpace}></section>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
            />

            <button type="submit" disabled={!newMessage}>
              Send
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

/* TODO: cleanup this method that only shows timestamp every 10+ mins */
/* {message.createdAt.seconds && i === 0 ? (
              <div className="timestamp">
                {formatRelative(
                  new Date(message.createdAt.seconds * 1000),
                  new Date()
                )}
              </div>
            ) : message.createdAt.seconds &&
              i > 0 &&
              message.createdAt.seconds >
                messages[i - 1].createdAt.seconds + 600 ? (
              <div className="timestamp">
                <hr
                  style={{
                    margin: "0px auto 15px auto",
                    opacity: 0.2,
                    width: "90%",
                  }}
                />
                {formatRelative(
                  new Date(message.createdAt.seconds * 1000),
                  new Date()
                )}
              </div>
            ) : null} */

// useEffect(() => {
//   const messagesRef = collection(db, "messages");
//   const messagesQuery = query(messagesRef, orderBy("createdAt"), limit(100));

//   onSnapshot(messagesQuery, (querySnapshot) => {
//     const data = querySnapshot.docs.map((doc) => ({
//       ...doc.data(),
//       id: doc.id,
//     }));

//     setMessages(data);
//   });
// }, [db]);

// const handleSubmit = (e) => {
//   e.preventDefault();

//   addDoc(collection(db, "messages"), {
//     text: newMessage,
//     createdAt: serverTimestamp(),
//     uid,
//     displayName,
//     photoURL,
//   });

//   setNewMessage("");

//   // scroll down the chat
//   dummySpace.current.scrollIntoView({ behavor: "smooth" });
// };