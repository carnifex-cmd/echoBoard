// RecordButton component with visual feedback for recording state
import React from 'react';
import useRecorder from '../hooks/useRecorder';

const RecordButton = ({ onRecordingComplete, maxDuration = 300 }) => {
  const {
    isRecording,
    audioBlob,
    audioURL,
    duration,
    error,
    startRecording,
    stopRecording,
    resetRecording,
    formatDuration
  } = useRecorder();

  // Auto-stop recording at max duration
  React.useEffect(() => {
    if (isRecording && duration >= maxDuration) {
      stopRecording();
    }
  }, [isRecording, duration, maxDuration, stopRecording]);

  // Call callback when recording is complete
  React.useEffect(() => {
    if (audioBlob && onRecordingComplete) {
      onRecordingComplete(audioBlob, audioURL, duration);
    }
  }, [audioBlob, audioURL, duration, onRecordingComplete]);

  const handleRecordClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const getDurationColor = () => {
    if (duration < 30) return 'text-green-600';
    if (duration < 120) return 'text-yellow-600';
    if (duration < 240) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Recording Button */}
      <button
        onClick={handleRecordClick}
        disabled={!!error}
        className={`
          relative w-20 h-20 rounded-full flex items-center justify-center
          transition-all duration-200 transform hover:scale-105
          ${isRecording 
            ? 'bg-red-500 hover:bg-red-600 recording-animation' 
            : 'bg-primary-500 hover:bg-primary-600'
          }
          ${error ? 'bg-gray-400 cursor-not-allowed' : 'cursor-pointer'}
          focus:outline-none focus:ring-4 focus:ring-primary-200
        `}
      >
        {/* Microphone Icon */}
        <svg 
          className="w-8 h-8 text-white" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
          />
        </svg>
        
        {/* Recording indicator */}
        {isRecording && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          </div>
        )}
      </button>

      {/* Duration Display */}
      {(isRecording || duration > 0) && (
        <div className={`text-lg font-mono font-semibold ${getDurationColor()}`}>
          {formatDuration}
        </div>
      )}

      {/* Max Duration Warning */}
      {isRecording && duration > maxDuration * 0.8 && (
        <div className="text-sm text-orange-600 font-medium">
          {Math.max(0, maxDuration - duration)}s remaining
        </div>
      )}

      {/* Visual Feedback */}
      {isRecording && (
        <div className="audio-visualizer">
          <div className="audio-bar"></div>
          <div className="audio-bar"></div>
          <div className="audio-bar"></div>
          <div className="audio-bar"></div>
          <div className="audio-bar"></div>
        </div>
      )}

      {/* Status Text */}
      <div className="text-center">
        {error && (
          <p className="text-red-500 text-sm mb-2">{error}</p>
        )}
        
        {isRecording ? (
          <p className="text-gray-600 text-sm">
            Recording... Tap to stop
          </p>
        ) : audioBlob ? (
          <div className="space-y-2">
            <p className="text-green-600 text-sm">
              Recording complete! ({formatDuration})
            </p>
            <button
              onClick={resetRecording}
              className="text-sm text-primary-600 hover:text-primary-700 underline"
            >
              Record again
            </button>
          </div>
        ) : (
          <p className="text-gray-600 text-sm">
            Tap to start recording
          </p>
        )}
      </div>
    </div>
  );
};

export default RecordButton; 