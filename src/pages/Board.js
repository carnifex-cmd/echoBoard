// Board page component for viewing and managing notes within a specific board
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getBoardNotes, createNote, updateNote, deleteNote } from '../firebase/firestore';
import { uploadAudioFile, generateAudioFileName, getAudioDuration } from '../firebase/storage';
import { transcribeAudio } from '../utils/transcription';
import RecordButton from '../components/RecordButton';
import VoiceNote from '../components/VoiceNote';

const Board = () => {
  const { boardId } = useParams();
  const { user } = useAuth();
  
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [recordedAudio, setRecordedAudio] = useState(null);

  const loadBoardData = useCallback(async () => {
    try {
      setLoading(true);
      // For now, we'll get the board info from the notes query
      // In a real app, you might want to fetch board details separately
      const boardNotes = await getBoardNotes(boardId);
      setNotes(boardNotes);
    } catch (error) {
      setError('Failed to load board data');
      console.error('Error loading board:', error);
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    loadBoardData();
  }, [loadBoardData]);

  const handleRecordingComplete = async (audioBlob, audioURL, duration) => {
    setRecordedAudio({ blob: audioBlob, url: audioURL, duration });
    setShowNoteForm(true);
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!recordedAudio) return;

    try {
      setIsUploading(true);
      setError(null);

      // Generate filename and upload audio
      const fileName = generateAudioFileName();
      const uploadResult = await uploadAudioFile(
        recordedAudio.blob,
        user.uid,
        boardId,
        fileName
      );

      // Get audio duration
      const audioDuration = await getAudioDuration(recordedAudio.blob);

      // Generate transcription (placeholder for now)
      const transcription = await transcribeAudio(recordedAudio.blob);

      // Create note document
      const noteData = {
        title: noteTitle.trim() || 'Untitled Note',
        audioUrl: uploadResult.url,
        audioPath: uploadResult.path,
        duration: audioDuration,
        transcription: transcription,
        boardId: boardId,
        userId: user.uid,
        userEmail: user.email,
        tags: [] // You could add tag functionality later
      };

      await createNote(noteData);
      
      // Reset form
      setShowNoteForm(false);
      setRecordedAudio(null);
      setNoteTitle('');
      
      // Reload notes
      await loadBoardData();
    } catch (error) {
      setError('Failed to save note');
      console.error('Error saving note:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditNote = async (note) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    // For now, we'll only allow editing the title
    // You could extend this to allow re-recording
  };

  const handleUpdateNote = async (e) => {
    e.preventDefault();
    if (!editingNote) return;

    try {
      await updateNote(editingNote.id, {
        title: noteTitle.trim() || 'Untitled Note'
      });
      
      setEditingNote(null);
      setNoteTitle('');
      await loadBoardData();
    } catch (error) {
      setError('Failed to update note');
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId);
      await loadBoardData();
    } catch (error) {
      setError('Failed to delete note');
      console.error('Error deleting note:', error);
    }
  };

  const resetForm = () => {
    setShowNoteForm(false);
    setEditingNote(null);
    setRecordedAudio(null);
    setNoteTitle('');
    setError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading board...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard" 
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Board</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">{user?.displayName}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-800 text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Recording Section */}
        {!showNoteForm && !editingNote && (
          <div className="card mb-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Record New Note</h2>
              <p className="text-gray-600 mb-6">
                Record an audio note up to 5 minutes long
              </p>
              <RecordButton 
                onRecordingComplete={handleRecordingComplete}
                maxDuration={300}
              />
            </div>
          </div>
        )}

        {/* Note Form */}
        {showNoteForm && (
          <div className="card mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Save Your Note
            </h3>
            
            {/* Audio Preview */}
            {recordedAudio && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Preview your recording:</p>
                <audio controls className="w-full">
                  <source src={recordedAudio.url} type="audio/webm" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            <form onSubmit={handleSaveNote} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note Title
                </label>
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter a title for your note..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isUploading}
                  className="btn-primary flex-1"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    'Save Note'
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Edit Note Form */}
        {editingNote && (
          <div className="card mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Edit Note
            </h3>
            
            <form onSubmit={handleUpdateNote} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note Title
                </label>
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter a title for your note..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Update Note
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Notes List */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Your Notes ({notes.length})
          </h3>
          
          {notes.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h4>
              <p className="text-gray-600">Record your first audio note to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => (
                <VoiceNote
                  key={note.id}
                  note={note}
                  onEdit={handleEditNote}
                  onDelete={handleDeleteNote}
                  showTranscription={true}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Board; 