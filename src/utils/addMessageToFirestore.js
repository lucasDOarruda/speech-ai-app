import { db, auth } from '../firebase'; // Adjust the path to your firebase.js
import { collection, doc, setDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';

// Function to send a message
export const sendMessage = async (receiverId, message) => {
  const senderId = auth.currentUser.uid;

  // Ensure that the document ID is unique for each conversation
  const messageDocRef = doc(db, 'messages', `${senderId}_${receiverId}`);

  try {
    await setDoc(messageDocRef, {
      messages: arrayUnion({
        senderId,
        receiverId,
        message,
        timestamp: serverTimestamp(), // Automatically add the server timestamp
      }),
    }, { merge: true });
  } catch (error) {
    console.error("Error sending message: ", error);
  }
};
