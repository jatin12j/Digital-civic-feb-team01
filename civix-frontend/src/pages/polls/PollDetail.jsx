import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getPollById, vote, hasVoted } from '../../services/api';
import { Loader2, MapPin, Users, Calendar, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import PollResults from '../../components/polls/PollResults';
import Sidebar from '../../components/Sidebar';
import { INDIAN_STATES } from '../../constants/locations';
import '../../styles/dashboard.css';

const PollDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState(null);
  const [userHasVoted, setUserHasVoted] = useState(false);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setLoading(true);
        const data = await getPollById(id);
        setPoll(data);
        setUserHasVoted(hasVoted(id, user?._id || user?.id));
      } catch (err) {
        setError('Poll not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
        fetchPoll();
    }
  }, [id, user]);

  const handleVote = async () => {
    if (!selectedOption) {
      setError('Please select an option to vote.');
      return;
    }

    try {
      setVoting(true);
      setError(null);
      const updatedPoll = await vote(id, selectedOption, user?._id || user?.id);
      setPoll(updatedPoll);
      setUserHasVoted(true);
      toast.success('Your vote has been recorded!');
    } catch (err) {
      setError(err.message || 'Failed to submit vote.');
      toast.error('Failed to vote');
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Loader2 className="animate-spin" size={40} color="#3182ce" />
        </div>
    );
  }

  if (error && !poll) {
    return (
        <div className="dashboard-wrapper">
            <Sidebar />
            <main className="dashboard-content">
                <button onClick={() => navigate('/polls')} className="secondary-btn" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ArrowLeft size={18} /> Back to Polls
                </button>
                <div className="empty-state">{error || 'Poll not found.'}</div>
            </main>
        </div>
    );
  }

  const totalVotes = poll ? poll.options.reduce((sum, opt) => sum + opt.votes, 0) : 0;

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <main className="dashboard-content" style={{ maxWidth: '1200px', margin: '0', width: '100%' }}>
        <button 
            onClick={() => navigate('/polls')} 
            style={{ background: 'none', border: 'none', color: '#4a5568', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginBottom: '18px', fontWeight: '600' }}
        >
            <ArrowLeft size={18} /> Back to Polls
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 2fr)', gap: '30px' }}>
            <div className="card" style={{ padding: '25px 25px', borderRadius: '12px', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', textAlign: 'left', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#1a202c', lineHeight: '1.3' }}>{poll.title}</h1>
                    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 14px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 'bold', background: '#ebf8ff', color: '#2b6cb0' }}>Active</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '25px', marginBottom: '25px', padding: '12px 20px', background: '#f8fafc', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#4a5568' }}>
                        <MapPin size={18} />
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#718096' }}>Location:</span>
                            <span style={{ fontWeight: '600', fontSize: '1rem' }}>{poll.targetLocation}</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#4a5568' }}>
                        <Users size={18} />
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#718096' }}>Votes:</span>
                            <span style={{ fontWeight: '700', fontSize: '1.1rem', color: '#2d3748' }}>{totalVotes}</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#4a5568' }}>
                        <Calendar size={18} />
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#718096' }}>Created:</span>
                            <span style={{ fontWeight: '600', fontSize: '1rem' }}>{new Date(poll.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ fontSize: '1.25rem', color: '#2d3748', marginBottom: '15px', borderBottom: '2px solid #edf2f7', paddingBottom: '10px' }}>Description</h3>
                    <p style={{ color: '#4a5568', lineHeight: '1.8', whiteSpace: 'pre-wrap', fontSize: '1.05rem' }}>{poll.description || "No description provided for this poll."}</p>
                </div>

                {error && <div style={{ background: '#fff5f5', color: '#c53030', padding: '12px', borderRadius: '6px', marginBottom: '20px', border: '1px solid #feb2b2' }}>{error}</div>}

                <div style={{ borderTop: '1px solid #edf2f7', paddingTop: '25px' }}>
                    <h3 style={{ fontSize: '1.15rem', color: '#2d3748', marginBottom: '15px' }}>Your Vote</h3>
                    
                    {userHasVoted ? (
                        <div style={{ background: '#f0fff4', border: '1px solid #c6f6d5', borderRadius: '8px', padding: '24px', textAlign: 'center' }}>
                            <CheckCircle2 size={40} color="#48bb78" style={{ margin: '0 auto 12px' }} />
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#276749', margin: '0 0 4px 0' }}>You have already voted!</h3>
                            <p style={{ color: '#2f855a', margin: 0 }}>Thank you for participating in this poll.</p>
                        </div>
                    ) : user?.role === 'official' ? (
                        <div style={{ background: '#edf2f7', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '24px', textAlign: 'center' }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#4a5568', margin: '0 0 4px 0' }}>Officials cannot vote</h3>
                            <p style={{ color: '#718096', margin: 0 }}>You are viewing this poll as an official to monitor the results.</p>
                        </div>
                    ) : (
                        <div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                                {poll.options.map((option) => (
                                    <label 
                                        key={option.id}
                                        style={{
                                            display: 'flex', alignItems: 'center', padding: '16px 20px', border: '1px solid', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s',
                                            borderColor: selectedOption === option.id ? '#3182ce' : '#e2e8f0',
                                            backgroundColor: selectedOption === option.id ? '#ebf8ff' : '#fff',
                                            boxShadow: selectedOption === option.id ? '0 0 0 1px #3182ce' : 'none'
                                        }}
                                    >
                                        <input 
                                            type="radio" 
                                            name="poll_option" 
                                            value={option.id}
                                            checked={selectedOption === option.id}
                                            onChange={() => setSelectedOption(option.id)}
                                            style={{ height: '20px', width: '20px', accentColor: '#3182ce', margin: 0, cursor: 'pointer' }}
                                        />
                                        <span style={{ marginLeft: '15px', display: 'block', fontSize: '1.05rem', fontWeight: '500', color: '#2d3748' }}>
                                            {option.text}
                                        </span>
                                    </label>
                                ))}
                            </div>
                            
                            <button
                                onClick={handleVote}
                                disabled={voting || !selectedOption}
                                className="primary-btn"
                                style={{
                                    width: '100%',
                                    padding: '12px 30px',
                                    fontSize: '1rem',
                                    opacity: (!selectedOption || voting) ? 0.6 : 1,
                                    cursor: (!selectedOption || voting) ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                {voting ? (
                                    <><Loader2 className="animate-spin" size={18} /> Submitting...</>
                                ) : (
                                    'Submit Vote'
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Results Sidebar */}
            <div>
                {(userHasVoted || user?.role === 'official') ? (
                    <PollResults options={poll.options} totalVotes={totalVotes} />
                ) : (
                    <div className="card" style={{ height: '100%', padding: '40px 25px', borderRadius: '12px', background: '#f8fafc', border: '2px dashed #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                        <div style={{ width: '64px', height: '64px', background: '#edf2f7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <CheckCircle2 size={32} color="#a0aec0" />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#4a5568', margin: '0 0 10px 0' }}>Results Hidden</h3>
                        <p style={{ color: '#718096', fontSize: '0.95rem', margin: 0, maxWidth: '250px' }}>
                            Cast your vote first to view the current standing of this poll.
                        </p>
                    </div>
                )}
            </div>
        </div>
      </main>
    </div>
  );
};

export default PollDetail;
