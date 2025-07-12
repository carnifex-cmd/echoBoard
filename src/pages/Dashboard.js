// Dashboard page component for displaying and managing boards
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { signOutUser } from '../firebase/auth';
import { getUserBoards, createBoard, updateBoard, deleteBoard } from '../firebase/firestore';
import BoardCard from '../components/BoardCard';

const Dashboard = () => {
  const { user } = useAuth();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBoard, setEditingBoard] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: false
  });

  const loadBoards = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const userBoards = await getUserBoards(user.uid);
      setBoards(userBoards);
    } catch (error) {
      setError('Failed to load boards');
      console.error('Error loading boards:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load user boards
  useEffect(() => {
    loadBoards();
  }, [loadBoards]);

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    try {
      if (!formData.name.trim()) {
        setError('Board name is required');
        return;
      }

      const boardData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        isPublic: formData.isPublic,
        userId: user.uid,
        userEmail: user.email,
        noteCount: 0
      };

      await createBoard(boardData);
      setShowCreateForm(false);
      setFormData({ name: '', description: '', isPublic: false });
      setError(null);
      await loadBoards();
    } catch (error) {
      setError('Failed to create board');
      console.error('Error creating board:', error);
    }
  };

  const handleEditBoard = (board) => {
    setEditingBoard(board);
    setFormData({
      name: board.name,
      description: board.description || '',
      isPublic: board.isPublic
    });
    setShowCreateForm(true);
  };

  const handleUpdateBoard = async (e) => {
    e.preventDefault();
    try {
      if (!formData.name.trim()) {
        setError('Board name is required');
        return;
      }

      const updates = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        isPublic: formData.isPublic
      };

      await updateBoard(editingBoard.id, updates);
      setShowCreateForm(false);
      setEditingBoard(null);
      setFormData({ name: '', description: '', isPublic: false });
      setError(null);
      await loadBoards();
    } catch (error) {
      setError('Failed to update board');
      console.error('Error updating board:', error);
    }
  };

  const handleDeleteBoard = async (boardId) => {
    if (window.confirm('Are you sure you want to delete this board? This action cannot be undone.')) {
      try {
        await deleteBoard(boardId);
        await loadBoards();
      } catch (error) {
        setError('Failed to delete board');
        console.error('Error deleting board:', error);
      }
    }
  };

  const handleTogglePrivacy = async (boardId, isPublic) => {
    try {
      await updateBoard(boardId, { isPublic });
      await loadBoards();
    } catch (error) {
      setError('Failed to update board privacy');
      console.error('Error updating board privacy:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', isPublic: false });
    setEditingBoard(null);
    setShowCreateForm(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your boards...</p>
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
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">EchoBoard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img 
                  src={user?.photoURL} 
                  alt={user?.displayName}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium text-gray-700">{user?.displayName}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Your Boards</h2>
            <p className="text-gray-600 mt-1">Create and manage your audio message boards</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Board
          </button>
        </div>

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

        {/* Create/Edit Board Form */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingBoard ? 'Edit Board' : 'Create New Board'}
              </h3>
              
              <form onSubmit={editingBoard ? handleUpdateBoard : handleCreateBoard} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Board Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., Dev Logs, Ideas, Meeting Notes"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Describe what this board is for..."
                    rows="3"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isPublic}
                      onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Make this board public</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Public boards can be viewed by anyone with the link
                  </p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    {editingBoard ? 'Update Board' : 'Create Board'}
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
          </div>
        )}

        {/* Boards Grid */}
        {boards.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No boards yet</h3>
            <p className="text-gray-600 mb-4">Create your first board to start recording audio notes</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary"
            >
              Create Your First Board
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boards.map((board) => (
              <BoardCard
                key={board.id}
                board={board}
                onEdit={handleEditBoard}
                onDelete={handleDeleteBoard}
                onTogglePrivacy={handleTogglePrivacy}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard; 