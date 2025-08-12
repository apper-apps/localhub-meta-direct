import { useState, useEffect } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import bookmarkService from '@/services/api/bookmarkService';
import userService from '@/services/api/userService';
import { cn } from '@/utils/cn';

function UserProfileSidebar({ activeModule, onClose, className }) {
  const [activeTab, setActiveTab] = useState('activity');
  const [bookmarks, setBookmarks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [userProfile, userBookmarks, userActivities] = await Promise.all([
        userService.getCurrentUser(),
        bookmarkService.getAll(),
        userService.getActivity()
      ]);
      
      setUser(userProfile);
      setBookmarks(userBookmarks);
      setActivities(userActivities);
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (itemId, module) => {
    try {
      await bookmarkService.remove(itemId, module);
      setBookmarks(prev => prev.filter(b => !(b.itemId === itemId && b.module === module)));
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  const getModuleIcon = (module) => {
    const icons = {
      'qa': 'MessageCircle',
      'business': 'Building2',
      'events': 'Calendar',
      'jobs': 'Briefcase',
      'realestate': 'Home',
      'cars': 'Car'
    };
    return icons[module] || 'Bookmark';
  };

  const getActivityIcon = (type) => {
    const icons = {
      'bookmark_add': 'BookmarkPlus',
      'bookmark_remove': 'BookmarkMinus',
      'question_ask': 'MessageCircleQuestion',
      'question_answer': 'MessageCircleReply',
      'vote': 'ThumbsUp',
      'view': 'Eye',
      'search': 'Search'
    };
    return icons[type] || 'Activity';
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const tabs = [
    { id: 'activity', label: 'Activity', icon: 'Activity' },
    { id: 'bookmarks', label: 'Bookmarks', icon: 'Bookmark' },
    { id: 'settings', label: 'Settings', icon: 'Settings' }
  ];

  if (loading) {
    return (
      <Card className={cn("h-fit", className)}>
        <div className="p-6 space-y-4">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="w-32 h-4 bg-gray-200 rounded"></div>
                <div className="w-24 h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-8 bg-gray-200 rounded"></div>
              <div className="w-full h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("h-fit", className)}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1 hover:bg-gray-100"
          >
            <ApperIcon name="X" size={16} />
          </Button>
        </div>
        
        {/* User Info */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{user?.name || 'Local User'}</h3>
            <p className="text-sm text-gray-500">{user?.location || 'San Francisco, CA'}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center justify-center space-x-2",
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              <ApperIcon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'activity' && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 mb-3">Recent Activity</h4>
            {activities.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Activity" size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activities.slice(0, 10).map((activity) => (
                  <div key={activity.Id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <ApperIcon name={getActivityIcon(activity.type)} size={14} className="text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {activity.module}
                        </Badge>
                        <span className="text-xs text-gray-500">{formatTimeAgo(activity.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookmarks' && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 mb-3">Saved Items</h4>
            {bookmarks.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Bookmark" size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No bookmarks yet</p>
                <p className="text-xs text-gray-400 mt-1">Save items to view them here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookmarks.map((bookmark) => (
                  <div key={`${bookmark.module}-${bookmark.itemId}`} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 min-w-0 flex-1">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <ApperIcon name={getModuleIcon(bookmark.module)} size={14} className="text-gray-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h5 className="text-sm font-medium text-gray-900 truncate">{bookmark.title}</h5>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {bookmark.module}
                            </Badge>
                            <span className="text-xs text-gray-500">{formatTimeAgo(bookmark.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveBookmark(bookmark.itemId, bookmark.module)}
                        className="p-1 hover:bg-gray-100 ml-2"
                      >
                        <ApperIcon name="X" size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 mb-3">Settings</h4>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-medium text-gray-900">Email Notifications</h5>
                    <p className="text-xs text-gray-500">Get updates about your activity</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <ApperIcon name="Settings" size={14} />
                  </Button>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-medium text-gray-900">Privacy</h5>
                    <p className="text-xs text-gray-500">Manage your privacy preferences</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <ApperIcon name="Shield" size={14} />
                  </Button>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-medium text-gray-900">Location</h5>
                    <p className="text-xs text-gray-500">Update your location preferences</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <ApperIcon name="MapPin" size={14} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

export default UserProfileSidebar;