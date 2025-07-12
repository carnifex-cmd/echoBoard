// BoardCard component for displaying boards in the dashboard
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const BoardCard = ({ board, onEdit, onDelete, onTogglePrivacy }) => {
  const [showActions, setShowActions] = useState(false);

  const formatDate = (timestamp) => {
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getShareUrl = () => {
    return `${window.location.origin}/public/${board.userId}/${encodeURIComponent(board.name)}`;
  };

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      // You might want to show a toast notification here
      console.log('Share URL copied to clipboard');
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  return (
    <div className="card hover:shadow-lg transition-all duration-200 hover:scale-105">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Link 
            to={`/board/${board.id}`}
            className="block hover:text-primary-600 transition-colors duration-200"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {board.name}
            </h3>
          </Link>
          
          {board.description && (
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
              {board.description}
            </p>
          )}
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>{board.noteCount || 0} notes</span>
            <span>•</span>
            <span>Updated {formatDate(board.updatedAt)}</span>
          </div>
        </div>

        {/* Actions Menu */}
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          
          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <div className="py-1">
                {onEdit && (
                  <button
                    onClick={() => {
                      onEdit(board);
                      setShowActions(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit Board
                  </button>
                )}
                
                {onTogglePrivacy && (
                  <button
                    onClick={() => {
                      onTogglePrivacy(board.id, !board.isPublic);
                      setShowActions(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Make {board.isPublic ? 'Private' : 'Public'}
                  </button>
                )}
                
                {board.isPublic && (
                  <button
                    onClick={() => {
                      copyShareUrl();
                      setShowActions(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Copy Share Link
                  </button>
                )}
                
                <div className="border-t border-gray-100 my-1"></div>
                
                {onDelete && (
                  <button
                    onClick={() => {
                      onDelete(board.id);
                      setShowActions(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Delete Board
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        {/* Privacy Badge */}
        <div className="flex items-center space-x-2">
          <span className={`
            inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
            ${board.isPublic 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
            }
          `}>
            {board.isPublic ? (
              <>
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
                Public
              </>
            ) : (
              <>
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Private
              </>
            )}
          </span>
        </div>

        {/* View Button */}
        <Link 
          to={`/board/${board.id}`}
          className="btn-primary text-sm px-4 py-2"
        >
          View Board
        </Link>
      </div>

      {/* Click outside to close actions */}
      {showActions && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowActions(false)}
        />
      )}
    </div>
  );
};

export default BoardCard; 