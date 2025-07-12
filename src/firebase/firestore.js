// Firestore helper functions for EchoBoard
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  setDoc,
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';

// Collections
export const COLLECTIONS = {
  USERS: 'users',
  BOARDS: 'boards',
  NOTES: 'notes'
};

// User operations
export const createUser = async (uid, userData) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return userRef;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUser = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, uid));
    return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

// Board operations
export const createBoard = async (boardData) => {
  try {
    const boardRef = await addDoc(collection(db, COLLECTIONS.BOARDS), {
      ...boardData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return boardRef.id;
  } catch (error) {
    console.error('Error creating board:', error);
    throw error;
  }
};

export const getUserBoards = async (userId) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.BOARDS),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting user boards:', error);
    throw error;
  }
};

export const getPublicBoard = async (userId, boardName) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.BOARDS),
      where('userId', '==', userId),
      where('name', '==', boardName),
      where('isPublic', '==', true),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.length > 0 ? 
      { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } : null;
  } catch (error) {
    console.error('Error getting public board:', error);
    throw error;
  }
};

export const updateBoard = async (boardId, updates) => {
  try {
    const boardRef = doc(db, COLLECTIONS.BOARDS, boardId);
    await updateDoc(boardRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating board:', error);
    throw error;
  }
};

export const deleteBoard = async (boardId) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.BOARDS, boardId));
  } catch (error) {
    console.error('Error deleting board:', error);
    throw error;
  }
};

// Note operations
export const createNote = async (noteData) => {
  try {
    const noteRef = await addDoc(collection(db, COLLECTIONS.NOTES), {
      ...noteData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return noteRef.id;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};

export const getBoardNotes = async (boardId) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.NOTES),
      where('boardId', '==', boardId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting board notes:', error);
    throw error;
  }
};

export const updateNote = async (noteId, updates) => {
  try {
    const noteRef = doc(db, COLLECTIONS.NOTES, noteId);
    await updateDoc(noteRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

export const deleteNote = async (noteId) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.NOTES, noteId));
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
}; 