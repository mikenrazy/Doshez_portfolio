import React, { useState, useEffect } from 'react';
import { 
  User, 
  FileText, 
  Image, 
  Settings, 
  LogOut,
  Edit3,
  Save,
  Upload,
  Trash2,
  Plus
} from 'lucide-react';
import { adminAuth } from '../../services/adminAuth';
import { portfolioService } from '../../services/portfolioService';
import type { AdminUser, PortfolioContent } from '../../types/admin';
import './AdminDashboard.css';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState<AdminUser | null>(null);
  const [portfolioContent, setPortfolioContent] = useState<PortfolioContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingContent, setEditingContent] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);

  useEffect(() => {
    const currentUser = adminAuth.getCurrentUser();
    setUser(currentUser);
    loadPortfolioContent();
  }, []);

  const loadPortfolioContent = async () => {
    setLoading(true);
    try {
      const content = await portfolioService.getContent();
      setPortfolioContent(content);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await adminAuth.logout();
    onLogout();
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const imageUrl = await portfolioService.uploadMedia(file, 'profile');
      if (imageUrl && user) {
        const success = await adminAuth.updateProfile({ 
          profile_image_url: imageUrl 
        });
        if (success) {
          setUser({ ...user, profile_image_url: imageUrl });
        }
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContentUpdate = async (contentId: string, newValue: any) => {
    try {
      const success = await portfolioService.updateContent(contentId, {
        content_value: newValue
      });
      if (success) {
        await loadPortfolioContent();
        setEditingContent(null);
      }
    } catch (error) {
      console.error('Error updating content:', error);
    }
  };

  const renderProfileTab = () => (
    <div className="admin-section">
      <h2>Profile Management</h2>
      
      <div className="profile-card">
        <div className="profile-image-section">
          <div className="profile-image-container">
            <img 
              src={user?.profile_image_url || '/api/placeholder/150/150'} 
              alt="Profile" 
              className="profile-image"
            />
            <label className="image-upload-overlay">
              <Upload size={20} />
              <span>Change Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>

        <div className="profile-info">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={user?.full_name || ''}
              onChange={(e) => setUser(user ? { ...user, full_name: e.target.value } : null)}
              className="admin-input"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="admin-input disabled"
            />
          </div>

          <button 
            className="save-button"
            onClick={() => user && adminAuth.updateProfile({ full_name: user.full_name })}
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  const renderContentTab = () => (
    <div className="admin-section">
      <h2>Portfolio Content</h2>
      
      <div className="content-grid">
        {portfolioContent.map((content) => (
          <div key={content.id} className="content-card">
            <div className="content-header">
              <h3>{content.section} - {content.content_key}</h3>
              <button
                className="edit-button"
                onClick={() => setEditingContent(content.id)}
              >
                <Edit3 size={16} />
              </button>
            </div>

            {editingContent === content.id ? (
              <div className="content-editor">
                <textarea
                  value={JSON.stringify(content.content_value, null, 2)}
                  onChange={(e) => {
                    try {
                      const newValue = JSON.parse(e.target.value);
                      setPortfolioContent(prev => 
                        prev.map(item => 
                          item.id === content.id 
                            ? { ...item, content_value: newValue }
                            : item
                        )
                      );
                    } catch (err) {
                      // Invalid JSON, keep the text as is
                    }
                  }}
                  className="content-textarea"
                  rows={10}
                />
                <div className="editor-actions">
                  <button
                    className="save-button"
                    onClick={() => handleContentUpdate(content.id, content.content_value)}
                  >
                    <Save size={16} />
                    Save
                  </button>
                  <button
                    className="cancel-button"
                    onClick={() => setEditingContent(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="content-preview">
                <pre>{JSON.stringify(content.content_value, null, 2)}</pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderMediaTab = () => (
    <div className="admin-section">
      <h2>Media Management</h2>
      
      <div className="upload-section">
        <label className="upload-area">
          <Upload size={32} />
          <span>Upload New Media</span>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                setLoading(true);
                await portfolioService.uploadMedia(file, 'general');
                setLoading(false);
              }
            }}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      <div className="media-grid">
        {/* Media files will be displayed here */}
        <div className="media-placeholder">
          <Image size={48} />
          <p>No media files uploaded yet</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="admin-header">
          <h1>Portfolio Admin</h1>
          <p>Welcome, {user?.full_name || 'Admin'}</p>
        </div>

        <nav className="admin-nav">
          <button
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={20} />
            Profile
          </button>
          <button
            className={`nav-item ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            <FileText size={20} />
            Content
          </button>
          <button
            className={`nav-item ${activeTab === 'media' ? 'active' : ''}`}
            onClick={() => setActiveTab('media')}
          >
            <Image size={20} />
            Media
          </button>
          <button
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={20} />
            Settings
          </button>
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={20} />
          Logout
        </button>
      </div>

      <div className="admin-content">
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )}

        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'content' && renderContentTab()}
        {activeTab === 'media' && renderMediaTab()}
        {activeTab === 'settings' && (
          <div className="admin-section">
            <h2>Settings</h2>
            <p>Settings panel coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;