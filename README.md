# EchoBoard 🎙️

A personal audio message board where you can record, organize, and share your voice notes with ease.

## Features

- 🎤 **Record Audio Notes**: Record voice notes up to 5 minutes long using your device's microphone
- 📁 **Organize with Boards**: Create custom boards to categorize your notes (e.g., "Dev Logs", "Ideas", "Meeting Notes")
- 🔒 **Privacy Controls**: Choose to keep boards private or make them publicly shareable
- 🤖 **AI Transcription**: Automatic transcription of your audio notes (placeholder implementation)
- 🎵 **Rich Audio Player**: Full-featured audio player with progress control and time display
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🔐 **Google Authentication**: Secure sign-in with your Google account

## Tech Stack

- **Frontend**: React.js with functional components and hooks
- **Styling**: Tailwind CSS for modern, responsive design
- **Backend**: Firebase (Firestore, Storage, Authentication)
- **Audio**: Web Audio API for recording and playback
- **Routing**: React Router for navigation
- **State Management**: React hooks and Context API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Firebase project with the following services enabled:
  - Authentication (Google provider)
  - Firestore Database
  - Storage

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd echoboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select an existing one
   - Enable Authentication with Google provider
   - Create a Firestore database
   - Enable Storage
   - Get your Firebase configuration from Project Settings

4. **Configure Firebase Environment Variables**
   - Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   - Open `.env` and replace the placeholder values with your actual Firebase config:
   ```bash
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
   REACT_APP_FIREBASE_APP_ID=your-app-id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Open your browser**
   - Navigate to `http://localhost:3000`
   - Sign in with your Google account
   - Start creating boards and recording notes!

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── BoardCard.js     # Board display card
│   ├── RecordButton.js  # Audio recording button
│   └── VoiceNote.js     # Audio note player
├── pages/              # Main application pages
│   ├── Login.js        # Authentication page
│   ├── Dashboard.js    # Boards overview
│   └── Board.js        # Individual board view
├── firebase/           # Firebase configuration and helpers
│   ├── config.js       # Firebase setup
│   ├── auth.js         # Authentication helpers
│   ├── firestore.js    # Database operations
│   └── storage.js      # File upload helpers
├── hooks/              # Custom React hooks
│   ├── useAuth.js      # Authentication state management
│   └── useRecorder.js  # Audio recording logic
├── utils/              # Utility functions
│   └── transcription.js # AI transcription (placeholder)
├── App.js              # Main application component
└── index.js            # Application entry point
```

## Key Components

### RecordButton
- Handles audio recording with visual feedback
- Supports up to 5-minute recordings
- Shows recording duration and waveform animation
- Automatic microphone permission handling

### VoiceNote
- Full-featured audio player with progress bar
- Displays note metadata (title, date, duration)
- Supports editing and deletion
- Shows transcription when available

### BoardCard
- Displays board information in a card layout
- Privacy toggle (public/private)
- Share link generation for public boards
- Edit and delete functionality

## Firebase Security Rules

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only read/write their own boards
    match /boards/{boardId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      // Allow read for public boards
      allow read: if resource.data.isPublic == true;
    }
    
    // Users can only read/write notes in their own boards
    match /notes/{noteId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can only upload to their own directory
    match /audio/{userId}/{boardId}/{fileName} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Deployment

### Deploy to Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase Hosting**
   ```bash
   firebase init hosting
   ```

4. **Build and deploy**
   ```bash
   npm run build
   firebase deploy
   ```

### Deploy to Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `build`
   - Deploy!

## AI Transcription Setup

The app includes a placeholder transcription service. To enable real AI transcription, you can integrate with:

### OpenAI Whisper API
```javascript
// Add to .env
REACT_APP_OPENAI_API_KEY=your-openai-key

// Uncomment the transcribeAudioWithWhisper function in src/utils/transcription.js
```

### Google Speech-to-Text
```javascript
// Add to .env
REACT_APP_GOOGLE_API_KEY=your-google-key

// Uncomment the transcribeAudioWithGoogle function in src/utils/transcription.js
```

## Browser Support

- Chrome (recommended for best audio recording support)
- Firefox
- Safari (iOS 14.3+)
- Edge

**Note**: Microphone access requires HTTPS in production.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Powered by [Firebase](https://firebase.google.com/)
- Icons from [Heroicons](https://heroicons.com/)

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/yourusername/echoboard/issues) on GitHub.

---

Made with ❤️ for capturing your voice, one note at a time.
