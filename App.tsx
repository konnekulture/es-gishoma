
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { 
  Home as HomeIcon, 
  Info, 
  Megaphone, 
  Image as GalleryIcon, 
  Users, 
  Mail, 
  LayoutDashboard, 
  LogOut,
  Menu,
  X,
  Settings,
  ChevronRight,
  Inbox,
  BookOpen
} from 'lucide-react';
import Home from './pages/Home';
import About from './pages/About';
import Announcements from './pages/Announcements';
import Gallery from './pages/Gallery';
import StaffPage from './pages/StaffPage';
import Contact from './pages/Contact';
import Curriculum from './pages/Curriculum';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageAnnouncements from './pages/admin/ManageAnnouncements';
import ManageStaff from './pages/admin/ManageStaff';
import ManageGallery from './pages/admin/ManageGallery';
import ManageMessages from './pages/admin/ManageMessages';
import ManageBooks from './pages/admin/ManageBooks';
import { MockDB } from './services/mockDb';

// --- Shared Components ---

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  const navLinks = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Curriculum', path: '/curriculum', icon: BookOpen },
    { name: 'News', path: '/news', icon: Megaphone },
    { name: 'Gallery', path: '/gallery', icon: GalleryIcon },
    { name: 'Staff', path: '/staff', icon: Users },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  if (isAdminPath) return null;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:bg-indigo-700 transition-colors shrink-0">
                EG
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-slate-900 brand-font leading-none">ES GISHOMA</span>
                <span className="text-[10px] uppercase tracking-widest text-indigo-600 font-bold">School of Excellence</span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                  location.pathname === link.path ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'
                }`}
              >
                <link.icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            ))}
            <Link to="/login" className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-full hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
              Admin Portal
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 hover:text-indigo-600 p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 py-4 px-4 space-y-2 animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"
            >
              <link.icon className="w-5 h-5" />
              <span className="font-medium">{link.name}</span>
            </Link>
          ))}
          <Link 
            to="/login"
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-3 p-3 rounded-lg bg-indigo-50 text-indigo-600 font-bold"
          >
            <Settings className="w-5 h-5" />
            <span>Admin Login</span>
          </Link>
        </div>
      )}
    </nav>
  );
};

const TrafficTracker: React.FC = () => {
  const location = useLocation();
  useEffect(() => {
    MockDB.trackPageView(location.pathname);
  }, [location.pathname]);
  return null;
};

const Footer: React.FC = () => {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">EG</div>
              <span className="text-xl font-bold brand-font">ES GISHOMA</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Nurturing minds, building character, and empowering future leaders through a holistic educational approach since 1985.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">History & Mission</Link></li>
              <li><Link to="/news" className="hover:text-white transition-colors">Announcements</Link></li>
              <li><Link to="/staff" className="hover:text-white transition-colors">Our Teachers</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">Photo Gallery</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-lg">Academics</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li><Link to="/curriculum" className="hover:text-white transition-colors">Curriculum</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Examination</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Admissions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Alumni</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-lg">Contact Us</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li className="flex items-start space-x-3 text-slate-400">
                <Mail className="w-4 h-4 mt-1 text-indigo-500" />
                <span>info@esgishoma.edu</span>
              </li>
              <li className="flex items-start space-x-3 text-slate-400">
                <HomeIcon className="w-4 h-4 mt-1 text-indigo-500" />
                <span className="leading-tight">123 Academic Way, Education District, NY 10001</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-500 text-xs">
          <div className="text-center md:text-left space-y-1">
            <p>© 2024 ES GISHOMA. All rights reserved.</p>
            <p className="text-indigo-500/80 font-medium">Developed by Chretien Delphin</p>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const AdminSidebar: React.FC<{ isOpen: boolean; toggle: () => void }> = ({ isOpen, toggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Inbox', path: '/admin/messages', icon: Inbox },
    { name: 'Announcements', path: '/admin/announcements', icon: Megaphone },
    { name: 'Staff Management', path: '/admin/staff', icon: Users },
    { name: 'Curriculum Books', path: '/admin/books', icon: BookOpen },
    { name: 'Gallery Management', path: '/admin/gallery', icon: GalleryIcon },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggle}
        ></div>
      )}
      
      <div className={`w-64 bg-slate-900 min-h-screen text-white flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 border-b border-slate-800 flex items-center justify-between shrink-0">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center font-bold text-white shrink-0">EG</div>
            <span className="font-bold tracking-tight text-white brand-font">ADMIN</span>
          </Link>
          <button onClick={toggle} className="lg:hidden text-slate-400 hover:text-white p-1">
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto">
          {menuItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path}
              onClick={() => { if (window.innerWidth < 1024) toggle(); }}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                location.pathname === item.path ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="font-medium whitespace-nowrap">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800 shrink-0">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full p-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  return isAdmin ? <>{children}</> : <Navigate to="/login" />;
};

export default function App() {
  const [isAdminSidebarOpen, setIsAdminSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <TrafficTracker />
        <Navbar />
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/news" element={<Announcements />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/staff" element={<StaffPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            
            {/* Admin Routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute>
                <div className="flex bg-slate-50 min-h-screen relative w-full">
                  <AdminSidebar 
                    isOpen={isAdminSidebarOpen} 
                    toggle={() => setIsAdminSidebarOpen(!isAdminSidebarOpen)} 
                  />
                  <div className="flex-1 lg:ml-64 flex flex-col w-full overflow-hidden">
                    {/* Admin Mobile Header */}
                    <header className="lg:hidden bg-white border-b border-slate-200 h-16 flex items-center px-4 shrink-0 w-full sticky top-0 z-40">
                      <button 
                        onClick={() => setIsAdminSidebarOpen(true)}
                        className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
                      >
                        <Menu className="w-6 h-6" />
                      </button>
                      <span className="ml-4 font-bold text-slate-900">Admin Portal</span>
                    </header>
                    <div className="p-4 sm:p-6 lg:p-10 flex-1 overflow-x-hidden w-full">
                      <Routes>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="messages" element={<ManageMessages />} />
                        <Route path="announcements" element={<ManageAnnouncements />} />
                        <Route path="staff" element={<ManageStaff />} />
                        <Route path="books" element={<ManageBooks />} />
                        <Route path="gallery" element={<ManageGallery />} />
                        <Route path="*" element={<Navigate to="dashboard" />} />
                      </Routes>
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
