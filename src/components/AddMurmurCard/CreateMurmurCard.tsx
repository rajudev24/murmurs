import  { useState, useCallback, memo } from 'react'
import { AlertCircle, Loader2, Send } from 'lucide-react'
import api from '../../utils/api'

export const CreateMurmurCard = memo(({ }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newMurmurText, setNewMurmurText] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [error, setError] = useState(null);
   const loggedInUser = localStorage.getItem('user');
   const currentUser = loggedInUser ? JSON.parse(loggedInUser) : null;



  const handleCreateMurmur = useCallback(async () => {
    if (!newMurmurText.trim()) {
      setError('Please enter some text for your murmur');
      return;
    }

    if (newMurmurText.length > 280) {
      setError('Murmur text must be 280 characters or less');
      return;
    }

    setCreateLoading(true);
    setError(null);

    const getUser = localStorage.getItem('user')
    if (!getUser) {
      setError('You must be logged in to create a murmur');
      setCreateLoading(false);
      return;
    }
    const currentUser = JSON.parse(getUser);

    try {
      const murmurData = {
        content: newMurmurText.trim(),
        authorId: currentUser.id,
      };
      const response = await api.post('/api/me/murmurs', murmurData)

      console.log('Created murmur:', response.data);
      setNewMurmurText('');


    } catch (err) {
      console.error('Failed to create murmur:', err);
      setError('Failed to create murmur. Please try again.');
    } finally {
      setCreateLoading(false);
    }
  }, [newMurmurText,]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    handleCreateMurmur();
  }, [handleCreateMurmur]);

  const handleTextareaClick = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const handleCancel = useCallback(() => {
    setIsExpanded(false);
    setNewMurmurText('');
  }, [setNewMurmurText]);


  const handleTextChange = useCallback((e) => {
    setNewMurmurText(e.target.value);
  }, [setNewMurmurText]);

  if (!currentUser) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
        <p className="text-gray-600">Please log in to create a murmur.</p>
      </div>
    );
  }
  if (createLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="text-gray-600">Creating your murmur...</span>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
      <div className="flex items-start space-x-3">
        {currentUser && (
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
            {currentUser.displayName?.charAt(0) || '?'}
          </div>
        )}

        <div className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              value={newMurmurText}
              onChange={handleTextChange}
              onClick={handleTextareaClick}
              placeholder={`What's on your mind, ${currentUser?.displayName || 'there'}?`}
              className={`w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                isExpanded ? 'min-h-[120px]' : 'min-h-[50px]'
              }`}
              rows={isExpanded ? 4 : 2}
              maxLength={280}
              autoFocus={false}
            />

            {isExpanded && (
              <>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm ${newMurmurText.length > 260 ? 'text-red-500' : 'text-gray-500'}`}
                  >
                    {newMurmurText.length}/280
                  </span>

                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                      disabled={createLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={
                        createLoading ||
                        !newMurmurText.trim() ||
                        newMurmurText.length > 280
                      }
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 text-sm font-medium"
                    >
                      {createLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Posting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Post</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span className="text-red-700 text-sm">{error}</span>
                  </div>
                )}
              </>
            )}
          </form>

          {!isExpanded && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <button
                onClick={handleTextareaClick}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                <Send className="w-4 h-4" />
                <span>Share your thoughts...</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
});
