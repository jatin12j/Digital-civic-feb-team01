import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPoll } from '../../services/api';
import { Loader2, ArrowLeft, Send, PlusCircle, Trash2, Info } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import { INDIAN_STATES } from '../../constants/locations';
import '../../styles/dashboard.css';

const CreatePoll = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetLocation, setTargetLocation] = useState(user?.location || 'New York');
  const [closesOn, setClosesOn] = useState('');
  const [options, setOptions] = useState([{ text: '' }, { text: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddOption = () => {
    if (options.length < 10) {
      setOptions([...options, { text: '' }]);
    }
  };

  const handleRemoveOption = (index) => {
    if (options.length <= 2) return;
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !description.trim() || !closesOn) {
      setError('Please fill in all required fields.');
      return;
    }
    
    const validOptions = options.filter(opt => opt.text.trim() !== '');
    if (validOptions.length < 2) {
      setError('At least two valid options are required.');
      return;
    }

    try {
      setLoading(true);
      await createPoll({
        title,
        description,
        closesOn,
        targetLocation,
        createdBy: user?._id || user?.id,
        options: validOptions
      });
      toast.success('Poll created successfully!');
      navigate('/polls');
    } catch (err) {
        setError(err.message || 'Failed to create poll. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'official') {
    return (
        <div className="dashboard-wrapper">
            <main className="dashboard-content">
                <div className="empty-state">Only officials can create polls.</div>
            </main>
        </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <main className="dashboard-content" style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        <button 
            onClick={() => navigate('/polls')} 
            style={{ background: 'none', border: 'none', color: '#4a5568', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginBottom: '12px', fontWeight: '600' }}
        >
            <ArrowLeft size={18} /> Back to Polls
        </button>

        <div className="card" style={{ padding: '25px', borderRadius: '16px' }}>
            <h2 style={{ marginBottom: '5px', color: '#1a202c', textAlign: 'left' }}>Create a New Poll</h2>
            <p style={{ color: '#718096', marginBottom: '25px', textAlign: 'left', fontSize: '0.9rem' }}>Create a poll to gather community feedback on local issues.</p>
            
            {error && <div style={{ background: '#fff5f5', color: '#c53030', padding: '12px', borderRadius: '6px', marginBottom: '20px', border: '1px solid #feb2b2' }}>{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px', color: '#4a5568', textAlign: 'left' }}>Poll Question</label>
                    <p style={{ fontSize: '0.8rem', color: '#a0aec0', marginBottom: '8px', textAlign: 'left' }}>Keep your question clear and specific.</p>
                    <input 
                        type="text" 
                        required
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        placeholder="What do you want to ask the community?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px', color: '#4a5568', textAlign: 'left' }}>Description</label>
                    <p style={{ fontSize: '0.8rem', color: '#a0aec0', marginBottom: '8px', textAlign: 'left' }}>Give community members enough information to make an informed choice.</p>
                    <textarea 
                        required
                        rows="4"
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', resize: 'vertical' }}
                        placeholder="Provide more context about the poll..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px', color: '#4a5568', textAlign: 'left' }}>Poll Options</label>
                            <p style={{ fontSize: '0.8rem', color: '#a0aec0', textAlign: 'left' }}>Add at least 2 options, up to a maximum of 10.</p>
                        </div>
                        {options.length < 10 && (
                            <button 
                                type="button" 
                                onClick={handleAddOption}
                                style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#3182ce', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}
                            >
                                <PlusCircle size={16} /> Add Option
                            </button>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {options.map((option, index) => (
                            <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <div style={{ flex: 1 }}>
                                    <input 
                                        type="text" 
                                        required={index < 2}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                        placeholder={`Option ${index + 1}`}
                                        value={option.text}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                    />
                                </div>
                                {options.length > 2 && (
                                    <button 
                                        type="button" 
                                        onClick={() => handleRemoveOption(index)}
                                        style={{ padding: '8px', color: '#e53e3e', background: 'none', border: 'none', cursor: 'pointer' }}
                                        title="Remove option"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                    <div>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px', color: '#4a5568', textAlign: 'left' }}>Target Location</label>
                        <p style={{ fontSize: '0.8rem', color: '#a0aec0', marginBottom: '8px', textAlign: 'left' }}>The area this poll is relevant to.</p>
                        <select 
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: 'white' }}
                            value={targetLocation}
                            onChange={(e) => setTargetLocation(e.target.value)}
                        >
                            <option value="All">All India</option>
                            {INDIAN_STATES.map(state => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px', color: '#4a5568', textAlign: 'left' }}>Closes On</label>
                        <p style={{ fontSize: '0.8rem', color: '#a0aec0', marginBottom: '8px', textAlign: 'left' }}>Choose when this poll will close (max 30 days).</p>
                        <input
                            type="date"
                            required
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            value={closesOn}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setClosesOn(e.target.value)}
                        />
                    </div>
                </div>

                <div style={{ background: '#fffff0', border: '1px solid #fefcbf', borderRadius: '8px', padding: '15px', marginBottom: '25px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <Info size={20} color="#d69e2e" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                        <h4 style={{ color: '#b7791f', margin: '0 0 5px 0', fontSize: '0.95rem' }}>Important Information</h4>
                        <p style={{ color: '#975a16', margin: 0, fontSize: '0.85rem' }}>Polls should be designed to gather genuine community feedback on issues that affect your area. Polls that are misleading or designed to push a specific agenda may be removed.</p>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                    <button
                        type="button"
                        onClick={() => navigate('/polls')}
                        className="secondary-btn"
                        style={{ padding: '12px 25px' }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="primary-btn"
                        style={{ padding: '12px 30px', display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                        {loading ? 'Submitting...' : 'Create Poll'}
                    </button>
                </div>
            </form>
        </div>
      </main>
    </div>
  );
};

export default CreatePoll;
