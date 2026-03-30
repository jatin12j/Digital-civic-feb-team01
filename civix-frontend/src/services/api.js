// src/services/api.js
// Mock API Service using localStorage

const POLLS_KEY = 'civix_polls';

// Initial dummy data
const initialPolls = [
  {
    id: '1',
    title: 'Should we rebuild the Central Park fountain?',
    options: [
      { id: 'o1', text: 'Yes', votes: 15 },
      { id: 'o2', text: 'No', votes: 8 },
      { id: 'o3', text: 'Delay for next year', votes: 4 }
    ],
    targetLocation: 'Andhra Pradesh',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    closesOn: new Date(Date.now() + 864000000).toISOString(),
    createdBy: 'official1'
  },
  {
    id: '2',
    title: 'Approve the new City Tech Hub budget?',
    options: [
      { id: 'o1', text: 'Approve', votes: 42 },
      { id: 'o2', text: 'Reject', votes: 12 }
    ],
    targetLocation: 'Maharashtra',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    closesOn: new Date(Date.now() - 86400000).toISOString(), // This one is closed
    createdBy: 'official2'
  }
];

// Initialize localStorage if empty or missing closesOn
let existingObj = JSON.parse(localStorage.getItem(POLLS_KEY));
if (!existingObj || !existingObj[0]?.closesOn) {
  localStorage.setItem(POLLS_KEY, JSON.stringify(initialPolls));
}

// Helper to simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const getPolls = async (location = null) => {
  await delay(600);
  const polls = JSON.parse(localStorage.getItem(POLLS_KEY)) || [];
  if (location && location !== 'All') {
    return polls.filter(p => p.targetLocation === location);
  }
  return polls;
};

export const getPollById = async (id) => {
  await delay(400);
  const polls = JSON.parse(localStorage.getItem(POLLS_KEY)) || [];
  const poll = polls.find(p => p.id === id);
  if (!poll) throw new Error('Poll not found');
  return poll;
};

export const createPoll = async (pollData) => {
  await delay(800);
  const polls = JSON.parse(localStorage.getItem(POLLS_KEY)) || [];
  const newPoll = {
    ...pollData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    options: pollData.options.map(opt => ({
      ...opt,
      id: Math.random().toString(36).substr(2, 9),
      votes: 0
    }))
  };
  polls.unshift(newPoll);
  localStorage.setItem(POLLS_KEY, JSON.stringify(polls));
  return newPoll;
};

export const vote = async (pollId, optionId, userId) => {
  await delay(500);
  
  // Prevent double voting (using a separate localStorage key for simplicity)
  const VOTES_KEY = `civix_votes_${userId}`;
  const userVotes = JSON.parse(localStorage.getItem(VOTES_KEY)) || {};
  
  if (userVotes[pollId]) {
    throw new Error('You have already voted on this poll.');
  }

  const polls = JSON.parse(localStorage.getItem(POLLS_KEY)) || [];
  const pollIndex = polls.findIndex(p => p.id === pollId);
  
  if (pollIndex === -1) throw new Error('Poll not found');

  const optionIndex = polls[pollIndex].options.findIndex(opt => opt.id === optionId);
  if (optionIndex === -1) throw new Error('Option not found');

  polls[pollIndex].options[optionIndex].votes += 1;
  localStorage.setItem(POLLS_KEY, JSON.stringify(polls));

  // Record vote
  userVotes[pollId] = optionId;
  localStorage.setItem(VOTES_KEY, JSON.stringify(userVotes));

  return polls[pollIndex];
};

export const hasVoted = (pollId, userId) => {
  if (!userId) return false;
  const VOTES_KEY = `civix_votes_${userId}`;
  const userVotes = JSON.parse(localStorage.getItem(VOTES_KEY)) || {};
  return !!userVotes[pollId];
};
