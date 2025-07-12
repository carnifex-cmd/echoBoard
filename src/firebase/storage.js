// Firebase Storage helper functions for audio files
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { storage } from './config';

// Upload audio file to Firebase Storage
export const uploadAudioFile = async (audioBlob, userId, boardId, fileName) => {
  try {
    // Create a reference to the file location
    const audioRef = ref(storage, `audio/${userId}/${boardId}/${fileName}`);
    
    // Upload the file
    const snapshot = await uploadBytes(audioRef, audioBlob);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return {
      url: downloadURL,
      path: snapshot.ref.fullPath,
      size: snapshot.metadata.size
    };
  } catch (error) {
    console.error('Error uploading audio file:', error);
    throw error;
  }
};

// Delete audio file from Firebase Storage
export const deleteAudioFile = async (filePath) => {
  try {
    const audioRef = ref(storage, filePath);
    await deleteObject(audioRef);
  } catch (error) {
    console.error('Error deleting audio file:', error);
    throw error;
  }
};

// Generate unique filename for audio
export const generateAudioFileName = (originalName = 'audio') => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.includes('.') ? originalName.split('.').pop() : 'webm';
  return `${timestamp}_${randomString}.${extension}`;
};

// Convert audio blob to different formats if needed
export const convertAudioBlob = (audioBlob, targetType = 'audio/webm') => {
  return new Promise((resolve, reject) => {
    if (audioBlob.type === targetType) {
      resolve(audioBlob);
      return;
    }
    
    // For now, just return the original blob
    // In a real implementation, you might want to use a library like ffmpeg.js
    resolve(audioBlob);
  });
};

// Get audio file metadata
export const getAudioDuration = (audioBlob) => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    const objectURL = URL.createObjectURL(audioBlob);
    
    audio.addEventListener('loadedmetadata', () => {
      URL.revokeObjectURL(objectURL);
      resolve(audio.duration);
    });
    
    audio.addEventListener('error', (error) => {
      URL.revokeObjectURL(objectURL);
      reject(error);
    });
    
    audio.src = objectURL;
  });
}; 