import { useState, useEffect, useMemo } from 'react'
import { Heart, User, ArrowLeft, Users, UserPlus, Plus } from 'lucide-react'
import { CreateMurmurCard } from './components/AddMurmurCard/CreateMurmurCard'
import {MurmurCard} from './components/MurmurCard/MurmurCard';
import {Signin} from './components/Auth/Signin';
import api from './utils/api'


const MURMURS_PER_PAGE = 10;


const App = () => {
  const [currentView, setCurrentView] = useState('timeline');
  const [selectedMurmur, setSelectedMurmur] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [likedMurmurs, setLikedMurmurs] = useState(new Set());
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access_token'));

  const [murmurs, setMurmurs] = useState([])

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchMurmurs = async () => {
      try {
        const response = await api.get(`/api/murmurs?page=${currentPage}&limit=10`)
        setMurmurs(response.data.items)
      } catch (error) {
        console.error('Error fetching murmurs:', error)
      }
    }
    fetchMurmurs()
  }, [])


  useEffect(() => {

    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
    if (token) {
      setCurrentView('timeline');
    }
  }, []);

const handleFollow = async (userId:number) => {
  const response = await api.post(`/api/users/${userId}/follow`, {
    authorId: user.id
  })
}

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};


  const createMurmurCard = useMemo(() => {
    return (
      <CreateMurmurCard
      />
    );
  }, []);



  const Timeline = () => {
    const [timelineMurmurs, setTimelineMurmurs] = useState([]);
    const [timelineMurmursMeta, setTimelineMurmursMeta] = useState<any>([]);
    const totalPages = Math.ceil(timelineMurmursMeta?.totalItems / MURMURS_PER_PAGE);

    useEffect(() => {
      const fetchTimelineMurmurs = async () => {
        try {
          const response = await api.get(`/api/murmurs?page=${currentPage}&limit=${MURMURS_PER_PAGE}`);
          setTimelineMurmurs(response.data.items);
          setTimelineMurmursMeta(response.data.meta);
        } catch (error) {
          console.error('Error fetching murmurs:', error);
        }
      };
      fetchTimelineMurmurs();
    }, [])


    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Timeline</h1>
          <p className="text-gray-600">Discover what's happening around you</p>
        </div>

        {createMurmurCard}

        <div>
          {timelineMurmurs?.map(murmur => (
            <div key={murmur.id}>
              <MurmurCard
                onClick={() => {
                  setSelectedMurmur(murmur);
                  setCurrentView('murmurDetail');
                }}
                murmur={murmur}
                setSelectedUser={setSelectedUser}
                setCurrentView={setCurrentView}
                showDeleteButton={true}
              />
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  };

  const MurmurDetail = () => {
    if (!selectedMurmur) return null;

    return (
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setCurrentView('timeline')}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Timeline</span>
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <div className="flex items-start space-x-4 mb-6">
            <div
              className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg cursor-pointer hover:from-blue-600 hover:to-purple-700 transition-colors"
              onClick={() => {
                setSelectedUser(user);
                setCurrentView('userDetail');
              }}
            >
              {user?.displayName.charAt(0)}
            </div>
            <div className="flex-1">
              <h2
                className="text-xl font-semibold text-gray-900 mb-1 hover:text-blue-600 cursor-pointer"
                onClick={() => {
                  setSelectedUser(user);
                  setCurrentView('userDetail');
                }}
              >
                {user?.displayName.charAt(0)}
              </h2>
              <p className="text-gray-600 text-sm">{formatTimestamp(selectedMurmur.createdAt)}</p>
            </div>
          </div>

          <p className="text-gray-800 text-lg leading-relaxed mb-6">{selectedMurmur.content}</p>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              // onClick={(e) => handleLike(selectedMurmur.id, e)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                likedMurmurs.has(selectedMurmur.id)
                  ? 'text-red-500 bg-red-50 hover:bg-red-100'
                  : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
              }`}
            >
              <Heart className={`w-5 h-5 ${likedMurmurs.has(selectedMurmur.id) ? 'fill-current' : ''}`} />
              <span className="font-medium">{selectedMurmur.likes} likes</span>
            </button>
          </div>
        </div>
      </div>
    );
  };



  const UserDetail = () => {
    if (!selectedUser) return null;

    const userMurmurs = murmurs.filter(murmur => murmur.author.id === selectedUser.id)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
      const userDetails = async () =>{
        try {
          const response = await api.get(`/users/${selectedUser.id}`);
          setUserDetails(response.data);
        } catch (error) {
          console.error('Error fetching user details:', error);
          return null;
        }
      }

      userDetails()
    }, [selectedUser.id])

    const isOwnProfile = selectedUser.id === user.id;


    return (
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setCurrentView('timeline')}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Timeline</span>
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 mb-6">
          <div className="flex items-center space-x-6 mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {selectedUser?.displayName?.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedUser.name}</h1>
              <div className="flex items-center space-x-6 text-gray-600">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{userDetails?.followingCount} Following</span>
                </div>
                <div className="flex items-center space-x-1">
                  <UserPlus className="w-4 h-4" />
                  <span>{userDetails?.followersCount} Followers</span>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1 bg-indigo-800 p-2 text-white rounded ">
                <Plus className="w-4 h-4" />
                <button onClick={e=>(handleFollow(selectedUser.id))}>Follow</button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {isOwnProfile ? 'Your Murmurs' : `${user.displayName}'s Murmurs`}
          </h2>
          <p className="text-gray-600 mb-4">{userMurmurs.length} murmur{userMurmurs.length !== 1 ? 's' : ''}</p>
        </div>

        {userMurmurs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No murmurs yet</p>
          </div>
        ) : (
          userMurmurs.map(murmur => (
           <div key={murmur.id}>
             <MurmurCard

              murmur={murmur}
              showDeleteButton={isOwnProfile}
              onClick={() => {
                setSelectedMurmur(murmur);
                setCurrentView('murmurDetail');
              }}
            /></div>
          ))
        )}
      </div>
    );
  };

  const Navigation = () => (
    <nav className="bg-white shadow-sm border-b border-gray-200 mb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Murmur</h1>
          </div>

          <div className="flex items-center space-x-6">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => {
                    setCurrentView('timeline');
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                    currentView === 'timeline'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Timeline
                </button>
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setCurrentView('userDetail');
                  }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                    currentView === 'userDetail'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    window.location.href = '/';
                  }}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setCurrentView('login')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg font-medium transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {currentView === 'timeline' && <Timeline />}
        {currentView === 'murmurDetail' && <MurmurDetail />}
        {currentView === 'userDetail' && <UserDetail />}
        {currentView === 'login' && <Signin />}
      </div>
    </div>
  );
};

export default App;
