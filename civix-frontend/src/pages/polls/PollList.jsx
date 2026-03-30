import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPolls } from '../../services/api';
import { Loader2, Plus, MapPin, Users, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { INDIAN_STATES } from '../../constants/locations';
import '../../styles/dashboard.css';

const PollList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Active Polls');
  const [locationFilter, setLocationFilter] = useState('');

  const tabs = user?.role === 'official' 
    ? ['Active Polls', 'My Polls', 'Closed Polls'] 
    : ['Active Polls', 'Polls I Voted On', 'Closed Polls'];

  useEffect(() => {
    if (user && user.location && locationFilter === '') {
        // Default to user's location once auth loads, but only if they haven't manually changed it
        setLocationFilter(user.location);
    }
  }, [user]);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        setLoading(true);
        // Use locationFilter for all roles to allow dynamic filtering from dropdown
        const data = await getPolls(locationFilter);
        setPolls(data);
      } catch (err) {
        setError('Failed to fetch polls. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
        fetchPolls();
    }
  }, [user, locationFilter]);

  const filteredPolls = polls.filter(poll => {
    // Determine status
    const closesOnDate = new Date(poll.closesOn);
    // If closesOn is vaguely in the past (ignoring time for simplicity)
    const isClosed = poll.closesOn && new Date().setHours(0,0,0,0) > new Date(poll.closesOn).setHours(0,0,0,0);
    const isActive = !isClosed;
    
    // Check user vote status if needed for "Polls I Voted On"
    // Since we don't have a sync hasVoted list in PollList easily without fetching all, 
    // we'll rely on a mock or simple check if we are keeping it purely frontend for now.
    // For a real app, this would be an API endpoint.
    const pollVotesKey = user ? `civix_votes_${user._id || user.id}` : null;
    const userVotes = pollVotesKey ? (JSON.parse(localStorage.getItem(pollVotesKey)) || {}) : {};
    const hasUserVoted = !!userVotes[poll.id];

    if (activeTab === 'Active Polls') {
        return isActive;
    } else if (activeTab === 'Closed Polls') {
        return isClosed;
    } else if (activeTab === 'Polls I Voted On') {
        return hasUserVoted;
    } else if (activeTab === 'My Polls') {
        return poll.createdBy === (user?._id || user?.id);
    }
    
    return true;
  });
  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <main className="dashboard-content">
        <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', color: '#1a202c', marginBottom: '5px' }}>Polls</h2>
            <p style={{ color: '#718096', fontSize: '0.95rem' }}>Participate in community polls and make your voice heard.</p>
          </div>
          {user?.role === 'official' && (
            <button
                className="primary-btn"
                onClick={() => navigate('/create-poll')}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
            >
                <Plus size={18} /> Create Poll
            </button>
          )}
        </div>

        {/* Tabs and Filters Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '25px' }}>
            <div style={{ display: 'flex', gap: '25px' }}>
                {tabs.map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '0.95rem',
                            fontWeight: activeTab === tab ? '600' : '500',
                            color: activeTab === tab ? '#3182ce' : '#4a5568',
                            cursor: 'pointer',
                            paddingBottom: '15px',
                            marginBottom: '-16px',
                            borderBottom: activeTab === tab ? '2px solid #3182ce' : '2px solid transparent',
                            transition: 'all 0.2s'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="#718096" />
                <select 
                    style={{ border: 'none', background: 'transparent', color: '#4a5568', fontWeight: '500', fontSize: '0.9rem', outline: 'none', cursor: 'pointer' }}
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                >
                    <option value="">All Locations</option>
                    {INDIAN_STATES.map(state => (
                        <option key={state} value={state}>{state}</option>
                    ))}
                </select>
            </div>
        </div>

        {error && <div style={{ background: '#fff5f5', color: '#c53030', padding: '12px', borderRadius: '6px', marginBottom: '20px', border: '1px solid #feb2b2' }}>{error}</div>}

        {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
                <Loader2 className="animate-spin" size={40} color="#3182ce" />
            </div>
        ) : filteredPolls.length === 0 && !error ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '20px' }}>
                <p style={{ color: '#4a5568', fontSize: '1rem', marginBottom: '10px' }}>No polls found with the current filters.</p>
                <button style={{ background: 'none', border: 'none', color: '#3182ce', fontWeight: '600', cursor: 'pointer' }}>Clear Filters</button>

                <div style={{ marginTop: '40px', borderTop: '1px solid #e2e8f0', paddingTop: '40px' }}>
                    <h3 style={{ fontSize: '1.2rem', color: '#2d3748', marginBottom: '10px' }}>Have a question for your community?</h3>
                    <p style={{ color: '#718096', marginBottom: '20px', maxWidth: '400px', margin: '0 auto 20px' }}>Create a poll to gather input and understand public sentiment on local issues.</p>
                    <button 
                        className="primary-btn" 
                        onClick={() => navigate('/create-poll')}
                        style={{ padding: '10px 25px' }}
                    >
                        Create a Poll
                    </button>
                </div>
            </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {filteredPolls.map((poll) => {
              const totalVotes = poll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0);
              
              return (
                <div
                    className="card petition-card"
                    key={poll.id}
                    onClick={() => navigate(`/polls/${poll.id}`)}
                    style={{
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        padding: '24px',
                        borderRadius: '12px',
                        background: '#fff',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                        border: '1px solid #e2e8f0',
                        marginBottom: '12px',
                        textAlign: 'left',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold', background: '#ebf8ff', color: '#2b6cb0' }}>Active</span>
                        <span style={{ fontSize: '0.85rem', color: '#718096' }}>{new Date(poll.createdAt).toLocaleDateString()}</span>
                    </div>

                    <h3 style={{
                        margin: '0 0 15px 0',
                        fontSize: '1.15rem',
                        color: '#2d3748',
                        lineHeight: '1.4',
                        fontWeight: '600'
                    }}>
                        {poll.title}
                    </h3>
                    
                    <p style={{ color: '#718096', fontSize: '0.9rem', marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {poll.description || "No description provided for this poll."}
                    </p>

                    <div style={{ display: 'flex', gap: '15px', color: '#718096', fontSize: '0.85rem', marginBottom: '20px', marginTop: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <MapPin size={14} />
                            <span>{poll.targetLocation}</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #edf2f7', paddingTop: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4a5568', fontWeight: '600', fontSize: '0.9rem' }}>
                            <Users size={16} />
                            <span>{totalVotes} Votes</span>
                        </div>
                        <span style={{ color: '#3182ce', fontSize: '0.9rem', fontWeight: '600' }}>{user?.role === 'citizen' ? 'Vote Now →' : 'View Results →'}</span>
                    </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default PollList;
