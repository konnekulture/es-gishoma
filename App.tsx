
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
  BookOpen,
  FileText,
  UserPlus,
  GraduationCap
} from 'lucide-react';
import Home from './pages/Home';
import About from './pages/About';
import Announcements from './pages/Announcements';
import Gallery from './pages/Gallery';
import StaffPage from './pages/StaffPage';
import Contact from './pages/Contact';
import Curriculum from './pages/Curriculum';
import Examinations from './pages/Examinations';
import Alumni from './pages/Alumni';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageAnnouncements from './pages/admin/ManageAnnouncements';
import ManageStaff from './pages/admin/ManageStaff';
import ManageGallery from './pages/admin/ManageGallery';
import ManageMessages from './pages/admin/ManageMessages';
import ManageBooks from './pages/admin/ManageBooks';
import ManagePastPapers from './pages/admin/ManagePastPapers';
import ManageAlumni from './pages/admin/ManageAlumni';
import { MockDB } from './services/mockDb';

// --- Shared Components ---

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAcademicsOpen, setIsAcademicsOpen] = useState(false);
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  const navLinks = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'About', path: '/about', icon: Info },
    { name: 'News', path: '/news', icon: Megaphone },
    { name: 'Gallery', path: '/gallery', icon: GalleryIcon },
    { name: 'Staff', path: '/staff', icon: Users },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  const academicLinks = [
    { name: 'Curriculum', path: '/curriculum' },
    { name: 'Examination', path: '/examinations' },
    { name: 'Alumni', path: '/alumni' },
  ];

  if (isAdminPath) return null;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 w-full transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 sm:h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg sm:text-xl group-hover:bg-indigo-700 transition-colors shrink-0">
                EG
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold text-slate-900 brand-font leading-none">ES GISHOMA</span>
                <span className="text-[8px] sm:text-[10px] uppercase tracking-widest text-indigo-600 font-bold">School of Excellence</span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            <Link 
              to="/"
              className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                location.pathname === '/' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              <HomeIcon className="w-4 h-4" />
              <span>Home</span>
            </Link>

            <Link 
              to="/about"
              className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                location.pathname === '/about' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>About</span>
            </Link>

            {/* Academics Dropdown */}
            <div 
              className="relative group py-4"
              onMouseEnter={() => setIsAcademicsOpen(true)}
              onMouseLeave={() => setIsAcademicsOpen(false)}
            >
              <button 
                className={`flex items-center space-x-1 text-sm font-medium transition-colors outline-none ${
                  academicLinks.some(l => l.path === location.pathname) ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Academics</span>
                <ChevronRight className={`w-3 h-3 transition-transform duration-200 ${isAcademicsOpen ? 'rotate-90' : ''}`} />
              </button>
              
              <div className={`absolute left-0 top-full w-48 bg-white border border-slate-100 shadow-xl rounded-2xl py-2 transition-all duration-200 origin-top-left ${isAcademicsOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
                {academicLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-4 py-2.5 text-sm font-medium hover:bg-indigo-50 hover:text-indigo-600 transition-colors ${
                      location.pathname === link.path ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {navLinks.slice(2).map((link) => (
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
            
            <Link to="/login" className="px-4 py-2 lg:px-5 lg:py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-full hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
              Admin Portal
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-slate-600 hover:text-indigo-600 p-2 transition-colors focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-white border-b border-slate-200 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100 py-4' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 space-y-1">
          <Link 
            to="/"
            onClick={() => setIsOpen(false)}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              location.pathname === '/' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            <HomeIcon className="w-5 h-5" />
            <span className="font-medium">Home</span>
          </Link>

          <Link 
            to="/about"
            onClick={() => setIsOpen(false)}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              location.pathname === '/about' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            <Info className="w-5 h-5" />
            <span className="font-medium">About</span>
          </Link>

          {/* Mobile Academics Section */}
          <div className="py-2">
            <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Academics</div>
            {academicLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ml-2 ${
                  location.pathname === link.path ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span className="font-medium">{link.name}</span>
              </Link>
            ))}
          </div>

          {navLinks.slice(2).map((link) => (
            <Link 
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                location.pathname === link.path ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <link.icon className="w-5 h-5" />
              <span className="font-medium">{link.name}</span>
            </Link>
          ))}
          
          <Link 
            to="/login"
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-3 p-3 rounded-lg bg-indigo-600 text-white font-bold mt-4 shadow-lg shadow-indigo-200"
          >
            <Settings className="w-5 h-5" />
            <span>Admin Portal</span>
          </Link>
        </div>
      </div>
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
    <footer className="bg-slate-900 text-white pt-12 sm:pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">EG</div>
              <span className="text-xl font-bold brand-font">ES GISHOMA</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Nurturing minds, building character, and empowering future leaders through a holistic educational approach since 1985.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 sm:mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3 text-slate-400 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">History & Mission</Link></li>
              <li><Link to="/news" className="hover:text-white transition-colors">Announcements</Link></li>
              <li><Link to="/staff" className="hover:text-white transition-colors">Our Teachers</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">Photo Gallery</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 sm:mb-6 text-lg">Academics</h4>
            <ul className="space-y-2 sm:space-y-3 text-slate-400 text-sm">
              <li><Link to="/curriculum" className="hover:text-white transition-colors">Curriculum</Link></li>
              <li><Link to="/examinations" className="hover:text-white transition-colors">Examination</Link></li>
              <li><Link to="/alumni" className="hover:text-white transition-colors">Alumni</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 sm:mb-6 text-lg">Contact Us</h4>
            <ul className="space-y-2 sm:space-y-3 text-slate-400 text-sm">
              <li className="flex items-start space-x-3 text-slate-400">
                <Mail className="w-4 h-4 mt-1 text-indigo-500 shrink-0" />
                <span className="break-all">info@esgishoma.edu</span>
              </li>
              <li className="flex items-start space-x-3 text-slate-400">
                <HomeIcon className="w-4 h-4 mt-1 text-indigo-500 shrink-0" />
                <span className="leading-tight">123 Academic Way, Education District, NY 10001</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-500 text-xs gap-4">
          <div className="text-center md:text-left space-y-1">
            <p>© 2024 ES GISHOMA. All rights reserved.</p>
            <p className="text-indigo-500/80 font-medium">Developed by Chretien Delphin</p>
          </div>
          <div className="flex space-x-6">
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
    { name: 'Past Papers', path: '/admin/past-papers', icon: FileText },
    { name: 'Alumni Stories', path: '/admin/alumni', icon: GraduationCap },
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
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={toggle}
        ></div>
      )}
      
      <div className={`w-64 bg-slate-900 min-h-screen text-white flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 sm:p-8 border-b border-slate-800 flex items-center justify-between shrink-0 h-16 sm:h-20">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center font-bold text-white shrink-0">EG</div>
            <span className="font-bold tracking-tight text-white brand-font">ADMIN</span>
          </Link>
          <button onClick={toggle} className="lg:hidden text-slate-400 hover:text-white p-1">
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1.5 mt-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path}
              onClick={() => { if (window.innerWidth < 1024) toggle(); }}
              className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
                location.pathname === item.path ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="font-medium whitespace-nowrap text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800 shrink-0">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full p-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="font-medium text-sm">Sign Out</span>
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
            <Route path="/examinations" element={<Examinations />} />
            <Route path="/alumni" element={<Alumni />} />
            <Route path="/news" element={<Announcements />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/staff" element={<StaffPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            
            {/* Admin Routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute>
                <div className="flex bg-slate-50 min-h-screen relative w-full overflow-hidden">
                  <AdminSidebar 
                    isOpen={isAdminSidebarOpen} 
                    toggle={() => setIsAdminSidebarOpen(!isAdminSidebarOpen)} 
                  />
                  <div className="flex-1 lg:ml-64 flex flex-col w-full min-w-0 overflow-hidden">
                    {/* Admin Mobile Header */}
                    <header className="lg:hidden bg-white border-b border-slate-200 h-16 flex items-center px-4 shrink-0 w-full sticky top-0 z-40">
                      <button 
                        onClick={() => setIsAdminSidebarOpen(true)}
                        className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                        aria-label="Open Sidebar"
                      >
                        <Menu className="w-6 h-6" />
                      </button>
                      <span className="ml-4 font-bold text-slate-900">Admin Portal</span>
                    </header>
                    <div className="p-4 sm:p-6 lg:p-10 flex-1 overflow-x-hidden overflow-y-auto w-full max-w-full">
                      <Routes>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="messages" element={<ManageMessages />} />
                        <Route path="announcements" element={<ManageAnnouncements />} />
                        <Route path="staff" element={<ManageStaff />} />
                        <Route path="books" element={<ManageBooks />} />
                        <Route path="past-papers" element={<ManagePastPapers />} />
                        <Route path="alumni" element={<ManageAlumni />} />
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
