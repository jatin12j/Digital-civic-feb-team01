import React from "react";
import "../styles/dashboard.css";
import { useAuth } from "../context/AuthContext";
import { LogOut } from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-wrapper">

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Civix</h2>
        </div>

        <ul className="sidebar-menu">
          <li className="active">Dashboard</li>
          <li>Petitions</li>
          <li>Polls</li>
          <li>Officials</li>
          <li>Reports</li>
          <li>Settings</li>
          <li onClick={logout} className="logout-item" style={{ cursor: 'pointer', color: '#ff4d4d' }}>
            <LogOut size={18} style={{ marginRight: '10px' }} />
            Logout
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">

        {/* Header */}
        <div className="dashboard-header">
          <h2>Welcome back, {user?.name?.split(' ')[0] || 'User'} 👋
            <span className="role-badge" style={{ fontSize: '0.5em', background: '#e2e8f0', padding: '4px 8px', borderRadius: '12px', marginLeft: '10px', verticalAlign: 'middle' }}>
              {user?.role?.toUpperCase()}
            </span>
          </h2>
          {user?.role === 'citizen' ? (
            <button className="primary-btn" disabled title="Coming in Milestone 2">Create Petition (M2)</button>
          ) : (
            <button className="primary-btn" style={{ background: '#4a5568' }}>Review Local Petitions</button>
          )}
        </div>

        {/* Stats Cards - Role Based */}
        <div className="stats-grid">
          {user?.role === 'citizen' ? (
            <>
              <div className="card">
                <h3>0</h3>
                <p>My Petitions</p>
              </div>
              <div className="card">
                <h3>0</h3>
                <p>Signed Petitions</p>
              </div>
              <div className="card">
                <h3>0</h3>
                <p>Polls Answered</p>
              </div>
            </>
          ) : (
            <>
              <div className="card">
                <h3>0</h3>
                <p>Pending Petitions</p>
              </div>
              <div className="card">
                <h3>0</h3>
                <p>Official Responses</p>
              </div>
              <div className="card">
                <h3>0</h3>
                <p>Local User Base</p>
              </div>
            </>
          )}
        </div>

        {/* Activity Section */}
        <div className="activity-section">
          <h3>{user?.role === 'citizen' ? 'Active Petitions Near You' : 'Unresolved Issues in Your Jurisdiction'}</h3>
          <div className="empty-state">
            <p>No {user?.role === 'citizen' ? 'petitions' : 'issues'} found for {user?.location || 'your area'}.</p>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;
