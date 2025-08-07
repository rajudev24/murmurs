import { Heart, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import api from '../../utils/api'

export const MurmurCard = ({
                             murmur,
                             showDeleteButton = false,
                             onClick,
                             setSelectedUser,
                             setCurrentView,
                           }) => {
  const [isLiked, setIsLiked] = useState( false)
  const [likeCount, setLikeCount] = useState(murmur.likesCount || 0)
  const loggedUser = localStorage.getItem('user')
  const loggedInUser = JSON.parse(loggedUser  || '{}')

  useEffect(() => {
    if(loggedInUser.id ===  murmur.author.id && murmur.likesCount === 1 ) {
      setIsLiked(true)
    }
  }, [])


  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  const handleLike = async (e) => {
    e.stopPropagation()
    try {
      if (isLiked) {
        const response = await api.delete(`/api/murmurs/${murmur.id}/like`, {
          data: { authorId: loggedInUser.id }
        })
        setIsLiked(false)
        setLikeCount(response.data.likesCount)

      } else {
        const response = await api.post(`/api/murmurs/${murmur.id}/like`, {
          authorId: loggedInUser.id
        })
        setIsLiked(true)
        setLikeCount(response.data.likesCount)

      }
    } catch (error) {
      console.error('Error toggling like:', error)
    } finally {

    }
  }

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (!window.confirm('Are you sure you want to delete this murmur?')) return

    try {
      await api.delete(`/api/murmurs/${murmur.id}`, {
        data: { authorId: loggedInUser.id }
      })
    } catch (error) {
      console.error('Error deleting murmur:', error)
    } finally {

    }
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        <div
          className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer hover:from-blue-600 hover:to-purple-700 transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            setSelectedUser(murmur.author)
            setCurrentView('userDetail')
          }}
        >
          {murmur.author?.displayName?.charAt(0) || 'U'}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3
              className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedUser(murmur.author)
                setCurrentView('userDetail')
              }}
            >
              {murmur.author?.displayName || 'Unknown User'}
            </h3>
            <div className="flex items-center space-x-2">
              {showDeleteButton && loggedInUser?.id === murmur.author?.id && (
                <button
                  onClick={handleDelete}
                  className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <p className="text-gray-800 mb-3 leading-relaxed">{murmur.content}</p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{formatTimestamp(murmur.createdAt)}</span>
            <button
              onClick={handleLike}
              // disabled={isLiking}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
                isLiked
                  ? 'text-red-500 bg-red-50 hover:bg-red-100'
                  : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
              } disabled:opacity-50`}

            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likeCount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
