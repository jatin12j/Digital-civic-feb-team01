import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';
import { Landmark, LogOut, PlusCircle, BarChart3, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 text-blue-600">
            <Landmark size={28} className="text-blue-600" />
            <span className="font-bold text-2xl tracking-tight">Civix</span>
          </NavLink>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink 
              to="/polls" 
              className={({isActive}) => `flex items-center gap-2 font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
            >
              <BarChart3 size={18} />
              Polls Dashboard
            </NavLink>
            
            {user.role === 'official' && (
              <NavLink 
                to="/create-poll" 
                className={({isActive}) => `flex items-center gap-2 font-medium transition-colors ${isActive ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-600'}`}
              >
                <PlusCircle size={18} />
                Create Poll
              </NavLink>
            )}
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-sm font-medium text-slate-700">
              <User size={16} />
              <span>{user.username} <span className="text-slate-400 font-normal">({user.role})</span></span>
            </div>
            <button 
              onClick={handleLogout}
              className="text-slate-500 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
