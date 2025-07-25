// Placeholder transcription utility with mock AI transcription
// In a real implementation, you would integrate with services like:
// - OpenAI Whisper API
// - Google Cloud Speech-to-Text
// - AWS Transcribe
// - Azure Speech Services

// Mock transcription responses for demo purposes
const mockTranscriptions = [
  "This is a sample transcription of your audio note. In a real implementation, this would be generated by an AI transcription service.",
  "Here's another example of what a transcribed audio note might look like. The AI would convert your speech to text automatically.",
  "This is a placeholder transcription. You can integrate with OpenAI Whisper, Google Speech-to-Text, or other services for real transcription.",
  "In production, this function would send your audio to a transcription service and return the actual text content.",
  "This demo shows how transcription would work. The text would be automatically generated from your voice recording."
];

// Mock API delay to simulate real service
const simulateApiDelay = (ms = 2000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Main transcription function
export const transcribeAudio = async (audioBlob) => {
  try {
    // Simulate API call delay
    await simulateApiDelay(1500);
    
    // Return a random mock transcription
    const randomIndex = Math.floor(Math.random() * mockTranscriptions.length);
    const transcription = mockTranscriptions[randomIndex];
    
    console.log('Mock transcription generated:', transcription);
    return transcription;
    
  } catch (error) {
    console.error('Error in transcription:', error);
    return "Transcription failed. Please try again.";
  }
};

// Real implementation example with OpenAI Whisper (commented out)
/*
export const transcribeAudioWithWhisper = async (audioBlob) => {
  try {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');
    
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Transcription failed');
    }
    
    const data = await response.json();
    return data.text;
    
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
};
*/

// Real implementation example with Google Speech-to-Text (commented out)
/*
export const transcribeAudioWithGoogle = async (audioBlob) => {
  try {
    // Convert audio blob to base64
    const base64Audio = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(audioBlob);
    });
    
    const response = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${process.env.REACT_APP_GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        config: {
          encoding: 'WEBM_OPUS',
          sampleRateHertz: 48000,
          languageCode: 'en-US',
        },
        audio: {
          content: base64Audio,
        },
      }),
    });
    
    if (!response.ok) {
      throw new Error('Transcription failed');
    }
    
    const data = await response.json();
    return data.results?.[0]?.alternatives?.[0]?.transcript || 'No transcription available';
    
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
};
*/

// Helper function to validate audio format
export const validateAudioFormat = (audioBlob) => {
  const validTypes = ['audio/webm', 'audio/ogg', 'audio/wav', 'audio/mp3', 'audio/mp4'];
  return validTypes.includes(audioBlob.type);
};

// Helper function to check audio duration
export const checkAudioDuration = async (audioBlob, maxDuration = 300) => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    const objectURL = URL.createObjectURL(audioBlob);
    
    audio.addEventListener('loadedmetadata', () => {
      URL.revokeObjectURL(objectURL);
      resolve(audio.duration <= maxDuration);
    });
    
    audio.addEventListener('error', (error) => {
      URL.revokeObjectURL(objectURL);
      reject(error);
    });
    
    audio.src = objectURL;
  });
};

export default transcribeAudio; 