import React, { useState, useEffect } from 'react';
import GroveDialog, { Field, Notice, Rating } from './GroveDialog.jsx';
import {
  getCurricula,
  getCurriculumReviews,
  addCurriculum,
  addCurriculumReview,
  getFieldTrips,
  addFieldTrip,
  getBusinessAds,
  addBusinessAd,
  getResources,
  addResource,
  getPosts,
  addPost,
  getUserByEmail,
  createUser,
  getSubUsers,
  createSubUser,
  getCoParents,
  linkCoParent,
  getPendingResources,
  approveResource,
  rejectResource,
  getCommunityPosts,
  createCommunityPost,
  addCommunityReply,
  likeCommunityPost,
  flagCommunityPost,
  requestCommunityDiscussion,
  getDiscussionRequests,
  approveDiscussionRequest,
  deleteSubUser,
  deleteUserAccount,
  deleteFieldTrip,
  deleteCommunityPost,
  deleteBusinessAd,
  getAllUsers,
  updateUserRolePermissions,
  isSiteOwner,
  hashPassword
} from './supabaseClient';

// --- INLINE SVG ICONS (PREMIUM, ZERO-LATENCY) ---
const HomeIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
);
const DashboardIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
);
const CurriculaIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5.89 12.5L3 11l9-4.91L21 11l-2.89 1.5L12 16.09l-6.11-3.59zM12 18l-6.11-3.59-2.89 1.5L12 21l9-4.91-2.89-1.5L12 18z"/></svg>
);
const CommunityIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
);
const ResourcesIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>
);
const StarFilledIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
);
const StarEmptyIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.37L12 6.1l1.7 4.02 4.38.37-3.32 2.88 1 4.28L12 15.4z"/></svg>
);
const StarHalfIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4V6.1l1.71 4.02 4.38.37-3.32 2.88 1 4.28L12 15.4z"/>
  </svg>
);
const PinIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
);
const ExternalLinkIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
);
const BusinessIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>
);

// ThemeSwitcher component
function ThemeToggle() {
  const [theme, setTheme] = useState(() => localStorage.getItem('grove_theme') || 'system');

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('grove_theme', newTheme);
    
    let resolvedTheme = newTheme;
    if (newTheme === 'system') {
      resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', resolvedTheme);
  };

  useEffect(() => {
    if (theme === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (e) => {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      };
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, [theme]);

  return (
    <fieldset className="theme-toggle-group" style={{ border: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <legend style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Theme Mode</legend>
      <div style={{ display: 'flex', background: 'var(--color-bg)', padding: '2px', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
        {['light', 'dark', 'system'].map((t) => (
          <label
            key={t}
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: '0.75rem',
              padding: '6px 0',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: theme === t ? '700' : '500',
              background: theme === t ? 'var(--color-primary)' : 'transparent',
              color: theme === t ? 'white' : 'var(--color-text-muted)',
              textTransform: 'capitalize',
              transition: 'all 0.15s ease'
            }}
          >
            <input
              type="radio"
              name="theme-selection"
              value={t}
              checked={theme === t}
              onChange={() => updateTheme(t)}
              style={{ display: 'none' }}
            />
            {t}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('home');

  // Community Forum State
  const initialSamplePosts = [
    {
      id: 'post-1',
      author: 'Sarah Jenkins',
      role: 'PARENT',
      title: "What is your favorite 4th-grade math curriculum for visual learners?",
      category: 'curriculum-qa',
      categoryLabel: '📚 Curriculum Q&A',
      content: "My son struggles with plain textbook worksheets and benefits from visual manipulatives and short video lessons. We've looked into Beast Academy and Math-U-See. What have you found works best for visual 4th graders?",
      tags: ['#Math', '#4thGrade', '#VisualLearners', '#BeastAcademy'],
      likes: 12,
      replies: [
        { id: 'rep-1', author: 'Eric H', content: "Beast Academy is fantastic for visual problem-solving! The comic guide books keep kids engaged, and the online practice provides instant feedback.", created_at: '2 hours ago' },
        { id: 'rep-2', author: 'Allison H', content: "Seconding Beast Academy! We also used Math-U-See blocks for tactile math concepts.", created_at: '1 hour ago' }
      ],
      created_at: '2026-07-28T14:00:00Z'
    },
    {
      id: 'post-2',
      author: 'David Miller',
      role: 'PARENT',
      title: "North Atlanta Science Museum Group Field Trip — Discount Rates Available!",
      category: 'coops-trips',
      categoryLabel: '🌲 Co-ops & Field Trips',
      content: "We are organizing a group visit to the Science Museum for 15+ homeschool families on June 15th. Group admission is $8/student (normally $18). Let us know if your family would like to join!",
      tags: ['#FieldTrips', '#Science', '#Atlanta', '#CoOp'],
      likes: 18,
      replies: [
        { id: 'rep-3', author: 'Sarah Jenkins', content: "Count us in! I have two 4th graders.", created_at: '3 hours ago' }
      ],
      created_at: '2026-07-27T10:00:00Z'
    },
    {
      id: 'post-3',
      author: 'Allison H',
      role: 'PARENT',
      title: "High School College Prep: How do you format homeschool transcripts?",
      category: 'prep',
      categoryLabel: '🎓 High School & College Prep',
      content: "As my daughter enters 9th grade, I want to make sure our course descriptions and GPA tracking align with college admissions requirements. What tools or templates do you use?",
      tags: ['#HighSchool', '#CollegePrep', '#Transcripts', '#9thGrade'],
      likes: 9,
      replies: [],
      created_at: '2026-07-26T16:30:00Z'
    }
  ];

  const [posts, setPosts] = useState(initialSamplePosts);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(null);
  const [discussionRequests, setDiscussionRequests] = useState([]);
  const [requestForm, setRequestForm] = useState({ title: '', category: 'curriculum-qa', content: '', tags: '', email: '', reason: '' });
  const [communityCategory, setCommunityCategory] = useState('all');
  const [communitySearchTag, setCommunitySearchTag] = useState('');
  const [communitySearchKeyword, setCommunitySearchKeyword] = useState('');
  const [activePostDetail, setActivePostDetail] = useState(null);
  const [replyInput, setReplyInput] = useState('');
  const [newPostForm, setNewPostForm] = useState({ title: '', category: 'curriculum-qa', content: '', tags: '' });

  // Business Board State
  const [adSearchQuery, setAdSearchQuery] = useState('');
  const [selectedAdCategory, setSelectedAdCategory] = useState('All');
  const [adSelectedType, setAdSelectedType] = useState('All');

  // DB Data States
  const [curricula, setCurricula] = useState([]);
  const [fieldTrips, setFieldTrips] = useState([]);
  const [businessAds, setBusinessAds] = useState([]);
  const [resources, setResources] = useState([]);

  // Stats Counters
  const [stats, setStats] = useState({ curricula: 0, trips: 0, ads: 0, resources: 0 });

  // User Auth & Session States
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('grove_user') || 'null'));
  const [subUsers, setSubUsers] = useState([]);
  const [coParents, setCoParents] = useState([]);
  const [coParentEmailInput, setCoParentEmailInput] = useState('');
  const [coParentError, setCoParentError] = useState(null);
  const [coParentSuccess, setCoParentSuccess] = useState(null);
  const [pendingResources, setPendingResources] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '' });
  const [newSubUserForm, setNewSubUserForm] = useState({ email: '', password: '', name: '', role: 'Student' });
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [newResource, setNewResource] = useState({ name: '', subject: 'Math', cost: 'free', link: '', description: '', type: 'website' });
  const [showModQueue, setShowModQueue] = useState(false);

  // Modal States
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);
  const [showTripModal, setShowTripModal] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [allUsersList, setAllUsersList] = useState([]);
  const [roleUpdateMsg, setRoleUpdateMsg] = useState(null);
  const [formError, setFormError] = useState(null);
  const [subUserError, setSubUserError] = useState(null);
  const [subUserSuccess, setSubUserSuccess] = useState(null);

  // Form Input States
  const [newCurriculum, setNewCurriculum] = useState({
    name: '', subject: 'Math', delivery: 'online', grouping: 'grade',
    cost: '$$', rating: 5, favoritePart: '', answerKey: 'provided',
    methodology: 'spiral', onlineResources: false, selfPaced: false,
    classParticipation: false, worldview: 'secular', videos: false, description: ''
  });
  const [newTrip, setNewTrip] = useState({
    name: '', subject: 'Science', cost: 'Free Admission', rating: 5, description: '',
    location: '', gradeRecommendation: 'All Ages / Family Outing',
    city: '', state: '', zip: '', websiteUrl: ''
  });
  const [selectedTripGrades, setSelectedTripGrades] = useState(['All Ages / Family Outing']);

  const handleTripGradeToggle = (option) => {
    if (option === 'All Ages / Family Outing') {
      setSelectedTripGrades(['All Ages / Family Outing']);
      return;
    }
    setSelectedTripGrades(prev => {
      const filtered = prev.filter(g => g !== 'All Ages / Family Outing');
      if (filtered.includes(option)) {
        const next = filtered.filter(g => g !== option);
        return next.length === 0 ? ['All Ages / Family Outing'] : next;
      } else {
        return [...filtered, option];
      }
    });
  };
  const [newAd, setNewAd] = useState({
    owner: '', businessName: '', description: '', category: 'Cottage Industries',
    businessType: '', contact: '', link: ''
  });

  // Filter States (Field Trips)
  const [tripSearchQuery, setTripSearchQuery] = useState('');
  const [tripSelectedSubject, setTripSelectedSubject] = useState('All');
  const [tripSelectedGrade, setTripSelectedGrade] = useState('All');

  // Filter States (Curriculum Explorer)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedDeliveries, setSelectedDeliveries] = useState([]);
  const [selectedCosts, setSelectedCosts] = useState([]);
  const [selectedWorldviews, setSelectedWorldviews] = useState([]);
  const [selectedMethodologies, setSelectedMethodologies] = useState([]);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [featuresFilter, setFeaturesFilter] = useState({
    onlineResources: false,
    selfPaced: false,
    classParticipation: false,
    videos: false
  });

  // Modal input state for grade levels checkbox grid
  const [gradeLevelsSelected, setGradeLevelsSelected] = useState([]);

  // Detailed view modal state
  const [selectedCurriculumDetail, setSelectedCurriculumDetail] = useState(null);
  const [selectedTripDetail, setSelectedTripDetail] = useState(null);
  const [selectedAdDetail, setSelectedAdDetail] = useState(null);

  // Curriculum reviews states
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [showAddReviewSection, setShowAddReviewSection] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, description: '', favoritePart: '' });
  const [reviewFormError, setReviewFormError] = useState(null);
  const [reviewingCurriculumId, setReviewingCurriculumId] = useState(null);

  // Featured Carousel Index (Dashboard)
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Fetch Data from Server
  const fetchData = async () => {
    try {
      const [currRes, tripRes, adRes, resRes, postRes] = await Promise.allSettled([
        getCurricula(),
        getFieldTrips(),
        getBusinessAds(),
        getResources(),
        getCommunityPosts()
      ]);

      const currData = currRes.status === 'fulfilled' ? currRes.value : [];
      const tripData = tripRes.status === 'fulfilled' ? tripRes.value : [];
      const adData = adRes.status === 'fulfilled' ? adRes.value : [];
      const resData = resRes.status === 'fulfilled' ? resRes.value : [];
      const postData = postRes.status === 'fulfilled' ? postRes.value : [];

      if (currData && currData.length > 0) setCurricula(currData);
      if (tripData && tripData.length > 0) setFieldTrips(tripData);
      if (adData && adData.length > 0) setBusinessAds(adData);
      if (resData && resData.length > 0) setResources(resData);
      if (postData && postData.length > 0) setPosts(postData);

      setStats({
        curricula: currData.length,
        trips: tripData.length,
        ads: adData.length,
        resources: resData.length
      });
    } catch (err) {
      console.error("Failed to load backend DB data: ", err);
    }
  };

  // Curriculum Filtering Logic
  const filteredCurricula = curricula.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSubject = selectedSubjects.length === 0 || selectedSubjects.includes(item.subject);
    const matchesDelivery = selectedDeliveries.length === 0 || selectedDeliveries.includes(item.delivery);
    const matchesCost = selectedCosts.length === 0 || selectedCosts.includes(item.cost);
    const matchesWorldview = selectedWorldviews.length === 0 || selectedWorldviews.includes(item.worldview);
    const matchesMethod = selectedMethodologies.length === 0 || selectedMethodologies.includes(item.methodology);
    const matchesGrade = selectedGrades.length === 0 || 
                         (item.gradeLevels && item.gradeLevels.some(g => selectedGrades.includes(g)));

    const matchesOnlineRes = !featuresFilter.onlineResources || item.onlineResources;
    const matchesSelfPaced = !featuresFilter.selfPaced || item.selfPaced;
    const matchesParticipation = !featuresFilter.classParticipation || item.classParticipation;
    const matchesVideos = !featuresFilter.videos || item.videos;

    return matchesSearch && matchesSubject && matchesDelivery && matchesCost && 
           matchesWorldview && matchesMethod && matchesOnlineRes && matchesSelfPaced &&            matchesParticipation && matchesVideos && matchesGrade;
  });

  // Field Trip Filtering Logic
  const filteredFieldTrips = fieldTrips.filter(item => {
    const matchesSearch = tripSearchQuery.trim() === '' || 
                          item.name.toLowerCase().includes(tripSearchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(tripSearchQuery.toLowerCase()) ||
                          (item.location && item.location.toLowerCase().includes(tripSearchQuery.toLowerCase())) ||
                          (item.city && item.city.toLowerCase().includes(tripSearchQuery.toLowerCase())) ||
                          (item.state && item.state.toLowerCase().includes(tripSearchQuery.toLowerCase())) ||
                          (item.zip && item.zip.toLowerCase().includes(tripSearchQuery.toLowerCase()));

    const matchesSubject = tripSelectedSubject === 'All' || item.subject === tripSelectedSubject;

    let matchesGrade = true;
    if (tripSelectedGrade !== 'All') {
      const rec = (item.gradeRecommendation || '').toLowerCase();
      if (tripSelectedGrade === 'Elementary') {
        matchesGrade = rec.includes('elementary') || rec.includes('all') || rec.includes('k-') || rec.includes('all grades');
      } else if (tripSelectedGrade === 'Middle') {
        matchesGrade = rec.includes('middle') || rec.includes('all') || rec.includes('all grades');
      } else if (tripSelectedGrade === 'High') {
        matchesGrade = rec.includes('high') || rec.includes('all') || rec.includes('all grades');
      }
    }

    return matchesSearch && matchesSubject && matchesGrade;
  });

  // Business Ads Filtering Logic
  const filteredBusinessAds = businessAds.filter(item => {
    const matchesSearch = adSearchQuery.trim() === '' || 
                          item.businessName.toLowerCase().includes(adSearchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(adSearchQuery.toLowerCase()) ||
                          item.owner.toLowerCase().includes(adSearchQuery.toLowerCase()) ||
                          (item.businessType && item.businessType.toLowerCase().includes(adSearchQuery.toLowerCase()));
                          
    const matchesCategory = selectedAdCategory === 'All' || item.category === selectedAdCategory;
    const matchesType = adSelectedType === 'All' || item.businessType === adSelectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });



  useEffect(() => {
    fetchData();
  }, []);

  // URL Hash Sync for Tab Navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['home', 'explorer', 'community', 'fieldtrips', 'businesses', 'resources', 'dashboard'].includes(hash)) {
        setActiveTab(hash);
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Fetch subusers and pending resources based on login status
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('grove_user', JSON.stringify(currentUser));
      if (currentUser.role === 'Parent') {
        getSubUsers(currentUser)
          .then(data => setSubUsers(data))
          .catch(err => console.error("Error fetching subusers:", err));
        getCoParents(currentUser)
          .then(data => setCoParents(data))
          .catch(err => console.error("Error fetching co-parents:", err));
      } else {
        setSubUsers([]);
        setCoParents([]);
      }
      if (currentUser.role === 'Moderator') {
        getPendingResources()
          .then(data => setPendingResources(data))
          .catch(err => console.error("Error fetching pending resources:", err));
        getDiscussionRequests()
          .then(data => setDiscussionRequests(data))
          .catch(err => console.error("Error fetching discussion requests:", err));
      } else {
        setPendingResources([]);
        setDiscussionRequests([]);
      }
    } else {
      localStorage.removeItem('grove_user');
      setSubUsers([]);
      setPendingResources([]);
    }
  }, [currentUser]);

  // Leaflet Map integration hook
  useEffect(() => {
    let map = null;
    
    if (activeTab === 'fieldtrips' && filteredFieldTrips.length > 0) {
      try {
        const mapContainer = document.getElementById('field-trip-map');
        if (mapContainer && window.L) {
          if (window.tripMap) {
            try { window.tripMap.remove(); } catch (e) {}
            window.tripMap = null;
          }

          const tripsWithCoords = filteredFieldTrips.filter(t => t.lat && t.lng);
          const center = tripsWithCoords.length > 0 
            ? [tripsWithCoords[0].lat, tripsWithCoords[0].lng] 
            : [39.8283, -98.5795];
          const zoom = tripsWithCoords.length > 0 ? 10 : 4;

          map = window.L.map('field-trip-map', { scrollWheelZoom: false }).setView(center, zoom);
          window.tripMap = map;

          window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          tripsWithCoords.forEach(trip => {
            const popupHtml = `
              <div style="font-family: var(--font-body); font-size: 0.85rem; line-height: 1.4; color: var(--color-text-dark);">
                <strong style="color: var(--color-primary); font-size: 0.95rem; display: block; margin-bottom: 2px;">${trip.name}</strong>
                <span style="font-size: 0.75rem; color: var(--color-text-muted); display: block; margin-bottom: 6px;">📍 ${trip.city || ''}, ${trip.state || ''}</span>
                <p style="margin: 0 0 8px 0; font-size: 0.8rem; color: var(--color-text-muted); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${trip.description}</p>
              </div>
            `;
            const marker = window.L.marker([trip.lat, trip.lng]).addTo(map);
            marker.bindPopup(popupHtml);
          });
        }
      } catch (err) {
        console.warn("Leaflet map integration error ignored:", err);
      }
    }
  }, [activeTab, filteredFieldTrips]);

  // Bind trip viewer helper to window for Leaflet popups
  useEffect(() => {
    window.showTripFromMap = (id) => {
      const trip = fieldTrips.find(t => t.id === id);
      if (trip) {
        setSelectedTripDetail(trip);
      }
    };
    return () => {
      delete window.showTripFromMap;
    };
  }, [fieldTrips]);

  useEffect(() => {
    if (selectedCurriculumDetail) {
      getCurriculumReviews(selectedCurriculumDetail.id)
        .then(data => setSelectedReviews(data))
        .catch(err => console.error("Error fetching reviews:", err));
    } else {
      setSelectedReviews([]);
      setShowAddReviewSection(false);
      setNewReview({ rating: 5, description: '', favoritePart: '' });
      setReviewFormError(null);
    }
  }, [selectedCurriculumDetail]);



  // Form Submissions
  const handleCurriculumSubmit = async (e) => {
    e.preventDefault();
    if (!newCurriculum.name || !newCurriculum.description) {
      setFormError("Please fill out Name and Description.");
      return;
    }
    
    try {
      const payload = { 
        ...newCurriculum, 
        gradeLevels: gradeLevelsSelected, 
        userId: currentUser ? currentUser.id : 'parent-1',
        userName: currentUser ? currentUser.name : 'Sarah Jenkins'
      };
      
      if (reviewingCurriculumId) {
        await addCurriculumReview(reviewingCurriculumId, payload);
      } else {
        await addCurriculum(payload);
      }
      
      setShowCurriculumModal(false);
      setFormError(null);
      setNewCurriculum({
        name: '', subject: 'Math', delivery: 'online', grouping: 'grade',
        cost: '$$', rating: 5, favoritePart: '', answerKey: 'provided',
        methodology: 'spiral', onlineResources: false, selfPaced: false,
        classParticipation: false, worldview: 'secular', videos: false, description: ''
      });
      setGradeLevelsSelected([]);
      setReviewingCurriculumId(null);
      fetchData();
    } catch (err) {
      console.error(err);
      setFormError("An unexpected error occurred while saving the review.");
    }
  };

  const handleOpenReviewForExisting = (curriculumDetail) => {
    setSelectedCurriculumDetail(null);
    setReviewingCurriculumId(curriculumDetail.id);
    setNewCurriculum({
      name: curriculumDetail.name,
      subject: curriculumDetail.subject,
      delivery: curriculumDetail.delivery,
      grouping: curriculumDetail.grouping,
      cost: curriculumDetail.cost,
      rating: 5,
      favoritePart: '',
      answerKey: curriculumDetail.answerKey,
      methodology: curriculumDetail.methodology,
      onlineResources: !!curriculumDetail.onlineResources,
      selfPaced: !!curriculumDetail.selfPaced,
      classParticipation: !!curriculumDetail.classParticipation,
      worldview: curriculumDetail.worldview,
      videos: !!curriculumDetail.videos,
      description: ''
    });
    setGradeLevelsSelected(curriculumDetail.gradeLevels || []);
    setShowCurriculumModal(true);
  };


  const handleTripSubmit = async (e) => {
    e.preventDefault();
    if (!newTrip.name || !newTrip.description || !newTrip.location || !newTrip.city || !newTrip.state) {
      setFormError("Please fill out Name, Location, City, State, and Description.");
      return;
    }

    // Attempt geocoding via Nominatim
    let lat = null;
    let lng = null;
    try {
      const addressQuery = `${newTrip.location}, ${newTrip.city}, ${newTrip.state} ${newTrip.zip || ''}`.trim();
      const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressQuery)}&limit=1`;
      const geoRes = await fetch(geoUrl, {
        headers: {
          'Accept-Language': 'en'
        }
      });
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (geoData && geoData.length > 0) {
          lat = parseFloat(geoData[0].lat);
          lng = parseFloat(geoData[0].lon);
        } else {
          // Retry with just city, state, zip
          const broadQuery = `${newTrip.city}, ${newTrip.state} ${newTrip.zip || ''}`.trim();
          const broadRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(broadQuery)}&limit=1`, {
            headers: { 'Accept-Language': 'en' }
          });
          if (broadRes.ok) {
            const broadData = await broadRes.json();
            if (broadData && broadData.length > 0) {
              lat = parseFloat(broadData[0].lat);
              lng = parseFloat(broadData[0].lon);
            }
          }
        }
      }
    } catch (err) {
      console.error("Failed to query Nominatim coordinates: ", err);
    }

    try {
      const gradeRecommendationString = selectedTripGrades.length > 0
        ? selectedTripGrades.join(', ')
        : 'All Ages / Family Outing';
      const payload = { 
        ...newTrip, 
        gradeRecommendation: gradeRecommendationString, 
        lat, lng, 
        userId: currentUser ? currentUser.id : 'parent-1' 
      };
      const createdTrip = await addFieldTrip(payload);
      setFieldTrips(prev => [createdTrip, ...prev.filter(t => t.id !== createdTrip.id)]);
      setShowTripModal(false);
      setFormError(null);
      setSelectedTripGrades(['All Ages / Family Outing']);
      setNewTrip({
        name: '', subject: 'Science', cost: 'Free Admission', rating: 5, description: '',
        location: '', gradeRecommendation: 'All Ages / Family Outing',
        city: '', state: '', zip: '', websiteUrl: ''
      });
      fetchData();
    } catch (err) {
      console.error(err);
      setFormError(err?.message || "An unexpected error occurred while posting field trip.");
    }
  };

  const handleAdSubmit = async (e) => {
    e.preventDefault();
    if (!newAd.businessName || !newAd.owner || !newAd.description || !newAd.contact || !newAd.businessType) {
      setFormError("Please fill out Business Name, Owner, Contact, Business Type, and Description.");
      return;
    }

    try {
      await addBusinessAd({ ...newAd, userId: currentUser ? currentUser.id : 'parent-1' });
      setShowAdModal(false);
      setFormError(null);
      setNewAd({
        owner: '', businessName: '', description: '', category: 'Cottage Industries',
        businessType: '', contact: '', link: ''
      });
      fetchData();
    } catch (err) {
      console.error(err);
      setFormError("An unexpected error occurred while publishing the ad.");
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.author || !newPost.content) {
      setFormError("Please fill out Title, Author/Your Name, and Post Content.");
      return;
    }

    try {
      await addPost({ ...newPost, userId: currentUser ? currentUser.id : 'parent-1' });
      setShowPostModal(false);
      setFormError(null);
      setNewPost({
        author: '', title: '', content: '', category: 'General'
      });
      fetchData();
    } catch (err) {
      console.error(err);
      setFormError("An unexpected error occurred while publishing the post.");
    }
  };

  const handleOpenRoleModal = async () => {
    const users = await getAllUsers();
    setAllUsersList(users);
    setShowRoleModal(true);
    setRoleUpdateMsg(null);
  };

  const handleSaveUserRoles = async (userId, primaryRole, assignedRoles) => {
    await updateUserRolePermissions(userId, primaryRole, assignedRoles);
    setAllUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: primaryRole, assignedRoles } : u));
    if (currentUser && currentUser.id === userId) {
      const updated = { ...currentUser, role: primaryRole, assignedRoles };
      setCurrentUser(updated);
      localStorage.setItem('grove_user', JSON.stringify(updated));
    }
    setRoleUpdateMsg("Role permissions updated successfully!");
    setTimeout(() => setRoleUpdateMsg(null), 3000);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (authMode === 'login') {
      try {
        const user = await getUserByEmail(authForm.email);
        if (!user) {
          setFormError("Incorrect email or password.");
          return;
        }
        const inputHashed = await hashPassword(authForm.password);
        if (user.password !== inputHashed) {
          setFormError("Incorrect email or password.");
          return;
        }
        let loggedUser = user;
        if (isSiteOwner(user) || SITE_OWNER_EMAILS.includes((user.email || '').toLowerCase())) {
          loggedUser = {
            ...user,
            role: user.role || 'Admin',
            assignedRoles: user.assignedRoles || ['Admin', 'Moderator', 'Parent'],
            isSiteOwner: true
          };
        }
        setCurrentUser(loggedUser);
        localStorage.setItem('grove_user', JSON.stringify(loggedUser));
        setShowAuthModal(false);
        setFormError(null);
        setAuthForm({ email: '', password: '', name: '' });
        fetchData();
      } catch (err) {
        console.error(err);
        setFormError("Login failed");
      }
    } else {
      try {
        const existing = await getUserByEmail(authForm.email);
        if (existing) {
          setFormError("Email is already registered.");
          return;
        }
        const isOwner = SITE_OWNER_EMAILS.includes((authForm.email || '').toLowerCase());
        const user = await createUser({
          email: authForm.email,
          password: authForm.password,
          name: authForm.name,
          role: isOwner ? 'Admin' : 'Parent',
          assignedRoles: isOwner ? ['Admin', 'Moderator', 'Parent'] : ['Parent'],
          parentId: null
        });
        setCurrentUser(user);
        setShowAuthModal(false);
        setFormError(null);
        setAuthForm({ email: '', password: '', name: '' });
        fetchData();
      } catch (err) {
        console.error(err);
        setFormError("Registration failed");
      }
    }
  };

  const handleNewSubUserSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser || currentUser.role !== 'Parent') return;
    setSubUserError(null);
    setSubUserSuccess(null);

    try {
      const existing = await getUserByEmail(newSubUserForm.email);
      if (existing) {
        setSubUserError("Email is already registered.");
        return;
      }
      const newSub = await createSubUser(currentUser.id, newSubUserForm);
      setSubUsers(prev => [...prev, newSub]);
      setNewSubUserForm({ email: '', password: '', name: '', role: 'Student' });
      setSubUserSuccess("Child profile added successfully!");
    } catch (err) {
      console.error(err);
      setSubUserError(err.message || "Failed to create child profile");
    }
  };

  const handleLinkCoParentSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser || currentUser.role !== 'Parent') return;
    setCoParentError(null);
    setCoParentSuccess(null);

    try {
      const updated = await linkCoParent(currentUser, coParentEmailInput);
      setCoParents(prev => [...prev.filter(p => p.id !== updated.id), updated]);
      setCoParentEmailInput('');
      setCoParentSuccess(`Successfully linked co-parent "${updated.name}" (${updated.email}) to your household!`);
      // Refresh household children
      const children = await getSubUsers(currentUser);
      setSubUsers(children);
    } catch (err) {
      console.error(err);
      setCoParentError(err.message || "Failed to link co-parent.");
    }
  };

  const handleNewPostSubmit = async (e) => {
    e.preventDefault();
    if (!newPostForm.title.trim() || !newPostForm.content.trim()) {
      setFormError("Please fill in both a title and content.");
      return;
    }

    const tagArray = newPostForm.tags
      ? newPostForm.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    const categoryLabels = {
      'curriculum-qa': '📚 Curriculum Q&A',
      'coops-trips': '🌲 Co-ops & Field Trips',
      'prep': '🎓 High School & College Prep',
      'swap': '🎒 Buy / Sell / Swap',
      'tips': '💡 Teaching Tips & Advice',
      'lounge': '💬 General Lounge'
    };

    const postPayload = {
      author: currentUser ? currentUser.name : 'Anonymous Parent',
      role: currentUser ? currentUser.role : 'Parent',
      title: newPostForm.title,
      category: newPostForm.category,
      categoryLabel: categoryLabels[newPostForm.category] || 'General',
      content: newPostForm.content,
      tags: tagArray
    };

    try {
      const created = await createCommunityPost(postPayload);
      setPosts(prev => [created, ...prev]);
      setNewPostForm({ title: '', category: 'curriculum-qa', content: '', tags: '' });
      setShowNewPostModal(false);
      setFormError(null);
    } catch (err) {
      console.error(err);
      setFormError("Failed to create post.");
    }
  };

  const handleNewReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyInput.trim() || !activePostDetail) return;

    const replyPayload = {
      author: currentUser ? currentUser.name : 'Parent Member',
      content: replyInput
    };

    try {
      const newReply = await addCommunityReply(activePostDetail.id, replyPayload);
      const updatedReplies = [...(activePostDetail.replies || []), newReply];
      const updatedDetail = { ...activePostDetail, replies: updatedReplies };
      
      setActivePostDetail(updatedDetail);
      setPosts(prev => prev.map(p => p.id === activePostDetail.id ? updatedDetail : p));
      setReplyInput('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDiscussionRequestSubmit = async (e) => {
    e.preventDefault();
    if (!requestForm.title.trim() || !requestForm.content.trim()) {
      setFormError("Please fill in both the discussion title and details.");
      return;
    }

    const tagArray = requestForm.tags
      ? requestForm.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    const categoryLabels = {
      'curriculum-qa': '📚 Curriculum Q&A',
      'coops-trips': '🌲 Co-ops & Field Trips',
      'prep': '🎓 High School & College Prep',
      'swap': '🎒 Buy / Sell / Swap',
      'tips': '💡 Teaching Tips & Advice',
      'lounge': '💬 General Lounge'
    };

    const requestPayload = {
      author: currentUser ? currentUser.name : 'Parent Member',
      email: currentUser ? currentUser.email : (requestForm.email || 'N/A'),
      role: currentUser ? currentUser.role : 'PARENT',
      title: requestForm.title,
      category: requestForm.category,
      categoryLabel: categoryLabels[requestForm.category] || 'General',
      content: requestForm.content,
      tags: tagArray,
      reason: requestForm.reason
    };

    try {
      const created = await requestCommunityDiscussion(requestPayload);
      setDiscussionRequests(prev => [created, ...prev]);
      setRequestForm({ title: '', category: 'curriculum-qa', content: '', tags: '', email: '', reason: '' });
      setShowRequestModal(false);
      setFormError(null);
      setRequestSuccess(`Thank you! Your discussion request for "${requestPayload.title}" has been submitted to our moderation team for review.`);
    } catch (err) {
      console.error(err);
      setFormError("Failed to submit discussion request.");
    }
  };

  const handleApproveResource = async (id) => {
    try {
      await approveResource(id);
      setPendingResources(prev => prev.filter(r => r.id !== id));
      fetchData();
    } catch (err) {
      console.error(err);
      setFormError("Failed to approve resource");
    }
  };

  const handleRejectResource = async (id) => {
    if (!confirm("Are you sure you want to reject and delete this resource?")) return;
    try {
      await rejectResource(id);
      setPendingResources(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
      setFormError("Failed to reject resource");
    }
  };

  const handleResourceSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setFormError("You must be logged in to submit resources.");
      return;
    }
    if (!newResource.name || !newResource.link || !newResource.description) {
      setFormError("Please fill out all fields.");
      return;
    }

    try {
      const payload = {
        ...newResource,
        userId: currentUser.id,
        approved: currentUser.role === 'Moderator'
      };

      await addResource(payload);

      setShowResourceModal(false);
      setFormError(null);
      setNewResource({ name: '', subject: 'Math', cost: 'free', link: '', description: '', type: 'website' });
      fetchData();
    } catch (err) {
      console.error(err);
      setFormError("Failed to submit resource");
    }
  };

  // Carousel handlers
  const handleNextSlide = () => {
    const highestRated = curricula.filter(c => c.rating >= 4.5);
    if (highestRated.length === 0) return;
    setCarouselIndex((prev) => (prev + 1) % highestRated.length);
  };

  const handlePrevSlide = () => {
    const highestRated = curricula.filter(c => c.rating >= 4.5);
    if (highestRated.length === 0) return;
    setCarouselIndex((prev) => (prev - 1 + highestRated.length) % highestRated.length);
  };

  // Filters Toggles
  const handleSubjectToggle = (subj) => {
    setSelectedSubjects(prev =>
      prev.includes(subj) ? prev.filter(x => x !== subj) : [...prev, subj]
    );
  };

  const handleDeliveryToggle = (val) => {
    setSelectedDeliveries(prev =>
      prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]
    );
  };

  const handleCostToggle = (val) => {
    setSelectedCosts(prev =>
      prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]
    );
  };

  const handleWorldviewToggle = (val) => {
    setSelectedWorldviews(prev =>
      prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]
    );
  };

  const handleMethodologyToggle = (val) => {
    setSelectedMethodologies(prev =>
      prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]
    );
  };

  const handleGradeToggle = (grade) => {
    setSelectedGrades(prev =>
      prev.includes(grade) ? prev.filter(g => g !== grade) : [...prev, grade]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedSubjects([]);
    setSelectedDeliveries([]);
    setSelectedCosts([]);
    setSelectedWorldviews([]);
    setSelectedMethodologies([]);
    setSelectedGrades([]);
    setFeaturesFilter({
      onlineResources: false,
      selfPaced: false,
      classParticipation: false,
      videos: false
    });
  };



  const uniqueBusinessTypes = ['All', ...new Set(businessAds.map(ad => ad.businessType).filter(Boolean))];

  return (
    <div className="app-container">
      {/* MOBILE TOP APPLICATION BAR (< 1024px) */}
      <header className="mobile-top-header">
        <button
          className="mobile-hamburger-btn"
          aria-label="Open Navigation Menu"
          onClick={() => setIsMobileDrawerOpen(true)}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </button>

        <div className="mobile-brand-title" onClick={() => { setActiveTab('explorer'); setIsMobileDrawerOpen(false); }}>
          <svg className="brand-logo" viewBox="0 0 48 48" width="36" height="36" style={{ minWidth: '32px', minHeight: '32px' }}>
            <circle cx="24" cy="24" r="22" fill="#2E5A31" fillOpacity="0.25" stroke="#B77C43" strokeWidth="1.5" />
            <path d="M24 7C18.5 7 14 10.5 14 15C11.8 15 9.5 17.2 9.5 19.5C9.5 22.8 12.2 25 15 25C15 27.8 17.2 30 20.5 30H27.5C30.8 30 33 27.8 33 25C35.8 25 38.5 22.8 38.5 19.5C38.5 17.2 36.2 15 34 15C34 10.5 29.5 7 24 7Z" fill="#3D7A40" />
            <path d="M24 9.5C19.8 9.5 16.2 12.2 16.2 15.8C14.4 15.8 12.8 17.5 12.8 19.5C12.8 22.2 15 23.8 17.5 23.8C17.5 26.2 19.5 28 22.2 28H25.8C28.5 28 30.5 26.2 30.5 23.8C33 23.8 35.2 22.2 35.2 19.5C35.2 17.5 33.6 15.8 31.8 15.8C31.8 12.2 28.2 9.5 24 9.5Z" fill="#589B5B" />
            <path d="M21.5 27V38C21.5 39 19.5 40 17 41M26.5 27V38C26.5 39 28.5 40 31 41M24 25V39" stroke="#B77C43" strokeWidth="2.8" strokeLinecap="round" />
            <circle cx="24" cy="14" r="2.5" fill="#F3BF64" />
          </svg>
          <span>The Learning Grove</span>
        </div>

        {currentUser ? (
          <button 
            className="mobile-avatar-btn"
            onClick={() => setIsMobileDrawerOpen(true)}
            aria-label="User Menu"
          >
            {currentUser.name.charAt(0).toUpperCase()}
          </button>
        ) : (
          <button 
            className="btn btn-sm btn-primary"
            onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
          >
            Sign In
          </button>
        )}
      </header>

      {/* MOBILE OFF-CANVAS DRAWER BACKDROP MASK */}
      {isMobileDrawerOpen && (
        <div 
          className="mobile-drawer-backdrop"
          onClick={() => setIsMobileDrawerOpen(false)}
        />
      )}

      {/* SIDEBAR NAVIGATION (Permanent on Desktop >=1024px, Slide-Out Drawer on Mobile/Tablet <1024px) */}
      <aside className={`sidebar ${isMobileDrawerOpen ? 'drawer-open' : ''}`}>
        <div>
          <div className="brand-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <svg className="brand-logo" viewBox="0 0 48 48" width="42" height="42" style={{ minWidth: '40px', minHeight: '40px' }}>
                <circle cx="24" cy="24" r="22" fill="#2E5A31" fillOpacity="0.25" stroke="#B77C43" strokeWidth="1.5" />
                <path d="M24 7C18.5 7 14 10.5 14 15C11.8 15 9.5 17.2 9.5 19.5C9.5 22.8 12.2 25 15 25C15 27.8 17.2 30 20.5 30H27.5C30.8 30 33 27.8 33 25C35.8 25 38.5 22.8 38.5 19.5C38.5 17.2 36.2 15 34 15C34 10.5 29.5 7 24 7Z" fill="#3D7A40" />
                <path d="M24 9.5C19.8 9.5 16.2 12.2 16.2 15.8C14.4 15.8 12.8 17.5 12.8 19.5C12.8 22.2 15 23.8 17.5 23.8C17.5 26.2 19.5 28 22.2 28H25.8C28.5 28 30.5 26.2 30.5 23.8C33 23.8 35.2 22.2 35.2 19.5C35.2 17.5 33.6 15.8 31.8 15.8C31.8 12.2 28.2 9.5 24 9.5Z" fill="#589B5B" />
                <path d="M21.5 27V38C21.5 39 19.5 40 17 41M26.5 27V38C26.5 39 28.5 40 31 41M24 25V39" stroke="#B77C43" strokeWidth="2.8" strokeLinecap="round" />
                <circle cx="24" cy="14" r="2.5" fill="#F3BF64" />
              </svg>
              <span className="brand-name">The Learning Grove</span>
            </div>

            {/* Mobile Close Button inside Drawer */}
            <button 
              className="drawer-close-btn"
              onClick={() => setIsMobileDrawerOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          {/* USER PROFILE SECTION */}
          <div style={{ padding: '0.75rem 1rem', background: 'var(--brand-wash, #E4EDE4)', margin: '0 1rem 1rem 1rem', borderRadius: '8px', border: '1.5px solid var(--line-strong, #6D7A6D)' }}>
            {currentUser ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--brand, #1E3F20)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--ink, #1B201C)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentUser.name}</div>
                    
                    {/* ONLY display role selector dropdown if Site Owner assigned multiple roles */}
                    {(currentUser.assignedRoles && currentUser.assignedRoles.length > 1) ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', maxWidth: '100%' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--ink-muted, #556056)', fontWeight: '700' }}>Role:</span>
                        <select
                          value={currentUser.role}
                          onChange={(e) => {
                            const updated = { ...currentUser, role: e.target.value };
                            setCurrentUser(updated);
                            localStorage.setItem('grove_user', JSON.stringify(updated));
                          }}
                          style={{
                            fontSize: '0.65rem',
                            background: 'var(--oak-wash, #F6EADC)',
                            color: 'var(--oak-text, #8A5320)',
                            fontWeight: '800',
                            border: '1px solid var(--oak-text, #8A5320)',
                            borderRadius: '4px',
                            padding: '1px 4px',
                            cursor: 'pointer',
                            maxWidth: '100%',
                            boxSizing: 'border-box',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {currentUser.assignedRoles.map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.7rem', color: 'var(--oak-text, #8A5320)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>
                        {currentUser.role}
                      </div>
                    )}
                  </div>
                </div>

                {currentUser.role === 'Parent' && (
                  <button 
                    onClick={() => { setShowFamilyModal(true); setIsMobileDrawerOpen(false); }}
                    style={{ 
                      width: '100%', 
                      boxSizing: 'border-box',
                      fontSize: '0.75rem', 
                      padding: '5px 0', 
                      border: 'none', 
                      background: 'var(--brand, #1E3F20)', 
                      color: 'var(--brand-on-fill, #FFFFFF)', 
                      borderRadius: '4px', 
                      cursor: 'pointer', 
                      fontWeight: '700', 
                      marginBottom: '0.4rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <span>➕ Manage / Add Child</span>
                  </button>
                )}

                {currentUser.role === 'Parent' && subUsers.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '0.5rem', width: '100%', boxSizing: 'border-box' }}>
                    <label style={{ fontSize: '0.65rem', color: 'var(--ink-muted, #556056)', fontWeight: '700' }}>Switch Profile:</label>
                    <select 
                      style={{ fontSize: '0.75rem', padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--line-strong, #6D7A6D)', background: 'var(--surface-card, #FFFFFF)', color: 'var(--ink, #1B201C)', fontWeight: '600', width: '100%', boxSizing: 'border-box', maxWidth: '100%' }}
                      value={currentUser.id}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === currentUser.id) return;
                        const sub = subUsers.find(s => s.id === val);
                        if (sub) {
                          localStorage.setItem('grove_parent_user', JSON.stringify(currentUser));
                          setCurrentUser(sub);
                          setIsMobileDrawerOpen(false);
                        }
                      }}
                    >
                      <option value={currentUser.id}>{currentUser.name} (Parent)</option>
                      {subUsers.map(sub => (
                        <option key={sub.id} value={sub.id}>{sub.name} (Child)</option>
                      ))}
                    </select>
                  </div>
                )}

                {currentUser.parentId && (
                  <button 
                    onClick={() => {
                      const parent = JSON.parse(localStorage.getItem('grove_parent_user'));
                      if (parent) {
                        setCurrentUser(parent);
                        setIsMobileDrawerOpen(false);
                      }
                    }}
                    style={{ width: '100%', fontSize: '0.75rem', padding: '5px 0', border: '1.5px solid var(--brand, #1E3F20)', background: 'var(--surface-card, #FFFFFF)', color: 'var(--brand, #1E3F20)', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', marginBottom: '0.4rem' }}
                  >
                    Switch to Parent
                  </button>
                )}

                {isSiteOwner(currentUser) && (
                  <button 
                    onClick={() => { handleOpenRoleModal(); setIsMobileDrawerOpen(false); }}
                    style={{ width: '100%', fontSize: '0.75rem', padding: '5px 0', border: '1.5px solid var(--oak-text, #8A5320)', background: 'var(--oak-wash, #F6EADC)', color: 'var(--oak-text, #8A5320)', borderRadius: '4px', cursor: 'pointer', fontWeight: '800', marginBottom: '0.4rem' }}
                  >
                    👑 Assign Member Roles
                  </button>
                )}

                <button 
                  onClick={() => {
                    localStorage.removeItem('grove_parent_user');
                    setCurrentUser(null);
                    setIsMobileDrawerOpen(false);
                  }}
                  style={{ width: '100%', fontSize: '0.75rem', padding: '5px 0', border: '1.5px solid var(--danger, #A0201A)', background: 'var(--surface-card, #FFFFFF)', color: 'var(--danger, #A0201A)', borderRadius: '4px', cursor: 'pointer', fontWeight: '700' }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', margin: '0 0 0.5rem 0' }}>Join the grove to share, post and connect!</p>
                <button 
                  onClick={() => { setAuthMode('login'); setShowAuthModal(true); setIsMobileDrawerOpen(false); }}
                  style={{ width: '100%', fontSize: '0.75rem', padding: '5px 0', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
                >
                  Sign In / Register
                </button>
              </div>
            )}
          </div>

          <div style={{ padding: '0.75rem 1rem', margin: '0 1rem 1rem 1rem' }}>
            <ThemeToggle />
          </div>

          <nav>
            <ul className="nav-list">
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('home'); setIsMobileDrawerOpen(false); }}
                >
                  <HomeIcon />
                  <span>Welcome Home</span>
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'explorer' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('explorer'); setIsMobileDrawerOpen(false); }}
                >
                  <CurriculaIcon />
                  <span>Curricula</span>
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'community' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('community'); setIsMobileDrawerOpen(false); }}
                >
                  <CommunityIcon />
                  <span>Community Board</span>
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'fieldtrips' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('fieldtrips'); setIsMobileDrawerOpen(false); }}
                >
                  <PinIcon />
                  <span>Field Trips</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <div className="sidebar-footer">
          <p>© 2026 The Learning Grove</p>
        </div>
      </aside>

      {/* RIGHT MAIN CONTAINER */}
      <main className="main-content">
        
        {/* ======================================= */}
        {/* TABS 1: DASHBOARD                       */}
        {/* ======================================= */}
        {activeTab === 'dashboard' && (
          <div>
            <header className="content-header">
              <div>
                <h1 className="page-title">Homeschool Dashboard</h1>
              </div>
              {(!currentUser || currentUser.role !== 'Student') && (
                <button className="btn btn-primary" onClick={() => setShowCurriculumModal(true)}>
                  <PlusIcon /> Write Review
                </button>
              )}
            </header>

            {/* Quick Stats Panel */}
            <section className="dashboard-grid">
              <div className="stat-card" onClick={() => setActiveTab('explorer')}>
                <div className="stat-icon"><CurriculaIcon /></div>
                <div>
                  <div className="stat-value">{stats.curricula}</div>
                  <div className="stat-label">Reviewed Curricula</div>
                </div>
              </div>
              <div className="stat-card" onClick={() => setActiveTab('fieldtrips')}>
                <div className="stat-icon"><PinIcon /></div>
                <div>
                  <div className="stat-value">{stats.trips}</div>
                  <div className="stat-label">Field Trips Shared</div>
                </div>
              </div>
              <div className="stat-card" onClick={() => setActiveTab('businesses')}>
                <div className="stat-icon"><BusinessIcon /></div>
                <div>
                  <div className="stat-value">{stats.ads}</div>
                  <div className="stat-label">Local Mom Businesses</div>
                </div>
              </div>
              <div className="stat-card" onClick={() => setActiveTab('resources')}>
                <div className="stat-icon"><ResourcesIcon /></div>
                <div>
                  <div className="stat-value">{stats.resources}</div>
                  <div className="stat-label">Online Resources</div>
                </div>
              </div>
            </section>

            <div className="dashboard-sections">
              {/* Highlight Slide Carousel */}
              <div className="panel">
                <h2 className="panel-title">
                  <StarFilledIcon /> Highest Rated Curricula
                </h2>
                {curricula.filter(c => c.rating >= 4.5).length > 0 ? (
                  <div className="carousel-container">
                    <div className="carousel-track">
                      {curricula.filter(c => c.rating >= 4.5).map((item, idx) => (
                        <div 
                          className="carousel-slide" 
                          key={item.id} 
                          style={{ display: idx === carouselIndex ? 'block' : 'none' }}
                        >
                          <div 
                            className="featured-card"
                            onClick={() => setSelectedCurriculumDetail(item)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div>
                              <div className="featured-meta">
                                <span className="featured-subject">{item.subject}</span>
                                <Rating value={item.rating} />
                              </div>
                              <h3 className="featured-title">{item.name}</h3>
                              <p className="featured-desc">{item.description}</p>
                            </div>
                            <div className="card-favorite-block" style={{ marginTop: '1rem' }}>
                              <strong>Favorite Part</strong>
                              "{item.favoritePart || 'The depth of content and ease of integration.'}"
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {curricula.filter(c => c.rating >= 4.5).length > 1 && (
                      <div className="carousel-nav">
                        <button className="carousel-btn" onClick={handlePrevSlide}>‹</button>
                        <button className="carousel-btn" onClick={handleNextSlide}>›</button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    No reviews rated 4.5 or higher yet. Write a review to feature it here!
                  </p>
                )}
              </div>

              {/* Local Community Updates */}
              <div className="panel">
                <h2 className="panel-title">
                  <CommunityIcon /> Latest From The Grove
                </h2>
                <ul className="feed-list">
                  {businessAds.slice(-2).reverse().map(ad => (
                    <li className="feed-item" key={ad.id} onClick={() => setSelectedAdDetail(ad)} style={{ cursor: 'pointer' }}>
                      <div className="feed-icon"><BusinessIcon /></div>
                      <div className="feed-content">
                        <div className="feed-title">{ad.businessName}</div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                          New business ad listed by {ad.owner} under {ad.category}.
                        </p>
                        <div className="feed-meta">Category: {ad.category}</div>
                      </div>
                    </li>
                  ))}
                  {fieldTrips.slice(-2).reverse().map(trip => (
                    <li className="feed-item" key={trip.id} onClick={() => setSelectedTripDetail(trip)} style={{ cursor: 'pointer' }}>
                      <div className="feed-icon"><PinIcon /></div>
                      <div className="feed-content">
                        <div className="feed-title">{trip.name}</div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                          New field trip opportunity listed in {trip.location}{trip.city ? `, ${trip.city}` : ''}.
                        </p>
                        <div className="feed-meta">Subject: {trip.subject}</div>
                      </div>
                    </li>
                  ))}
                  {stats.curricula === 0 && stats.trips === 0 && stats.ads === 0 && (
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                      No community listings yet. Post a business ad or field trip to populate!
                    </p>
                  )}
                </ul>
              </div>

              {/* Family Management Hub for Parents */}
              {currentUser && currentUser.role === 'Parent' && (
                <div className="panel" style={{ gridColumn: '1 / -1', marginTop: '1.5rem' }}>
                  <h2 className="panel-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      🌿 My Family Profiles
                    </span>
                    <button className="btn btn-sm btn-primary" onClick={() => setShowFamilyModal(true)}>
                      ➕ Manage / Add Student
                    </button>
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div>
                      <h3 style={{ fontSize: '0.95rem', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>Active Child Profiles</h3>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {subUsers.map(sub => (
                          <li key={sub.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', background: 'white', borderRadius: '6px', border: '1px solid var(--color-accent-sage-light)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.75rem' }}>
                                {sub.name.charAt(0).toUpperCase()}
                              </div>
                              <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>{sub.name}</span>
                            </div>
                            <span style={{ fontSize: '0.75rem', background: 'var(--color-accent-oak-light)', color: 'var(--color-accent-oak)', padding: '2px 8px', borderRadius: '12px', fontWeight: '700' }}>
                              STUDENT
                            </span>
                          </li>
                        ))}
                        {subUsers.length === 0 && (
                          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>No student profiles added yet. Create one on the right!</p>
                        )}
                      </ul>
                    </div>

                    <div style={{ borderLeft: '1px solid var(--color-accent-sage-light)', paddingLeft: '2rem' }}>
                      <h3 style={{ fontSize: '0.95rem', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>Add Child Profile</h3>
                      <form onSubmit={handleNewSubUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {subUserError && <Notice kind="error">{subUserError}</Notice>}
                        {subUserSuccess && <Notice kind="success">{subUserSuccess}</Notice>}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: '600' }}>Child's Name</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Joey Jenkins" 
                            required 
                            value={newSubUserForm.name}
                            onChange={(e) => setNewSubUserForm(prev => ({ ...prev, name: e.target.value }))}
                            style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--color-accent-sage-light)', fontSize: '0.85rem' }}
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: '600' }}>Child's Email</label>
                          <input 
                            type="email" 
                            placeholder="e.g. joey@example.com" 
                            required 
                            value={newSubUserForm.email}
                            onChange={(e) => setNewSubUserForm(prev => ({ ...prev, email: e.target.value }))}
                            style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--color-accent-sage-light)', fontSize: '0.85rem' }}
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: '600' }}>Password</label>
                          <input 
                            type="password" 
                            placeholder="Set profile password" 
                            required 
                            value={newSubUserForm.password}
                            onChange={(e) => setNewSubUserForm(prev => ({ ...prev, password: e.target.value }))}
                            style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--color-accent-sage-light)', fontSize: '0.85rem' }}
                          />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', alignSelf: 'flex-start', padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                          Add Profile
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* TAB 0: HOME / WELCOME FRONT PAGE       */}
        {/* ======================================= */}
        {activeTab === 'home' && (
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            {/* HERO BANNER SECTION */}
            <header style={{ 
              background: 'linear-gradient(135deg, var(--brand, #1E3F20) 0%, #2A5A2E 100%)', 
              color: '#FFFFFF',
              borderRadius: '16px',
              padding: '2.5rem 2rem',
              marginBottom: '2rem',
              boxShadow: '0 8px 24px rgba(30,63,32,0.15)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'relative', zIndex: 2, maxWidth: '720px' }}>
                <span style={{ 
                  background: 'rgba(255,255,255,0.18)', 
                  padding: '4px 12px', 
                  borderRadius: '20px', 
                  fontSize: '0.8rem', 
                  fontWeight: '700', 
                  letterSpacing: '0.5px',
                  display: 'inline-block',
                  marginBottom: '0.75rem' 
                }}>
                  🌿 HOMESCHOOL FAMILY NETWORK
                </span>

                <h1 style={{ fontSize: '2.2rem', fontWeight: '800', lineHeight: '1.25', margin: '0 0 1rem 0', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                  Welcome to The Learning Grove
                </h1>

                <p style={{ fontSize: '1.05rem', lineHeight: '1.6', color: '#E4EDE4', marginBottom: '1.75rem' }}>
                  A supportive, parent-driven community for homeschooling families. Discover honest curriculum reviews, join moderated discussion channels, and coordinate local co-op field trips.
                </p>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button 
                    className="btn" 
                    onClick={() => setActiveTab('explorer')}
                    style={{ background: '#FFFFFF', color: 'var(--brand, #1E3F20)', fontWeight: '700', padding: '0.65rem 1.25rem', border: 'none' }}
                  >
                    📚 Explore Curricula
                  </button>

                  <button 
                    className="btn" 
                    onClick={() => setActiveTab('community')}
                    style={{ background: 'rgba(255,255,255,0.15)', color: '#FFFFFF', fontWeight: '700', padding: '0.65rem 1.25rem', border: '1px solid rgba(255,255,255,0.4)' }}
                  >
                    💬 Discussion Board
                  </button>

                  <button 
                    className="btn" 
                    onClick={() => setActiveTab('fieldtrips')}
                    style={{ background: 'rgba(255,255,255,0.15)', color: '#FFFFFF', fontWeight: '700', padding: '0.65rem 1.25rem', border: '1px solid rgba(255,255,255,0.4)' }}
                  >
                    🌲 View Field Trips
                  </button>
                </div>
              </div>
            </header>

            {/* LIVE IMPACT COUNTER STATS BANNER */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
              gap: '1rem', 
              marginBottom: '2.5rem' 
            }}>
              <div style={{ background: 'var(--surface-card, #FFFFFF)', border: '1px solid var(--line-strong, #6D7A6D)', borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>📚</span>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--brand, #1E3F20)', lineHeight: '1' }}>{curricula.length || stats.curricula || 14}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--ink-muted, #556056)', fontWeight: '600', marginTop: '0.2rem' }}>Reviewed Curricula</div>
                </div>
              </div>

              <div style={{ background: 'var(--surface-card, #FFFFFF)', border: '1px solid var(--line-strong, #6D7A6D)', borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>💬</span>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--brand, #1E3F20)', lineHeight: '1' }}>{posts.length || 6}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--ink-muted, #556056)', fontWeight: '600', marginTop: '0.2rem' }}>Active Discussions</div>
                </div>
              </div>

              <div style={{ background: 'var(--surface-card, #FFFFFF)', border: '1px solid var(--line-strong, #6D7A6D)', borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>🌲</span>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--brand, #1E3F20)', lineHeight: '1' }}>{fieldTrips.length || stats.trips || 8}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--ink-muted, #556056)', fontWeight: '600', marginTop: '0.2rem' }}>Co-op Field Trips</div>
                </div>
              </div>
            </div>

            {/* CORE PILLARS SHOWCASE CARDS */}
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--ink, #1B201C)', marginBottom: '1.25rem' }}>
              Explore Community Features
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              {/* Card 1: Curricula */}
              <div 
                onClick={() => setActiveTab('explorer')}
                style={{ 
                  background: 'var(--surface-card, #FFFFFF)', 
                  border: '1.5px solid var(--line-strong, #6D7A6D)', 
                  borderRadius: '12px', 
                  padding: '1.5rem', 
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>📚</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--brand, #1E3F20)', marginBottom: '0.5rem' }}>
                  Parent Curriculum Explorer
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--ink-muted, #556056)', lineHeight: '1.5', marginBottom: '1rem' }}>
                  Browse authentic reviews from experienced parents. Filter by grade level (K–12), learning style, and subject area.
                </p>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--brand, #1E3F20)', textDecoration: 'underline' }}>
                  Search Curricula &rarr;
                </span>
              </div>

              {/* Card 2: Community */}
              <div 
                onClick={() => setActiveTab('community')}
                style={{ 
                  background: 'var(--surface-card, #FFFFFF)', 
                  border: '1.5px solid var(--line-strong, #6D7A6D)', 
                  borderRadius: '12px', 
                  padding: '1.5rem', 
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>💬</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--brand, #1E3F20)', marginBottom: '0.5rem' }}>
                  Community Discussion Boards
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--ink-muted, #556056)', lineHeight: '1.5', marginBottom: '1rem' }}>
                  Join moderated channels for Curriculum Q&A, High School Prep, and Teaching Tips. Filter topics using custom parent hashtags (`#Math`, `#SpecialNeeds`).
                </p>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--brand, #1E3F20)', textDecoration: 'underline' }}>
                  Join Discussions &rarr;
                </span>
              </div>

              {/* Card 3: Field Trips */}
              <div 
                onClick={() => setActiveTab('fieldtrips')}
                style={{ 
                  background: 'var(--surface-card, #FFFFFF)', 
                  border: '1.5px solid var(--line-strong, #6D7A6D)', 
                  borderRadius: '12px', 
                  padding: '1.5rem', 
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>🌲</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--brand, #1E3F20)', marginBottom: '0.5rem' }}>
                  Co-op & Field Trip Registry
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--ink-muted, #556056)', lineHeight: '1.5', marginBottom: '1rem' }}>
                  Discover local group outings, museum discount days, and co-op gatherings organised by fellow homeschool families.
                </p>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--brand, #1E3F20)', textDecoration: 'underline' }}>
                  View Outings &rarr;
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* TABS 2: CURRICULA EXPLORER              */}
        {/* ======================================= */}
        {activeTab === 'explorer' && (
          <div>
            <header className="content-header">
              <div>
                <h1 className="page-title">Curriculum Explorer</h1>
              </div>
              {(!currentUser || currentUser.role !== 'Student') && (
                <button className="btn btn-primary" onClick={() => setShowCurriculumModal(true)}>
                  <PlusIcon /> Submit Curriculum Review
                </button>
              )}
            </header>

            <div className="explorer-container">
              {/* Left Column Filters */}
              <aside className="filter-sidebar">
                <div className="filter-title">
                  <strong>Filter Reviews</strong>
                  <span className="filter-clear" onClick={handleClearFilters}>Clear All</span>
                </div>

                {/* Keyword Search */}
                <div className="filter-group">
                  <div className="search-input-wrapper">
                    <input 
                      type="text" 
                      className="search-input" 
                      placeholder="Search curricula..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <svg className="search-icon" viewBox="0 0 24 24">
                      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                  </div>
                </div>

                {/* Subject Filter */}
                <div className="filter-group">
                  <h4 className="filter-group-title">Subject</h4>
                  <ul className="option-list">
                    {['Math', 'Science', 'Language Arts', 'History', 'Art & Music', 'All Subjects'].map(subj => (
                      <li className="option-item" key={subj} onClick={() => handleSubjectToggle(subj)}>
                        <input 
                          type="checkbox" 
                          checked={selectedSubjects.includes(subj)}
                          onChange={() => {}} // Controlled by li click
                        />
                        <span>{subj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Grade Level Filter (Checkboxes for K-12) */}
                <div className="filter-group">
                  <h4 className="filter-group-title">Grade Level</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(44px, 1fr))', gap: '0.35rem', marginTop: '0.5rem' }}>
                    {['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(grade => {
                      const isSelected = selectedGrades.includes(grade);
                      return (
                        <button
                          type="button"
                          key={grade}
                          onClick={() => handleGradeToggle(grade)}
                          style={{
                            padding: '0.3rem 0.15rem',
                            border: '1px solid var(--color-border)',
                            borderRadius: '6px',
                            background: isSelected ? 'var(--color-primary)' : 'var(--color-bg)',
                            color: isSelected ? 'white' : 'var(--color-text-dark)',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            textAlign: 'center',
                            fontSize: '0.75rem'
                          }}
                        >
                          {grade}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Delivery format */}
                <div className="filter-group">
                  <h4 className="filter-group-title">Delivery Format</h4>
                  <ul className="option-list">
                    {[
                      { key: 'online', label: 'Online' },
                      { key: 'printable', label: 'Printable' },
                      { key: 'consumable', label: 'Consumable (Workbooks)' }
                    ].map(del => (
                      <li className="option-item" key={del.key} onClick={() => handleDeliveryToggle(del.key)}>
                        <input 
                          type="checkbox" 
                          checked={selectedDeliveries.includes(del.key)}
                          onChange={() => {}}
                        />
                        <span>{del.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Worldview Filter */}
                <div className="filter-group">
                  <h4 className="filter-group-title">Worldview</h4>
                  <ul className="option-list">
                    {[
                      { key: 'secular', label: 'Secular' },
                      { key: 'nonsecular', label: 'Nonsecular / Faith-based' }
                    ].map(wv => (
                      <li className="option-item" key={wv.key} onClick={() => handleWorldviewToggle(wv.key)}>
                        <input 
                          type="checkbox" 
                          checked={selectedWorldviews.includes(wv.key)}
                          onChange={() => {}}
                        />
                        <span>{wv.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Methodology Filter */}
                <div className="filter-group">
                  <h4 className="filter-group-title">Methodology</h4>
                  <ul className="option-list">
                    {[
                      { key: 'spiral', label: 'Spiral Review' },
                      { key: 'mastery', label: 'Mastery / Unit Study' }
                    ].map(meth => (
                      <li className="option-item" key={meth.key} onClick={() => handleMethodologyToggle(meth.key)}>
                        <input 
                          type="checkbox" 
                          checked={selectedMethodologies.includes(meth.key)}
                          onChange={() => {}}
                        />
                        <span>{meth.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cost range */}
                <div className="filter-group">
                  <h4 className="filter-group-title">Cost Range</h4>
                  <ul className="option-list">
                    {['Free', '$', '$$', '$$$'].map(c => (
                      <li className="option-item" key={c} onClick={() => handleCostToggle(c)}>
                        <input 
                          type="checkbox" 
                          checked={selectedCosts.includes(c)}
                          onChange={() => {}}
                        />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Checklist options */}
                <div className="filter-group">
                  <h4 className="filter-group-title">Features</h4>
                  <ul className="option-list">
                    <li className="option-item" onClick={() => setFeaturesFilter(prev => ({...prev, onlineResources: !prev.onlineResources}))}>
                      <input type="checkbox" checked={featuresFilter.onlineResources} onChange={() => {}} />
                      <span>Online Resources</span>
                    </li>
                    <li className="option-item" onClick={() => setFeaturesFilter(prev => ({...prev, selfPaced: !prev.selfPaced}))}>
                      <input type="checkbox" checked={featuresFilter.selfPaced} onChange={() => {}} />
                      <span>Self Paced</span>
                    </li>
                    <li className="option-item" onClick={() => setFeaturesFilter(prev => ({...prev, classParticipation: !prev.classParticipation}))}>
                      <input type="checkbox" checked={featuresFilter.classParticipation} onChange={() => {}} />
                      <span>Interactive Live Classes</span>
                    </li>
                    <li className="option-item" onClick={() => setFeaturesFilter(prev => ({...prev, videos: !prev.videos}))}>
                      <input type="checkbox" checked={featuresFilter.videos} onChange={() => {}} />
                      <span>Video Lessons</span>
                    </li>
                  </ul>
                </div>
              </aside>

              {/* Right Column Curriculum Grid */}
              <section className="results-grid">
                {filteredCurricula.length > 0 ? (
                  filteredCurricula.map(item => (
                    <article 
                      className="curriculum-card" 
                      key={item.id}
                      onClick={() => setSelectedCurriculumDetail(item)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div>
                        <div className="card-header-row">
                          <span className="subject-badge">{item.subject}</span>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-accent-oak)' }}>
                            {item.cost}
                          </span>
                        </div>
                        <h3 className="card-title">{item.name}</h3>
                        <div style={{ marginBottom: '0.75rem' }}>
                          <Rating value={item.rating} />
                        </div>
                        <p className="card-desc">{item.description}</p>
                        
                        <div className="details-grid">
                          <div className="detail-item">
                            <span>Format: <strong>{item.delivery}</strong></span>
                          </div>
                          <div className="detail-item">
                            <span>Grouping: <strong>{item.grouping}</strong></span>
                          </div>
                          <div className="detail-item">
                            <span>Worldview: <strong>{item.worldview}</strong></span>
                          </div>
                          <div className="detail-item">
                            <span>Answer Key: <strong>{item.answerKey}</strong></span>
                          </div>
                          <div className="detail-item">
                            <span>Review Type: <strong>{item.methodology}</strong></span>
                          </div>
                          {item.selfPaced && (
                            <div className="detail-item">
                              <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>✓ Self Paced</span>
                            </div>
                          )}
                          {item.gradeLevels && item.gradeLevels.length > 0 && (
                            <div className="detail-item" style={{ gridColumn: '1 / -1', marginTop: '0.25rem' }}>
                              <span>Grades: </span>
                              <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '4px', marginLeft: '4px' }}>
                                {item.gradeLevels.map(g => (
                                  <span key={g} style={{
                                    background: 'var(--color-accent-sage-light)',
                                    color: 'var(--color-primary)',
                                    padding: '1px 6px',
                                    borderRadius: '4px',
                                    fontSize: '0.7rem',
                                    fontWeight: '700'
                                  }}>{g}</span>
                                ))}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {item.favoritePart && (
                        <div className="card-favorite-block" style={{ marginTop: '0.5rem' }}>
                          <strong>Favorite Part</strong>
                          "{item.favoritePart}"
                        </div>
                      )}
                    </article>
                  ))
                ) : (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                    <h3>No curricula reviews matched your filters.</h3>
                    <p style={{ marginTop: '0.5rem' }}>Try clearing some filters or write a review for it!</p>
                  </div>
                )}
              </section>
            </div>
          </div>
        )}



        {/* ======================================= */}
        {/* TABS 4: FIELD TRIPS                     */}
        {/* ======================================= */}
        {activeTab === 'fieldtrips' && (
          <div>
            <header className="content-header">
              <div>
                <h1 className="page-title">Field Trip Finder</h1>
              </div>
              {(!currentUser || currentUser.role !== 'Student') && (
                <button className="btn btn-primary" onClick={() => setShowTripModal(true)}>
                  <PlusIcon /> Share Field Trip
                </button>
              )}
            </header>

            {/* Field Trip Filters Bar */}
            <div className="trip-filters-bar" style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              background: 'var(--color-card)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              boxShadow: 'var(--shadow-sm)'
            }}>
              {/* Keyword Search */}
              <div style={{ flex: '1 1 240px', position: 'relative' }}>
                <input 
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '2.25rem', height: '42px' }}
                  placeholder="Search city, state, name, or zip..."
                  value={tripSearchQuery}
                  onChange={(e) => setTripSearchQuery(e.target.value)}
                />
                <svg className="search-icon" viewBox="0 0 24 24" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', position: 'absolute', width: '18px', height: '18px', fill: 'var(--color-text-muted)' }}>
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
              </div>

              {/* Subject Dropdown */}
              <div style={{ flex: '0 1 180px' }}>
                <select
                  className="form-control"
                  style={{ height: '42px', fontWeight: '500' }}
                  value={tripSelectedSubject}
                  onChange={(e) => setTripSelectedSubject(e.target.value)}
                >
                  <option value="All">All Subjects</option>
                  <option value="Science">Science & Biology</option>
                  <option value="History">History & Social Studies</option>
                  <option value="Art & Music">Art & Creative Expression</option>
                  <option value="Mathematics">Practical Math/STEM</option>
                </select>
              </div>

              {/* Grade Dropdown */}
              <div style={{ flex: '0 1 180px' }}>
                <select
                  className="form-control"
                  style={{ height: '42px', fontWeight: '500' }}
                  value={tripSelectedGrade}
                  onChange={(e) => setTripSelectedGrade(e.target.value)}
                >
                  <option value="All">All Grades</option>
                  <option value="Elementary">Elementary Recommendation</option>
                  <option value="Middle">Middle School Recommendation</option>
                  <option value="High">High School Recommendation</option>
                </select>
              </div>

              {/* Clear button if active filters */}
              {(tripSearchQuery || tripSelectedSubject !== 'All' || tripSelectedGrade !== 'All') && (
                <button 
                  type="button"
                  className="btn btn-secondary"
                  style={{ height: '42px', padding: '0 1.25rem', borderRadius: 'var(--radius-sm)' }}
                  onClick={() => {
                    setTripSearchQuery('');
                    setTripSelectedSubject('All');
                    setTripSelectedGrade('All');
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>

            {filteredFieldTrips.length > 0 && (
              <div id="field-trip-map" className="map-container"></div>
            )}

            <section className="trips-grid">
              {filteredFieldTrips.map(trip => (
                <article className="trip-card" key={trip.id} onClick={() => setSelectedTripDetail(trip)} style={{ cursor: 'pointer' }}>
                  <div>
                    <div className="card-header-row">
                      <span className="subject-badge">{trip.subject}</span>
                      <Rating value={trip.rating} />
                    </div>
                    <h3 className="trip-title">{trip.name}</h3>
                    <div className="trip-location">
                      <PinIcon />
                      <span>{trip.location}{trip.city ? `, ${trip.city}` : ''}{trip.state ? `, ${trip.state}` : ''}</span>
                    </div>
                    <p className="trip-desc">{trip.description}</p>
                  </div>

                  <div className="trip-meta">
                    <span style={{ color: 'var(--color-accent-oak)' }}>Cost: {trip.cost.toUpperCase()}</span>
                    <span>Target: {trip.gradeRecommendation}</span>
                  </div>
                  {isModeratorOrOwner(currentUser, trip.userId) && (
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFieldTrip(trip.id);
                      }}
                      style={{ marginTop: '0.75rem', width: '100%', background: 'var(--danger-wash, #FBE9E7)', color: 'var(--danger, #A0201A)', border: '1px solid var(--danger, #A0201A)', borderRadius: '6px', fontWeight: '700', padding: '6px' }}
                    >
                      🗑️ Remove Field Trip
                    </button>
                  )}
                </article>
              ))}
              {filteredFieldTrips.length === 0 && (
                <p style={{ gridColumn: '1 / -1', color: 'var(--color-text-muted)', textAlign: 'center', padding: '3rem' }}>
                  {fieldTrips.length === 0 
                    ? "No field trips listed yet. Share one to populate the directory!" 
                    : "No field trips matched your filters. Try clearing them!"}
                </p>
              )}
            </section>
          </div>
        )}

        {/* ======================================= */}
        {/* TABS 5: MOMS' BUSINESS BOARD            */}
        {/* ======================================= */}
        {activeTab === 'businesses' && (
          <div>
            <header className="content-header">
              <div>
                <h1 className="page-title">Business Board</h1>
              </div>
              {(!currentUser || currentUser.role !== 'Student') && (
                <button className="btn btn-primary" onClick={() => setShowAdModal(true)}>
                  <PlusIcon /> Advertise Business
                </button>
              )}
            </header>

            <div className="explorer-container">
              {/* Business Ads Filters */}
              <aside className="filter-sidebar">
                <div className="filter-title">
                  <strong>Filter Listings</strong>
                  <span className="filter-clear" onClick={() => {
                    setAdSearchQuery('');
                    setSelectedAdCategory('All');
                    setAdSelectedType('All');
                  }}>Clear</span>
                </div>

                {/* Keyword Search */}
                <div className="filter-group">
                  <div className="search-input-wrapper">
                    <input 
                      type="text" 
                      className="search-input" 
                      placeholder="Search directory..." 
                      value={adSearchQuery}
                      onChange={(e) => setAdSearchQuery(e.target.value)}
                    />
                    <svg className="search-icon" viewBox="0 0 24 24">
                      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                  </div>
                </div>

                {/* Category selection */}
                <div className="filter-group">
                  <h4 className="filter-group-title">Category</h4>
                  <ul className="option-list">
                    {['All', 'Storefronts', 'Cottage Industries', 'Academic Services', 'Creative & Extracurriculars'].map(cat => (
                      <li 
                        className="option-item" 
                        key={cat} 
                        onClick={() => setSelectedAdCategory(cat)}
                        style={{ fontWeight: selectedAdCategory === cat ? '700' : 'normal', color: selectedAdCategory === cat ? 'var(--color-primary)' : 'inherit' }}
                      >
                        <input 
                          type="radio" 
                          name="ad-category"
                          checked={selectedAdCategory === cat}
                          onChange={() => {}}
                        />
                        <span>{cat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Business Type selection */}
                <div className="filter-group">
                  <h4 className="filter-group-title">Business Type</h4>
                  <select 
                    className="form-control"
                    value={adSelectedType}
                    onChange={(e) => setAdSelectedType(e.target.value)}
                    style={{ width: '100%', height: '40px', fontWeight: '500' }}
                  >
                    {uniqueBusinessTypes.map(type => (
                      <option key={type} value={type}>{type === 'All' ? 'All Types' : type}</option>
                    ))}
                  </select>
                </div>
              </aside>

              {/* Directory of Ads */}
              <section className="ads-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', width: '100%', height: 'fit-content' }}>
                {filteredBusinessAds.map(ad => (
                  <article className="ad-card" key={ad.id} onClick={() => setSelectedAdDetail(ad)} style={{ cursor: 'pointer' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                        <span className="ad-category">{ad.category}</span>
                        {ad.businessType && (
                          <span style={{ fontSize: '0.75rem', background: 'var(--color-accent-oak-light)', color: 'var(--color-accent-oak)', padding: '0.25rem 0.75rem', borderRadius: '50px', fontWeight: '700' }}>
                            {ad.businessType}
                          </span>
                        )}
                      </div>
                      <h3 className="ad-name">{ad.businessName}</h3>
                      <span className="ad-owner">Owner: <strong>{ad.owner}</strong></span>
                      <p className="ad-desc" style={{ marginTop: '0.75rem' }}>{ad.description}</p>
                    </div>

                    <div className="ad-footer">
                      <span className="ad-contact">📧 {ad.contact}</span>
                      {ad.link && (
                        <a href={ad.link} target="_blank" rel="noreferrer" className="ad-link" onClick={(e) => e.stopPropagation()}>
                          Website <ExternalLinkIcon />
                        </a>
                      )}
                    </div>
                    {isModeratorOrOwner(currentUser, ad.userId) && (
                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBusinessAd(ad.id);
                        }}
                        style={{ marginTop: '0.75rem', width: '100%', background: 'var(--danger-wash, #FBE9E7)', color: 'var(--danger, #A0201A)', border: '1px solid var(--danger, #A0201A)', borderRadius: '6px', fontWeight: '700', padding: '6px' }}
                      >
                        🗑️ Remove Business Listing
                      </button>
                    )}
                  </article>
                ))}
                {filteredBusinessAds.length === 0 && (
                  <p style={{ gridColumn: '1 / -1', color: 'var(--color-text-muted)', textAlign: 'center', padding: '3rem' }}>
                    {businessAds.length === 0 
                      ? "No storefront or cottage industry listings yet. Post your business here!" 
                      : "No listings matched your filter criteria."}
                  </p>
                )}
              </section>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* TABS: COMMUNITY DISCUSSION BOARDS       */}
        {/* ======================================= */}
        {activeTab === 'community' && (
          <div>
            <header className="content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 className="page-title">Community Discussion Board</h1>
                <p style={{ color: 'var(--ink-muted, #556056)', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
                  Ask questions, share recommendations, and connect with fellow homeschool families.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setShowRulesModal(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  🌿 Rules & Moderation
                </button>
                {(!currentUser || currentUser.role !== 'Student') && (
                  <button 
                    className="btn btn-primary" 
                    onClick={() => setShowRequestModal(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    📝 Request a New Discussion
                  </button>
                )}
              </div>
            </header>

            {requestSuccess && (
              <div style={{ marginBottom: '1rem' }} onClick={() => setRequestSuccess(null)}>
                <Notice kind="success">{requestSuccess}</Notice>
              </div>
            )}

            {/* COMMUNITY GUIDELINES & MODERATION BANNER */}
            <div style={{ 
              background: 'var(--brand-wash, #E4EDE4)', 
              border: '1.5px solid var(--line-strong, #6D7A6D)', 
              borderRadius: '8px', 
              padding: '0.85rem 1.25rem', 
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.3rem' }}>🛡️</span>
                <div>
                  <strong style={{ color: 'var(--ink, #1B201C)', fontSize: '0.9rem' }}>Family-Friendly & Actively Moderated Community</strong>
                  <div style={{ fontSize: '0.8rem', color: 'var(--ink-muted, #556056)' }}>
                    All posts and replies are overseen by Community Moderators to keep our space family-friendly, civil, and encouraging.
                  </div>
                </div>
              </div>
              <button 
                className="btn btn-sm btn-secondary"
                onClick={() => setShowRulesModal(true)}
                style={{ fontSize: '0.75rem', padding: '4px 10px' }}
              >
                Read Guidelines
              </button>
            </div>

            <div className="explorer-container">
              {/* CATEGORY & TAG SIDEBAR FILTERS */}
              <aside className="filter-sidebar">
                <div className="filter-title">
                  <strong>Filter Discussions</strong>
                  <span className="filter-clear" onClick={() => { setCommunityCategory('all'); setCommunitySearchTag(''); setCommunitySearchKeyword(''); }}>Clear All</span>
                </div>

                {/* Keyword Search Input */}
                <div className="filter-group">
                  <h4 className="filter-group-title">Search Discussions</h4>
                  <div className="search-input-wrapper">
                    <input 
                      type="text" 
                      className="search-input" 
                      placeholder="Search questions, topics, author..." 
                      value={communitySearchKeyword}
                      onChange={(e) => setCommunitySearchKeyword(e.target.value)}
                    />
                    <svg className="search-icon" viewBox="0 0 24 24">
                      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                  </div>
                </div>

                {/* Official Channels */}
                <div className="filter-group">
                  <h4 className="filter-group-title">Discussion Channels</h4>
                  <ul className="option-list">
                    {[
                      { id: 'all', label: '🌐 All Discussions' },
                      { id: 'curriculum-qa', label: '📚 Curriculum Q&A' },
                      { id: 'coops-trips', label: '🌲 Co-ops & Field Trips' },
                      { id: 'prep', label: '🎓 High School & College Prep' },
                      { id: 'swap', label: '🎒 Buy / Sell / Swap' },
                      { id: 'tips', label: '💡 Teaching Tips & Advice' },
                      { id: 'lounge', label: '💬 General Lounge' }
                    ].map(cat => (
                      <li 
                        className="option-item" 
                        key={cat.id}
                        onClick={() => setCommunityCategory(cat.id)}
                        style={{ 
                          fontWeight: communityCategory === cat.id ? '700' : '500', 
                          color: communityCategory === cat.id ? 'var(--brand, #1E3F20)' : 'inherit',
                          background: communityCategory === cat.id ? 'var(--brand-wash, #E4EDE4)' : 'transparent',
                          borderRadius: '4px',
                          padding: '0.4rem 0.5rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <span>{cat.label}</span>
                        {isModeratorOrOwner(currentUser) && cat.id !== 'all' && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCategory(cat.id);
                            }}
                            title="Remove channel"
                            style={{ background: 'none', border: 'none', color: 'var(--danger, #A0201A)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '800', padding: '0 4px' }}
                          >
                            ×
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Filter by Tag Input */}
                <div className="filter-group">
                  <h4 className="filter-group-title">Filter by Custom Tag</h4>
                  <div className="search-input-wrapper">
                    <input 
                      type="text"
                      className="search-input"
                      placeholder="e.g. #Math, #HighSchool..."
                      value={communitySearchTag}
                      onChange={(e) => setCommunitySearchTag(e.target.value)}
                    />
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--ink-muted, #556056)', marginTop: '0.4rem' }}>
                    💡 Tip: Click any tag chip on a post to filter discussions instantly.
                  </div>
                </div>
              </aside>

              {/* THREAD LIST */}
              <section className="business-grid" style={{ gridTemplateColumns: '1fr' }}>
                {(communitySearchKeyword || communitySearchTag) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    {communitySearchKeyword && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--ink-muted, #556056)' }}>Search Keyword:</span>
                        <span className="res-badge" style={{ background: 'var(--brand, #1E3F20)', color: '#ffffff', fontWeight: '700' }}>
                          "{communitySearchKeyword}"
                        </span>
                        <button 
                          onClick={() => setCommunitySearchKeyword('')}
                          style={{ background: 'none', border: 'none', color: 'var(--danger, #A0201A)', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}
                        >
                          Clear
                        </button>
                      </div>
                    )}
                    {communitySearchTag && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--ink-muted, #556056)' }}>Tag Filter:</span>
                        <span className="res-badge" style={{ background: 'var(--brand, #1E3F20)', color: '#ffffff', fontWeight: '700' }}>
                          {communitySearchTag.startsWith('#') ? communitySearchTag : `#${communitySearchTag}`}
                        </span>
                        <button 
                          onClick={() => setCommunitySearchTag('')}
                          style={{ background: 'none', border: 'none', color: 'var(--danger, #A0201A)', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {posts
                  .filter(post => {
                    const matchesCategory = communityCategory === 'all' || post.category === communityCategory;
                    const cleanTagQuery = communitySearchTag.toLowerCase().replace('#', '').trim();
                    const matchesTag = !cleanTagQuery || (post.tags && post.tags.some(t => t.toLowerCase().includes(cleanTagQuery)));
                    const cleanKeyword = communitySearchKeyword.toLowerCase().trim();
                    const matchesKeyword = !cleanKeyword ||
                      post.title.toLowerCase().includes(cleanKeyword) ||
                      post.content.toLowerCase().includes(cleanKeyword) ||
                      post.author.toLowerCase().includes(cleanKeyword) ||
                      (post.tags && post.tags.some(t => t.toLowerCase().includes(cleanKeyword)));
                    return matchesCategory && matchesTag && matchesKeyword;
                  })
                  .map(post => (
                    <article 
                      className="curriculum-card" 
                      key={post.id}
                      style={{ cursor: 'pointer', padding: '1.25rem' }}
                      onClick={() => setActivePostDetail(post)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--brand, #1E3F20)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>
                            {post.author.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--ink, #1B201C)' }}>{post.author}</div>
                            <span style={{ fontSize: '0.65rem', background: 'var(--oak-wash, #F6EADC)', color: 'var(--oak-text, #8A5320)', padding: '1px 6px', borderRadius: '10px', fontWeight: '800' }}>
                              {post.role || 'PARENT'}
                            </span>
                          </div>
                        </div>
                        <span className="res-badge" style={{ background: 'var(--brand-wash, #E4EDE4)', color: 'var(--brand, #1E3F20)' }}>
                          {post.categoryLabel || post.category}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--ink, #1B201C)', marginBottom: '0.5rem' }}>
                        {post.title}
                      </h3>

                      <p style={{ fontSize: '0.9rem', color: 'var(--ink-muted, #556056)', lineHeight: '1.5', marginBottom: '0.75rem' }}>
                        {post.content}
                      </p>

                      {/* CUSTOM TAG CHIPS */}
                      {post.tags && post.tags.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '0.75rem' }}>
                          {post.tags.map(tag => (
                            <span 
                              key={tag}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCommunitySearchTag(tag);
                              }}
                              style={{ 
                                fontSize: '0.75rem', 
                                background: 'var(--surface-raised, #F3F1EC)', 
                                border: '1px solid var(--line-strong, #6D7A6D)', 
                                color: 'var(--brand, #1E3F20)', 
                                padding: '2px 8px', 
                                borderRadius: '12px', 
                                fontWeight: '700',
                                cursor: 'pointer'
                              }}
                            >
                              {tag.startsWith('#') ? tag : `#${tag}`}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* CARD FOOTER METRICS */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--line-subtle, #DEE3DD)', fontSize: '0.8rem', color: 'var(--ink-muted, #556056)' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <span>💬 {post.replies ? post.replies.length : 0} Replies</span>
                          <button 
                            onClick={async (e) => {
                              e.stopPropagation();
                              const newLikes = await likeCommunityPost(post.id, post.likes);
                              setPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes: newLikes } : p));
                            }}
                            style={{ background: 'none', border: 'none', color: 'var(--brand, #1E3F20)', cursor: 'pointer', fontWeight: '700' }}
                          >
                            👍 {post.likes || 0} Helpful
                          </button>
                        </div>
                        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                          <button 
                            onClick={async (e) => {
                              e.stopPropagation();
                              await flagCommunityPost(post.id, "Flagged for moderator review");
                              alert("Post flagged for Community Moderator review. Thank you!");
                            }}
                            style={{ background: 'none', border: 'none', color: 'var(--ink-muted, #556056)', cursor: 'pointer', fontSize: '0.75rem' }}
                          >
                            🚩 Flag
                          </button>
                          {isModeratorOrOwner(currentUser, post.userId) && (
                            <button 
                              onClick={async (e) => {
                                e.stopPropagation();
                                handleDeletePost(post.id);
                              }}
                              style={{ background: 'none', border: 'none', color: 'var(--danger, #A0201A)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '800' }}
                            >
                              🗑️ Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
              </section>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* TABS 4: RECOMMENDED RESOURCES          */}
        {/* ======================================= */}
        {activeTab === 'resources' && (
          <div>
            <header className="content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 className="page-title">Online Resources</h1>
              </div>
              <div>
                {currentUser && currentUser.role !== 'Student' && (
                  <button className="btn btn-primary" onClick={() => setShowResourceModal(true)}>
                    + Submit Resource
                  </button>
                )}
              </div>
            </header>

            {currentUser && currentUser.role === 'Moderator' && (
              <div className="board-tabs" style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--color-accent-sage-light)', marginBottom: '1.5rem', paddingBottom: '0.5rem' }}>
                <button 
                  className={`tab-btn ${!showModQueue ? 'active' : ''}`}
                  onClick={() => setShowModQueue(false)}
                  style={{ background: 'none', border: 'none', color: !showModQueue ? 'var(--color-primary)' : 'var(--color-text-muted)', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', paddingBottom: '0.25rem', borderBottom: !showModQueue ? '2px solid var(--color-primary)' : 'none' }}
                >
                  Published Resources
                </button>
                <button 
                  className={`tab-btn ${showModQueue ? 'active' : ''}`}
                  onClick={() => setShowModQueue(true)}
                  style={{ background: 'none', border: 'none', color: showModQueue ? 'var(--color-primary)' : 'var(--color-text-muted)', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', paddingBottom: '0.25rem', borderBottom: showModQueue ? '2px solid var(--color-primary)' : 'none' }}
                >
                  Moderation Queue ({pendingResources.length})
                </button>
              </div>
            )}

            {showModQueue && currentUser && currentUser.role === 'Moderator' ? (
              <section className="resources-grid">
                {pendingResources.map(res => (
                  <article className="resource-card" key={res.id} style={{ border: '1px solid var(--color-accent-oak-light)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div className="res-header">
                        <span className="res-badge" style={{ background: 'var(--color-accent-oak-light)', color: 'var(--color-accent-oak)' }}>{res.subject}</span>
                        <span className="res-cost">{res.cost}</span>
                      </div>
                      <h3 className="res-name">
                        {res.name}
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500, marginLeft: '0.5rem' }}>
                          ({res.type === 'website' ? 'Web Link' : 'Video Channel'})
                        </span>
                      </h3>
                      <p className="res-desc">{res.description}</p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '0.5rem' }}>
                        Type: <strong>{res.type}</strong> | Link: <a href={res.link} target="_blank" rel="noreferrer">{res.link}</a>
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                      <button className="btn btn-primary" onClick={() => handleApproveResource(res.id)} style={{ flex: 1, padding: '0.5rem 0' }}>
                        Approve
                      </button>
                      <button className="btn btn-secondary" onClick={() => handleRejectResource(res.id)} style={{ flex: 1, padding: '0.5rem 0', background: '#e07a5f', color: 'white' }}>
                        Reject
                      </button>
                    </div>
                  </article>
                ))}
                {pendingResources.length === 0 && (
                  <p style={{ gridColumn: '1 / -1', color: 'var(--color-text-muted)', textAlign: 'center', padding: '3rem' }}>
                    All caught up! No resources pending moderation.
                  </p>
                )}
              </section>
            ) : (
              <section className="resources-grid">
                {resources.map(res => (
                  <article className="resource-card" key={res.id}>
                    <div>
                      <div className="res-header">
                        <span className="res-badge">{res.subject}</span>
                        <span className="res-cost">{res.cost}</span>
                      </div>
                      <h3 className="res-name">
                        {res.name} 
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500, marginLeft: '0.5rem' }}>
                          ({res.type === 'website' ? 'Web Link' : 'Video Channel'})
                        </span>
                      </h3>
                      <p className="res-desc">{res.description}</p>
                    </div>
                    <a href={res.link} target="_blank" rel="noreferrer" className="res-link">
                      Open Resource <ExternalLinkIcon />
                    </a>
                  </article>
                ))}
                {resources.length === 0 && (
                  <p style={{ gridColumn: '1 / -1', color: 'var(--color-text-muted)', textAlign: 'center', padding: '3rem' }}>
                    No resources stored.
                  </p>
                )}
              </section>
            )}
          </div>
        )}
      </main>

      {/* ======================================= */}
      {/* ACCESSIBLE MODALS LAYER (GroveDialog)   */}
      {/* ======================================= */}

      {/* 1. SHARE CURRICULUM REVIEW */}
      <GroveDialog
        open={showCurriculumModal}
        onClose={() => { setShowCurriculumModal(false); setFormError(null); setReviewingCurriculumId(null); }}
        title={reviewingCurriculumId ? `Write a Review for ${newCurriculum.name}` : "Write a Curriculum Review"}
        footer={<>
          <button type="button" className="btn btn-secondary" onClick={() => { setShowCurriculumModal(false); setFormError(null); setReviewingCurriculumId(null); }}>Cancel</button>
          <button type="submit" form="curriculum-form" className="btn btn-primary">Save Review</button>
        </>}
      >
        <form id="curriculum-form" onSubmit={handleCurriculumSubmit}>
          {formError && <Notice kind="error">{formError}</Notice>}

          <Field id="curr-name" label="Curriculum Name" required>
            <input
              type="text"
              placeholder="e.g. Beast Academy Math"
              value={newCurriculum.name}
              onChange={(e) => setNewCurriculum(prev => ({...prev, name: e.target.value}))}
              disabled={!!reviewingCurriculumId}
            />
          </Field>

          <div className="form-row">
            <Field id="curr-subject" label="Subject" required>
              <select
                value={newCurriculum.subject}
                onChange={(e) => setNewCurriculum(prev => ({...prev, subject: e.target.value}))}
              >
                <option value="Math">Math</option>
                <option value="Science">Science</option>
                <option value="Language Arts">Language Arts & Phonics</option>
                <option value="History">History & Geography</option>
                <option value="Art & Music">Art & Music</option>
                <option value="Foreign Language">Foreign Language</option>
                <option value="Elective">Elective / Other</option>
              </select>
            </Field>

            <Field id="curr-delivery" label="Format / Delivery" required>
              <select
                value={newCurriculum.delivery}
                onChange={(e) => setNewCurriculum(prev => ({...prev, delivery: e.target.value}))}
              >
                <option value="online">Online Platform</option>
                <option value="textbook">Textbook / Workbook</option>
                <option value="consumable">Consumable Workbooks</option>
                <option value="printable">Printable PDF / E-Book</option>
                <option value="unit-study">Unit Study Style</option>
              </select>
            </Field>
          </div>

          <div className="form-row">
            <Field id="curr-grouping" label="Grouping Style" required>
              <select
                value={newCurriculum.grouping}
                onChange={(e) => setNewCurriculum(prev => ({...prev, grouping: e.target.value}))}
              >
                <option value="grade">Independent (by grade)</option>
                <option value="family">Family Style (multiple ages)</option>
                <option value="co-op">Co-Op / Group Class</option>
              </select>
            </Field>

            <Field id="curr-cost" label="Cost Level" required>
              <select
                value={newCurriculum.cost}
                onChange={(e) => setNewCurriculum(prev => ({...prev, cost: e.target.value}))}
              >
                <option value="free">Free</option>
                <option value="$">$ (Under $50)</option>
                <option value="$$">$$ ($50 - $150)</option>
                <option value="$$$">$$$ (Over $150)</option>
              </select>
            </Field>
          </div>

          <div className="form-row">
            <Field id="curr-rating" label="Your Rating" required>
              <select
                value={newCurriculum.rating}
                onChange={(e) => setNewCurriculum(prev => ({...prev, rating: parseInt(e.target.value)}))}
              >
                <option value="5">⭐⭐⭐⭐⭐ (5 / 5)</option>
                <option value="4">⭐⭐⭐⭐ (4 / 5)</option>
                <option value="3">⭐⭐⭐ (3 / 5)</option>
                <option value="2">⭐⭐ (2 / 5)</option>
                <option value="1">⭐ (1 / 5)</option>
              </select>
            </Field>

            <Field id="curr-answerkey" label="Answer Key Availability" required>
              <select
                value={newCurriculum.answerKey}
                onChange={(e) => setNewCurriculum(prev => ({...prev, answerKey: e.target.value}))}
              >
                <option value="provided">Included / Free</option>
                <option value="extra">Extra Purchase Required</option>
                <option value="self-graded">Self-Graded / Not Needed</option>
              </select>
            </Field>
          </div>

          <div className="form-row">
            <Field id="curr-methodology" label="Educational Methodology" required>
              <select
                value={newCurriculum.methodology}
                onChange={(e) => setNewCurriculum(prev => ({...prev, methodology: e.target.value}))}
              >
                <option value="mastery">Mastery (deep-dive focus)</option>
                <option value="spiral">Spiral Review (incremental steps)</option>
                <option value="unschool">Interest-Led / Unschooling</option>
              </select>
            </Field>

            <Field id="curr-worldview" label="Worldview Focus" required>
              <select
                value={newCurriculum.worldview}
                onChange={(e) => setNewCurriculum(prev => ({...prev, worldview: e.target.value}))}
              >
                <option value="secular">Secular</option>
                <option value="nonsecular">Faith-Based / Non-Secular</option>
                <option value="neutral">Secular-Friendly / Neutral</option>
              </select>
            </Field>
          </div>

          <fieldset className="field-group">
            <legend>Target Grade Levels</legend>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '8px' }}>
              {['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(grade => (
                <label className="checkbox-label" key={grade}>
                  <input
                    type="checkbox"
                    checked={gradeLevelsSelected.includes(grade)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setGradeLevelsSelected(prev => [...prev, grade]);
                      } else {
                        setGradeLevelsSelected(prev => prev.filter(g => g !== grade));
                      }
                    }}
                  />
                  <span>Grade {grade}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="field-group">
            <legend>Key Features</legend>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={newCurriculum.onlineResources}
                  onChange={(e) => setNewCurriculum(prev => ({...prev, onlineResources: e.target.checked}))}
                />
                <span>Includes digital resources / links</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={newCurriculum.selfPaced}
                  onChange={(e) => setNewCurriculum(prev => ({...prev, selfPaced: e.target.checked}))}
                />
                <span>Self-Paced / Child-led</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={newCurriculum.classParticipation}
                  onChange={(e) => setNewCurriculum(prev => ({...prev, classParticipation: e.target.checked}))}
                />
                <span>Requires group/class attendance</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={newCurriculum.videos}
                  onChange={(e) => setNewCurriculum(prev => ({...prev, videos: e.target.checked}))}
                />
                <span>Includes video instruction</span>
              </label>
            </div>
          </fieldset>

          <Field id="curr-description" label="Overall Description" required>
            <textarea
              className="form-control"
              rows="6"
              maxLength={3000}
              placeholder="Review explanation of the curriculum structure..."
              value={newCurriculum.description}
              onChange={(e) => setNewCurriculum(prev => ({...prev, description: e.target.value}))}
            />
          </Field>
          <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '-0.75rem', marginBottom: '1rem' }}>
            {(newCurriculum.description || '').length} / 3000 characters
          </div>

          <Field id="curr-favorite" label="Your Favorite Part">
            <textarea
              className="form-control"
              rows="3"
              maxLength={500}
              placeholder="What did you and your students love most?"
              value={newCurriculum.favoritePart}
              onChange={(e) => setNewCurriculum(prev => ({...prev, favoritePart: e.target.value}))}
            />
          </Field>
          <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '-0.75rem', marginBottom: '1rem' }}>
            {(newCurriculum.favoritePart || '').length} / 500 characters
          </div>
        </form>
      </GroveDialog>

      {/* 2. SHARE FIELD TRIP */}
      <GroveDialog
        open={showTripModal}
        onClose={() => { setShowTripModal(false); setFormError(null); }}
        title="Share a Field Trip Idea"
        footer={<>
          <button type="button" className="btn btn-secondary" onClick={() => { setShowTripModal(false); setFormError(null); }}>Cancel</button>
          <button type="submit" form="trip-form" className="btn btn-primary">Post Field Trip</button>
        </>}
      >
        <form id="trip-form" onSubmit={handleTripSubmit}>
          {formError && <Notice kind="error">{formError}</Notice>}

          <Field id="trip-name" label="Location / Site Name" required>
            <input
              type="text"
              placeholder="e.g. Metro Space & Rocket Museum"
              value={newTrip.name}
              onChange={(e) => setNewTrip(prev => ({...prev, name: e.target.value}))}
            />
          </Field>

          <div className="form-row">
            <Field id="trip-subject" label="Academic Focus" required>
              <select
                value={newTrip.subject}
                onChange={(e) => setNewTrip(prev => ({...prev, subject: e.target.value}))}
              >
                <option value="Science">Science & Biology</option>
                <option value="History">History & Social Studies</option>
                <option value="Art & Music">Art & Creative Expression</option>
                <option value="Mathematics">Practical Math/STEM</option>
              </select>
            </Field>

            <Field id="trip-cost" label="Cost Level" required>
              <select
                value={newTrip.cost}
                onChange={(e) => setNewTrip(prev => ({...prev, cost: e.target.value}))}
              >
                <option value="Free Admission">Free Admission</option>
                <option value="Free (Donation Encouraged)">Free (Donation Encouraged)</option>
                <option value="$">$ (Under $10)</option>
                <option value="$$">$$ ($10 - $20)</option>
                <option value="$$$">$$$ ($20+)</option>
              </select>
            </Field>
          </div>

          <div className="form-row">
            <Field id="trip-location" label="Address / General Location" required>
              <input
                type="text"
                placeholder="e.g. 100 Main St"
                value={newTrip.location}
                onChange={(e) => setNewTrip(prev => ({...prev, location: e.target.value}))}
              />
            </Field>

            <Field id="trip-grade" label="Recommended Ages/Grades (Select All That Apply)" required>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.35rem' }}>
                {[
                  'All Ages / Family Outing',
                  'Pre-K & Kindergarten (Ages 3-5)',
                  'Early Elementary (Grades K-2 / Ages 5-8)',
                  'Upper Elementary (Grades 3-5 / Ages 8-11)',
                  'Middle School (Grades 6-8 / Ages 11-14)',
                  'High School (Grades 9-12 / Ages 14-18)',
                  'Teens & Adults (13+)'
                ].map(option => {
                  const isSelected = selectedTripGrades.includes(option);
                  return (
                    <button
                      type="button"
                      key={option}
                      onClick={() => handleTripGradeToggle(option)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '20px',
                        border: isSelected ? '1.5px solid var(--brand, #1E3F20)' : '1px solid var(--line-strong, #6D7A6D)',
                        background: isSelected ? 'var(--brand, #1E3F20)' : 'var(--surface-card, #FFFFFF)',
                        color: isSelected ? '#FFFFFF' : 'var(--ink, #1B201C)',
                        fontSize: '0.75rem',
                        fontWeight: isSelected ? '700' : '500',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      <span>{isSelected ? '✓' : '+'}</span>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>
            </Field>
          </div>

          <div className="form-row">
            <Field id="trip-city" label="City" required>
              <input
                type="text"
                placeholder="e.g. Austin"
                value={newTrip.city}
                onChange={(e) => setNewTrip(prev => ({...prev, city: e.target.value}))}
              />
            </Field>

            <Field id="trip-state" label="State" required>
              <input
                type="text"
                placeholder="e.g. TX"
                value={newTrip.state}
                onChange={(e) => setNewTrip(prev => ({...prev, state: e.target.value}))}
              />
            </Field>
          </div>

          <div className="form-row">
            <Field id="trip-zip" label="Zip Code (Optional)">
              <input
                type="text"
                placeholder="e.g. 78754"
                value={newTrip.zip}
                onChange={(e) => setNewTrip(prev => ({...prev, zip: e.target.value}))}
              />
            </Field>

            <Field id="trip-web" label="Website Link (Optional)">
              <input
                type="url"
                placeholder="e.g. https://www.mos.org"
                value={newTrip.websiteUrl}
                onChange={(e) => setNewTrip(prev => ({...prev, websiteUrl: e.target.value}))}
              />
            </Field>
          </div>

          <Field id="trip-rating" label="Rating" required>
            <select
              value={newTrip.rating}
              onChange={(e) => setNewTrip(prev => ({...prev, rating: parseInt(e.target.value)}))}
            >
              <option value="5">⭐⭐⭐⭐⭐ (5 / 5)</option>
              <option value="4">⭐⭐⭐⭐ (4 / 5)</option>
              <option value="3">⭐⭐⭐ (3 / 5)</option>
              <option value="2">⭐⭐ (2 / 5)</option>
              <option value="1">⭐ (1 / 5)</option>
            </select>
          </Field>

          <Field id="trip-desc" label="Details / Description" required>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Review instructions, discount codes, or highlight exhibits..."
              value={newTrip.description}
              onChange={(e) => setNewTrip(prev => ({...prev, description: e.target.value}))}
            />
          </Field>
        </form>
      </GroveDialog>

      {/* 3. List Business Ad */}
      <GroveDialog
        open={showAdModal}
        onClose={() => { setShowAdModal(false); setFormError(null); }}
        title="List on Business Board"
        footer={<>
          <button type="button" className="btn btn-secondary" onClick={() => { setShowAdModal(false); setFormError(null); }}>Cancel</button>
          <button type="submit" form="ad-form" className="btn btn-primary">Publish Ad</button>
        </>}
      >
        <form id="ad-form" onSubmit={handleAdSubmit}>
          {formError && <Notice kind="error">{formError}</Notice>}

          <Field id="ad-name" label="Business or Service Title" required>
            <input
              type="text"
              placeholder="e.g. Phonics Tutoring & Reading Services"
              value={newAd.businessName}
              onChange={(e) => setNewAd(prev => ({...prev, businessName: e.target.value}))}
            />
          </Field>

          <Field id="ad-type" label="Business Type / Specialty" required>
            <input
              type="text"
              placeholder="e.g. Baked Goods, IT Support, Music Lessons, Tutoring"
              value={newAd.businessType}
              onChange={(e) => setNewAd(prev => ({...prev, businessType: e.target.value}))}
            />
          </Field>

          <div className="form-row">
            <Field id="ad-owner" label="Contact Person (Owner Name)" required>
              <input
                type="text"
                placeholder="e.g. Sarah Jenkins"
                value={newAd.owner}
                onChange={(e) => setNewAd(prev => ({...prev, owner: e.target.value}))}
              />
            </Field>

            <Field id="ad-cat" label="Category" required>
              <select
                value={newAd.category}
                onChange={(e) => setNewAd(prev => ({...prev, category: e.target.value}))}
              >
                <option value="Cottage Industries">Cottage Industries</option>
                <option value="Storefronts">Storefronts</option>
                <option value="Academic Services">Academic Services</option>
                <option value="Creative & Extracurriculars">Creative & Extracurriculars</option>
              </select>
            </Field>
          </div>

          <div className="form-row">
            <Field id="ad-contact" label="Contact Email / Phone" required>
              <input
                type="text"
                placeholder="e.g. contact@email.com"
                value={newAd.contact}
                onChange={(e) => setNewAd(prev => ({...prev, contact: e.target.value}))}
              />
            </Field>

            <Field id="ad-link" label="Website Link (Optional)">
              <input
                type="url"
                placeholder="e.g. https://www.mybusiness.com"
                value={newAd.link}
                onChange={(e) => setNewAd(prev => ({...prev, link: e.target.value}))}
              />
            </Field>
          </div>

          <Field id="ad-desc" label="Description of Business / Service" required>
            <textarea
              className="form-control"
              rows="4"
              placeholder="Outline your tutoring rates, lessons structure, co-op dates, or products pricing..."
              value={newAd.description}
              onChange={(e) => setNewAd(prev => ({...prev, description: e.target.value}))}
            />
          </Field>
        </form>
      </GroveDialog>



      {/* 5. SUBMIT RESOURCE */}
      <GroveDialog
        open={showResourceModal}
        onClose={() => { setShowResourceModal(false); setFormError(null); }}
        title="Submit Recommended Resource"
        footer={<>
          <button type="button" className="btn btn-secondary" onClick={() => { setShowResourceModal(false); setFormError(null); }}>Cancel</button>
          <button type="submit" form="resource-form" className="btn btn-primary">Submit for Approval</button>
        </>}
      >
        <form id="resource-form" onSubmit={handleResourceSubmit}>
          {formError && <Notice kind="error">{formError}</Notice>}

          <Field id="res-form-name" label="Resource Name / Title" required>
            <input
              type="text"
              placeholder="e.g. Khan Academy"
              value={newResource.name}
              onChange={(e) => setNewResource(prev => ({...prev, name: e.target.value}))}
            />
          </Field>

          <div className="form-row">
            <Field id="res-form-subject" label="Subject" required>
              <select
                value={newResource.subject}
                onChange={(e) => setNewResource(prev => ({...prev, subject: e.target.value}))}
              >
                <option value="Math">Math</option>
                <option value="Science">Science</option>
                <option value="Language Arts">Language Arts</option>
                <option value="History">History</option>
                <option value="Foreign Language">Foreign Language</option>
                <option value="All Subjects">All Subjects</option>
                <option value="Other">Other</option>
              </select>
            </Field>

            <Field id="res-form-cost" label="Cost Range" required>
              <select
                value={newResource.cost}
                onChange={(e) => setNewResource(prev => ({...prev, cost: e.target.value}))}
              >
                <option value="free">Free</option>
                <option value="low-cost">Low Cost</option>
                <option value="subscription">Subscription</option>
              </select>
            </Field>
          </div>

          <div className="form-row">
            <Field id="res-form-type" label="Resource Type" required>
              <select
                value={newResource.type}
                onChange={(e) => setNewResource(prev => ({...prev, type: e.target.value}))}
              >
                <option value="website">Web Link / Website</option>
                <option value="video">Video Channel / Playlist</option>
                <option value="printable">Printable / Worksheet</option>
              </select>
            </Field>

            <Field id="res-form-link" label="Website URL" required>
              <input
                type="url"
                placeholder="e.g. https://www.khanacademy.org"
                value={newResource.link}
                onChange={(e) => setNewResource(prev => ({...prev, link: e.target.value}))}
              />
            </Field>
          </div>

          <Field id="res-form-desc" label="Short Description" required>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Explain why you recommend this resource..."
              value={newResource.description}
              onChange={(e) => setNewResource(prev => ({...prev, description: e.target.value}))}
            />
          </Field>
        </form>
      </GroveDialog>

      {/* 6. USER AUTHENTICATION */}
      <GroveDialog
        open={showAuthModal}
        onClose={() => { setShowAuthModal(false); setFormError(null); }}
        title={authMode === 'login' ? 'Sign In' : 'Create Account'}
        footer={<div className="form-actions" style={{ width: '100%', flexDirection: 'column', gap: '0.75rem' }}>
          <button type="submit" form="auth-form" className="btn btn-primary" style={{ width: '100%' }}>
            {authMode === 'login' ? 'Sign In' : 'Register Parent Account'}
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode(prev => prev === 'login' ? 'register' : 'login'); setFormError(null); }}
            style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {authMode === 'login' ? "Don't have an account? Register" : "Already have an account? Sign In"}
          </button>
        </div>}
        width="400px"
      >
        <form id="auth-form" onSubmit={handleAuthSubmit}>
          {formError && <Notice kind="error">{formError}</Notice>}

          {authMode === 'register' && (
            <Field id="auth-name" label="Full Name" required>
              <input
                type="text"
                placeholder="Sarah Jenkins"
                value={authForm.name}
                onChange={(e) => setAuthForm(prev => ({...prev, name: e.target.value}))}
              />
            </Field>
          )}

          <Field id="auth-email" label="Email Address" required>
            <input
              type="email"
              placeholder="parent@example.com"
              value={authForm.email}
              onChange={(e) => setAuthForm(prev => ({...prev, email: e.target.value}))}
            />
          </Field>

          <Field id="auth-pass" label="Password" required>
            <input
              type="password"
              placeholder="••••••••"
              value={authForm.password}
              onChange={(e) => setAuthForm(prev => ({...prev, password: e.target.value}))}
            />
          </Field>
        </form>
      </GroveDialog>

      {/* FAMILY & CHILD PROFILES MANAGEMENT MODAL */}
      <GroveDialog
        open={showFamilyModal}
        onClose={() => { setShowFamilyModal(false); setSubUserError(null); setSubUserSuccess(null); }}
        title="Family & Student Profiles"
        footer={<button className="btn btn-secondary" onClick={() => setShowFamilyModal(false)}>Close</button>}
        width="520px"
      >
        <div>
          {subUserSuccess && <Notice kind="success">{subUserSuccess}</Notice>}
          {subUserError && <Notice kind="error">{subUserError}</Notice>}
          {coParentSuccess && <Notice kind="success">{coParentSuccess}</Notice>}
          {coParentError && <Notice kind="error">{coParentError}</Notice>}

          {/* 1. CO-PARENTS & HOUSEHOLD MANAGERS */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--ink, #1B201C)', marginBottom: '0.5rem', fontWeight: '700' }}>👨‍👩‍👧 Household Co-Parents</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 0.75rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.75rem', background: 'var(--brand-wash, #E4EDE4)', borderRadius: '6px', border: '1.5px solid var(--line-strong, #6D7A6D)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--brand, #1E3F20)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {currentUser?.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--ink, #1B201C)' }}>{currentUser?.name}</span>
                    <div style={{ fontSize: '0.7rem', color: 'var(--ink-muted, #556056)' }}>{currentUser?.email}</div>
                  </div>
                </div>
                <span style={{ fontSize: '0.7rem', background: 'var(--oak-wash, #F6EADC)', color: 'var(--oak-text, #8A5320)', padding: '2px 8px', borderRadius: '12px', fontWeight: '800' }}>
                  ACTIVE PARENT
                </span>
              </li>
              {coParents.filter(p => p.id !== currentUser?.id).map(cop => (
                <li key={cop.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.75rem', background: 'var(--surface-raised, #F3F1EC)', borderRadius: '6px', border: '1px solid var(--line-subtle, #DEE3DD)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--brand, #1E3F20)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {cop.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--ink, #1B201C)' }}>{cop.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--ink-muted, #556056)' }}>{cop.email}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.7rem', background: 'var(--brand-wash, #E4EDE4)', color: 'var(--brand, #1E3F20)', padding: '2px 8px', borderRadius: '12px', fontWeight: '700' }}>
                    LINKED CO-PARENT
                  </span>
                </li>
              ))}
            </ul>

            <form onSubmit={handleLinkCoParentSubmit} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--ink, #1B201C)', display: 'block', marginBottom: '2px' }}>Link Another Parent Account by Email</label>
                <input 
                  type="email" 
                  placeholder="e.g. spouse@example.com" 
                  required
                  value={coParentEmailInput}
                  onChange={(e) => setCoParentEmailInput(e.target.value)}
                  style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--line-strong, #6D7A6D)', fontSize: '0.85rem' }}
                />
              </div>
              <button type="submit" className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                🔗 Link Co-Parent
              </button>
            </form>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--line-subtle, #DEE3DD)', margin: '1rem 0' }} />

          {/* 2. STUDENT PROFILES */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--ink, #1B201C)', marginBottom: '0.5rem', fontWeight: '700' }}>🎒 Household Student Profiles</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 0.75rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {subUsers.map(sub => (
                <li key={sub.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.75rem', background: 'var(--surface-raised, #F3F1EC)', borderRadius: '6px', border: '1px solid var(--line-subtle, #DEE3DD)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--oak-text, #8A5320)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {sub.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--ink, #1B201C)' }}>{sub.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--ink-muted, #556056)' }}>{sub.email}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => {
                        localStorage.setItem('grove_parent_user', JSON.stringify(currentUser));
                        setCurrentUser(sub);
                        setShowFamilyModal(false);
                      }}
                      style={{ fontSize: '0.75rem', padding: '2px 8px' }}
                    >
                      Switch Profile
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={async () => {
                        if (window.confirm(`Are you sure you want to remove ${sub.name}'s student profile?`)) {
                          await deleteSubUser(sub.id);
                          setSubUsers(prev => prev.filter(s => s.id !== sub.id));
                          setSubUserSuccess(`Removed student profile "${sub.name}".`);
                        }
                      }}
                      style={{ fontSize: '0.75rem', padding: '2px 8px', background: 'var(--danger-wash, #FBE9E7)', color: 'var(--danger, #A0201A)', border: '1px solid var(--danger, #A0201A)', borderRadius: '4px', cursor: 'pointer', fontWeight: '700' }}
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </li>
              ))}
              {subUsers.length === 0 && (
                <p style={{ color: 'var(--ink-muted, #556056)', fontSize: '0.85rem', fontStyle: 'italic', margin: '0.5rem 0' }}>No student profiles added yet. Create one below!</p>
              )}
            </ul>
          </div>

          <h4 style={{ fontSize: '0.9rem', color: 'var(--ink, #1B201C)', marginBottom: '0.75rem', fontWeight: '700' }}>Add Child or Student Profile</h4>
          <form onSubmit={handleNewSubUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Field id="sub-name" label="Child's Full Name" required>
              <input 
                type="text" 
                placeholder="e.g. Emmett H" 
                value={newSubUserForm.name}
                onChange={(e) => setNewSubUserForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </Field>
            <Field id="sub-email" label="Child's Email (used to log in)" required>
              <input 
                type="email" 
                placeholder="e.g. emmett@example.com" 
                value={newSubUserForm.email}
                onChange={(e) => setNewSubUserForm(prev => ({ ...prev, email: e.target.value }))}
              />
            </Field>
            <Field id="sub-pass" label="Child's Password" required>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={newSubUserForm.password}
                onChange={(e) => setNewSubUserForm(prev => ({ ...prev, password: e.target.value }))}
              />
            </Field>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              Create Student Profile
            </button>
          </form>

          <hr style={{ border: 'none', borderTop: '1px solid var(--line-subtle, #DEE3DD)', margin: '1.5rem 0 1rem 0' }} />

          {/* 3. DANGER ZONE: ACCOUNT DELETION */}
          <div style={{ padding: '0.85rem', borderRadius: '8px', background: 'var(--danger-wash, #FBE9E7)', border: '1px solid var(--danger, #A0201A)' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--danger, #A0201A)', margin: '0 0 0.25rem 0', fontWeight: '800' }}>
              ⚠️ Danger Zone: Delete Account & Data
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--ink-muted, #556056)', margin: '0 0 0.75rem 0', lineHeight: '1.4' }}>
              Permanently delete your parent account and any linked student profiles. This action cannot be undone.
            </p>
            <button
              type="button"
              className="btn btn-sm"
              onClick={async () => {
                if (window.confirm(`Are you sure you want to permanently delete your parent account (${currentUser?.email}) and all linked child profiles? This action cannot be undone.`)) {
                  await deleteUserAccount(currentUser.id);
                  localStorage.removeItem('grove_user');
                  localStorage.removeItem('grove_parent_user');
                  setCurrentUser(null);
                  setSubUsers([]);
                  setShowFamilyModal(false);
                  alert("Your account and linked family data have been permanently deleted.");
                }
              }}
              style={{ background: 'var(--danger, #A0201A)', color: '#FFFFFF', border: 'none', fontWeight: '700', fontSize: '0.75rem', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
            >
              🗑️ Delete My Account & Household Data
            </button>
          </div>
        </div>
      </GroveDialog>

      {/* 7. CURRICULUM DETAIL VIEW */}
      <GroveDialog
        open={!!selectedCurriculumDetail}
        onClose={() => setSelectedCurriculumDetail(null)}
        title={selectedCurriculumDetail?.name || ''}
        footer={<button className="btn btn-primary" onClick={() => setSelectedCurriculumDetail(null)}>Close Details</button>}
        width="750px"
      >
        {selectedCurriculumDetail && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              <span className="subject-badge">{selectedCurriculumDetail.subject}</span>
              <span style={{
                background: selectedCurriculumDetail.worldview === 'secular' ? 'var(--color-accent-sage-light)' : 'var(--color-accent-oak-light)',
                color: selectedCurriculumDetail.worldview === 'secular' ? 'var(--color-primary)' : 'var(--color-accent-oak)',
                padding: '0.25rem 0.75rem',
                borderRadius: '50px',
                fontSize: '0.75rem',
                fontWeight: '700',
                textTransform: 'uppercase'
              }}>
                {selectedCurriculumDetail.worldview}
              </span>
              <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--color-accent-oak)', marginLeft: 'auto' }}>
                Cost: {selectedCurriculumDetail.cost}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
              <Rating value={selectedCurriculumDetail.rating} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
              <div>
                <h4 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
                  Description
                </h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-text-dark)', marginBottom: '1.5rem', whiteSpace: 'pre-wrap' }}>
                  {selectedCurriculumDetail.description}
                </p>

                {selectedCurriculumDetail.favoritePart && (
                  <div className="card-favorite-block" style={{ padding: '1.25rem', borderRadius: '12px' }}>
                    <strong style={{ fontSize: '0.8rem', letterSpacing: '0.05em' }}>Favorite Part</strong>
                    <p style={{ fontSize: '0.9rem', fontStyle: 'italic', marginTop: '0.25rem' }}>
                      "{selectedCurriculumDetail.favoritePart}"
                    </p>
                  </div>
                )}
              </div>

              <div style={{ background: 'var(--color-bg)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--color-border)', height: 'fit-content' }}>
                <h4 style={{ color: 'var(--color-primary)', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
                  Specifications
                </h4>
                
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Format:</span>
                    <strong style={{ textTransform: 'capitalize', marginLeft: 'auto' }}>{selectedCurriculumDetail.delivery}</strong>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Grouping:</span>
                    <strong style={{ textTransform: 'capitalize', marginLeft: 'auto' }}>{selectedCurriculumDetail.grouping}</strong>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Methodology:</span>
                    <strong style={{ textTransform: 'capitalize', marginLeft: 'auto' }}>{selectedCurriculumDetail.methodology === 'spiral' ? 'Spiral Review' : 'Mastery'}</strong>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Answer Key:</span>
                    <strong style={{ textTransform: 'capitalize', marginLeft: 'auto' }}>{selectedCurriculumDetail.answerKey === 'provided' ? 'Included' : selectedCurriculumDetail.answerKey === 'extra' ? 'Extra Cost' : 'Self-Graded'}</strong>
                  </li>
                </ul>

                <h4 style={{ color: 'var(--color-primary)', marginTop: '1.5rem', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)', fontSize: '0.9rem' }}>
                  Target Grades
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {selectedCurriculumDetail.gradeLevels && selectedCurriculumDetail.gradeLevels.length > 0 ? (
                    selectedCurriculumDetail.gradeLevels.map(g => (
                      <span key={g} style={{
                        background: 'var(--color-primary)',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '700'
                      }}>
                        Grade {g}
                      </span>
                    ))
                  ) : (
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Not specified</span>
                  )}
                </div>

                <h4 style={{ color: 'var(--color-primary)', marginTop: '1.5rem', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)', fontSize: '0.9rem' }}>
                  Integrated Features
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                  <li style={{ color: selectedCurriculumDetail.onlineResources ? 'var(--color-primary)' : 'var(--color-text-muted)', fontWeight: selectedCurriculumDetail.onlineResources ? '600' : 'normal' }}>
                    {selectedCurriculumDetail.onlineResources ? '✓' : '✗'} Online Resources
                  </li>
                  <li style={{ color: selectedCurriculumDetail.selfPaced ? 'var(--color-primary)' : 'var(--color-text-muted)', fontWeight: selectedCurriculumDetail.selfPaced ? '600' : 'normal' }}>
                    {selectedCurriculumDetail.selfPaced ? '✓' : '✗'} Self Paced
                  </li>
                  <li style={{ color: selectedCurriculumDetail.classParticipation ? 'var(--color-primary)' : 'var(--color-text-muted)', fontWeight: selectedCurriculumDetail.classParticipation ? '600' : 'normal' }}>
                    {selectedCurriculumDetail.classParticipation ? '✓' : '✗'} Live Class Participation
                  </li>
                  <li style={{ color: selectedCurriculumDetail.videos ? 'var(--color-primary)' : 'var(--color-text-muted)', fontWeight: selectedCurriculumDetail.videos ? '600' : 'normal' }}>
                    {selectedCurriculumDetail.videos ? '✓' : '✗'} Video Lessons
                  </li>
                </ul>
              </div>
            </div>

            {/* Reviews Section */}
            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h4 style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)', fontSize: '1.1rem', margin: 0 }}>
                  Parent Reviews ({selectedReviews.length})
                </h4>
                {currentUser && currentUser.role === 'Parent' && (
                  <button 
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleOpenReviewForExisting(selectedCurriculumDetail)}
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                  >
                    Write a Review
                  </button>
                )}
              </div>

              {/* Reviews List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {selectedReviews.length > 0 ? (
                  selectedReviews.map(rev => (
                    <div key={rev.id} style={{ borderBottom: '1px solid var(--color-border-light)', paddingBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <Rating value={rev.rating} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink)' }}>
                          by {rev.userName}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', marginLeft: 'auto' }}>
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <p style={{ fontSize: '0.9rem', color: 'var(--ink)', margin: '0.25rem 0 0.75rem 0', lineHeight: 1.5 }}>
                        {rev.description}
                      </p>

                      {rev.favoritePart && (
                        <div className="card-favorite-block" style={{ display: 'inline-block', padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.8rem' }}>
                          <strong>Favorite Part:</strong> "{rev.favoritePart}"
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--ink-muted)', fontSize: '0.85rem', fontStyle: 'italic', textAlign: 'center', padding: '1rem 0' }}>
                    No reviews yet. Be the first to review this curriculum!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </GroveDialog>

      {/* 8. FIELD TRIP DETAIL VIEW */}
      <GroveDialog
        open={!!selectedTripDetail}
        onClose={() => setSelectedTripDetail(null)}
        title={selectedTripDetail?.name || ''}
        footer={<button className="btn btn-secondary" onClick={() => setSelectedTripDetail(null)}>Close</button>}
        width="650px"
      >
        {selectedTripDetail && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              <span className="subject-badge">{selectedTripDetail.subject}</span>
              <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--color-accent-oak)', marginLeft: 'auto' }}>
                Cost: {selectedTripDetail.cost.toUpperCase()}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <Rating value={selectedTripDetail.rating} />
            </div>

            <div style={{ background: 'var(--color-bg)', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <PinIcon />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem' }}>Address / Location</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-dark)' }}>
                    {selectedTripDetail.location}
                    {(selectedTripDetail.city || selectedTripDetail.state) ? ` (${selectedTripDetail.city || ''}, ${selectedTripDetail.state || ''} ${selectedTripDetail.zip || ''})` : ''}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Target Audience:</span>
                <strong>{selectedTripDetail.gradeRecommendation}</strong>
              </div>
            </div>

            <h4 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
              Details & Review
            </h4>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-dark)', marginBottom: '1.5rem', whiteSpace: 'pre-wrap' }}>
              {selectedTripDetail.description}
            </p>

            {selectedTripDetail.websiteUrl && (
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--color-accent-sage-light)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600 }}>Official Website:</span>
                <a href={selectedTripDetail.websiteUrl} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', textDecoration: 'none' }}>
                  Visit Site <ExternalLinkIcon />
                </a>
              </div>
            )}
          </div>
        )}
      </GroveDialog>

      {/* 9. BUSINESS AD DETAIL VIEW */}
      <GroveDialog
        open={!!selectedAdDetail}
        onClose={() => setSelectedAdDetail(null)}
        title={selectedAdDetail?.businessName || ''}
        footer={<button className="btn btn-secondary" onClick={() => setSelectedAdDetail(null)}>Close</button>}
        width="600px"
      >
        {selectedAdDetail && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              <span className="ad-category" style={{ fontSize: '0.85rem' }}>{selectedAdDetail.category}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              <span>Owner: <strong>{selectedAdDetail.owner}</strong></span>
            </div>

            <div style={{ background: 'var(--color-bg)', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Contact Information:</span>
              </div>
              <strong style={{ fontSize: '0.95rem', color: 'var(--color-primary)' }}>📧 {selectedAdDetail.contact}</strong>
            </div>

            <h4 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
              Description & Rates
            </h4>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-dark)', marginBottom: '1.5rem', whiteSpace: 'pre-wrap' }}>
              {selectedAdDetail.description}
            </p>

            {selectedAdDetail.link && (
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--color-accent-sage-light)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600 }}>Website:</span>
                <a href={selectedAdDetail.link} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', textDecoration: 'none' }}>
                  Visit Website <ExternalLinkIcon />
                </a>
              </div>
            )}
          </div>
        )}
      </GroveDialog>

      {/* COMMUNITY GUIDELINES & MODERATION MODAL */}
      <GroveDialog
        open={showRulesModal}
        onClose={() => setShowRulesModal(false)}
        title="🌿 Community Guidelines & Moderation Protocol"
        footer={<button className="btn btn-primary" onClick={() => setShowRulesModal(false)}>I Agree & Understand</button>}
        width="580px"
      >
        <div>
          <Notice kind="info">
            Welcome! The Learning Grove Community Board is designed to be a safe, supportive, and uplifting environment for all homeschooling families.
          </Notice>

          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--ink, #1B201C)', margin: '1rem 0 0.5rem 0' }}>
            📜 Community Guidelines
          </h4>

          <ol style={{ paddingLeft: '1.2rem', lineHeight: '1.6', fontSize: '0.85rem', color: 'var(--ink, #1B201C)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <li>
              <strong>Family-Friendly Content:</strong> Keep all discussions, replies, and titles clean, positive, and appropriate for readers of all ages.
            </li>
            <li>
              <strong>Civil & Respectful Discourse:</strong> Homeschooling approaches differ widely (Secular, Classical, Unschooling, Faith-based). We celebrate diverse choices and maintain mutual respect.
            </li>
            <li>
              <strong>Active Moderation Oversight:</strong> Threads and replies are monitored by Community Moderators. Misleading, offensive, or abusive content will be removed.
            </li>
            <li>
              <strong>Community Flagging:</strong> Any user can click 🚩 <em>Flag Post</em> on any thread to immediately alert moderators for review.
            </li>
            <li>
              <strong>No Unsolicited Commercial Spam:</strong> Commercial promotions, paid tutoring services, or business ads should be posted on the{' '}
              <a 
                onClick={() => { setShowRulesModal(false); setActiveTab('businesses'); }}
                style={{ color: 'var(--brand, #1E3F20)', fontWeight: '800', textDecoration: 'underline', cursor: 'pointer' }}
              >
                🏪 Business Board
              </a>, not in discussion channels.
            </li>
          </ol>
        </div>
      </GroveDialog>

      {/* START NEW DISCUSSION MODAL */}
      <GroveDialog
        open={showNewPostModal}
        onClose={() => { setShowNewPostModal(false); setFormError(null); }}
        title="Start a New Community Discussion"
        footer={<>
          <button type="button" className="btn btn-secondary" onClick={() => { setShowNewPostModal(false); setFormError(null); }}>Cancel</button>
          <button type="submit" form="new-post-form" className="btn btn-primary">Publish Discussion</button>
        </>}
        width="560px"
      >
        <form id="new-post-form" onSubmit={handleNewPostSubmit}>
          {formError && <Notice kind="error">{formError}</Notice>}

          <Field id="new-post-title" label="Discussion Title / Question" required>
            <input
              type="text"
              placeholder="e.g. What is your favorite 4th-grade math curriculum for visual learners?"
              value={newPostForm.title}
              onChange={(e) => setNewPostForm(prev => ({ ...prev, title: e.target.value }))}
            />
          </Field>

          <Field id="new-post-cat" label="Official Channel Category" required>
            <select
              value={newPostForm.category}
              onChange={(e) => setNewPostForm(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="curriculum-qa">📚 Curriculum Q&A</option>
              <option value="coops-trips">🌲 Co-ops & Field Trips</option>
              <option value="prep">🎓 High School & College Prep</option>
              <option value="swap">🎒 Buy / Sell / Swap</option>
              <option value="tips">💡 Teaching Tips & Advice</option>
              <option value="lounge">💬 General Lounge</option>
            </select>
          </Field>

          {/* PARENT CUSTOM TAGS WITH HELPER PROMPT */}
          <Field id="new-post-tags" label="Custom Hashtags / Topics (comma-separated)">
            <input
              type="text"
              placeholder="e.g. #Math, #4thGrade, #VisualLearners, #BeastAcademy"
              value={newPostForm.tags}
              onChange={(e) => setNewPostForm(prev => ({ ...prev, tags: e.target.value }))}
            />
          </Field>
          <div style={{ fontSize: '0.75rem', background: 'var(--brand-wash, #E4EDE4)', padding: '0.5rem 0.75rem', borderRadius: '4px', border: '1px solid var(--line-strong, #6D7A6D)', color: 'var(--brand, #1E3F20)', fontWeight: '600', marginBottom: '1rem' }}>
            💡 <strong>Parent Helper Hint:</strong> Add custom tags like <code>#Math</code> or <code>#SpecialNeeds</code> so other parents can easily find and filter your topic!
          </div>

          <Field id="new-post-content" label="Discussion Details" required>
            <textarea
              className="form-control"
              rows="5"
              placeholder="Provide background context, questions, or details for the community..."
              value={newPostForm.content}
              onChange={(e) => setNewPostForm(prev => ({ ...prev, content: e.target.value }))}
            />
          </Field>
        </form>
      </GroveDialog>

      {/* THREAD DETAIL & REPLIES DIALOG */}
      {activePostDetail && (
        <GroveDialog
          open={!!activePostDetail}
          onClose={() => setActivePostDetail(null)}
          title={activePostDetail.title}
          footer={<button className="btn btn-secondary" onClick={() => setActivePostDetail(null)}>Close</button>}
          width="640px"
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--brand, #1E3F20)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {activePostDetail.author.charAt(0).toUpperCase()}
              </div>
              <div>
                <strong style={{ fontSize: '0.9rem', color: 'var(--ink, #1B201C)' }}>{activePostDetail.author}</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--ink-muted, #556056)' }}>Category: {activePostDetail.categoryLabel || activePostDetail.category}</div>
              </div>
            </div>

            <p style={{ fontSize: '0.95rem', color: 'var(--ink, #1B201C)', lineHeight: '1.6', background: 'var(--surface-raised, #F3F1EC)', padding: '1rem', borderRadius: '6px', marginBottom: '1rem' }}>
              {activePostDetail.content}
            </p>

            {/* REPLIES SECTION */}
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--ink, #1B201C)', marginBottom: '0.75rem' }}>
              💬 Community Replies ({activePostDetail.replies ? activePostDetail.replies.length : 0})
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem', maxHeight: '250px', overflowY: 'auto', paddingRight: '4px' }}>
              {activePostDetail.replies && activePostDetail.replies.length > 0 ? (
                activePostDetail.replies.map((rep, idx) => (
                  <div key={idx} style={{ padding: '0.75rem', background: 'var(--brand-wash, #E4EDE4)', borderRadius: '6px', border: '1px solid var(--line-strong, #6D7A6D)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--brand, #1E3F20)' }}>{rep.author}</strong>
                      <span style={{ fontSize: '0.7rem', color: 'var(--ink-muted, #556056)' }}>{rep.created_at || 'Just now'}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--ink, #1B201C)', margin: 0, lineHeight: '1.4' }}>{rep.content}</p>
                  </div>
                ))
              ) : (
                <p style={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--ink-muted, #556056)' }}>No replies yet. Be the first to answer!</p>
              )}
            </div>

            {/* ADD REPLY FORM */}
            <form onSubmit={handleNewReplySubmit} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Write a helpful reply..."
                required
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
                style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--line-strong, #6D7A6D)', fontSize: '0.85rem' }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                Reply
              </button>
            </form>
          </div>
        </GroveDialog>
      )}

      {/* REQUEST A NEW DISCUSSION MODAL */}
      <GroveDialog
        open={showRequestModal}
        onClose={() => { setShowRequestModal(false); setFormError(null); }}
        title="Request a New Community Discussion"
        footer={<>
          <button type="button" className="btn btn-secondary" onClick={() => { setShowRequestModal(false); setFormError(null); }}>Cancel</button>
          <button type="submit" form="request-discussion-form" className="btn btn-primary">Submit Request to Team</button>
        </>}
        width="580px"
      >
        <form id="request-discussion-form" onSubmit={handleDiscussionRequestSubmit}>
          {formError && <Notice kind="error">{formError}</Notice>}

          <Notice kind="info" style={{ marginBottom: '1rem' }}>
            💡 Want to start a new discussion topic for the community? Fill out the details below and our moderation team will review and publish your discussion thread!
          </Notice>

          <Field id="req-title" label="Proposed Discussion Title / Question" required>
            <input
              type="text"
              placeholder="e.g. Seeking recommendations for high school AP Chemistry lab kits"
              value={requestForm.title}
              onChange={(e) => setRequestForm(prev => ({ ...prev, title: e.target.value }))}
            />
          </Field>

          <div className="form-row">
            <Field id="req-cat" label="Suggested Channel Category" required>
              <select
                value={requestForm.category}
                onChange={(e) => setRequestForm(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="curriculum-qa">📚 Curriculum Q&A</option>
                <option value="coops-trips">🌲 Co-ops & Field Trips</option>
                <option value="prep">🎓 High School & College Prep</option>
                <option value="swap">🎒 Buy / Sell / Swap</option>
                <option value="tips">💡 Teaching Tips & Advice</option>
                <option value="lounge">💬 General Lounge</option>
              </select>
            </Field>

            {!currentUser && (
              <Field id="req-email" label="Your Email Address" required>
                <input
                  type="email"
                  placeholder="parent@example.com"
                  value={requestForm.email}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, email: e.target.value }))}
                />
              </Field>
            )}
          </div>

          <Field id="req-tags" label="Suggested Hashtags / Tags (comma-separated)">
            <input
              type="text"
              placeholder="e.g. #APChemistry, #HighSchool, #ScienceLabs"
              value={requestForm.tags}
              onChange={(e) => setRequestForm(prev => ({ ...prev, tags: e.target.value }))}
            />
          </Field>

          <Field id="req-content" label="Discussion Background & Details" required>
            <textarea
              className="form-control"
              rows="4"
              placeholder="Provide background context on what you want to discuss with other parents..."
              value={requestForm.content}
              onChange={(e) => setRequestForm(prev => ({ ...prev, content: e.target.value }))}
            />
          </Field>

          <Field id="req-reason" label="Why would this discussion benefit the community? (Optional)">
            <textarea
              className="form-control"
              rows="2"
              placeholder="e.g. Many parents in our local co-op are looking for hands-on high school lab advice..."
              value={requestForm.reason}
              onChange={(e) => setRequestForm(prev => ({ ...prev, reason: e.target.value }))}
            />
          </Field>
        </form>
      </GroveDialog>

      {/* 👑 SITE OWNER USER ROLE & PERMISSIONS MANAGEMENT DIALOG */}
      <GroveDialog
        open={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        title="👑 Site Owner: User Role & Permissions Management"
        footer={<button className="btn btn-secondary" onClick={() => setShowRoleModal(false)}>Close Admin Panel</button>}
        width="750px"
      >
        <div>
          <p style={{ fontSize: '0.85rem', color: 'var(--ink-muted, #556056)', marginBottom: '1rem', lineHeight: '1.4' }}>
            As a <strong>Site Owner / Admin</strong>, you can assign role permissions to registered members. Granting multiple roles enables the role switcher menu for that user.
          </p>

          {roleUpdateMsg && (
            <Notice kind="success" style={{ marginBottom: '1rem' }}>
              {roleUpdateMsg}
            </Notice>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {allUsersList.map(user => {
              const currentRoles = user.assignedRoles || [user.role || 'Parent'];
              return (
                <div 
                  key={user.id} 
                  style={{
                    background: 'var(--surface-raised, #F3F1EC)',
                    border: '1.5px solid var(--line-subtle, #DEE3DD)',
                    borderRadius: '8px',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--ink, #1B201C)' }}>
                      {user.name} <span style={{ fontSize: '0.75rem', color: 'var(--ink-muted, #556056)', fontWeight: '500' }}>({user.email || user.id})</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--oak-text, #8A5320)', fontWeight: '700', marginTop: '2px' }}>
                      Active Primary Role: {user.role || 'Parent'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.75rem', fontWeight: '700' }}>
                      {['Parent', 'Moderator', 'Admin'].map(r => {
                        const isChecked = currentRoles.includes(r);
                        return (
                          <label key={r} style={{ display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer', background: isChecked ? 'var(--brand-wash, #E4EDE4)' : 'transparent', padding: '3px 6px', borderRadius: '4px', border: '1px solid var(--line-strong, #6D7A6D)' }}>
                            <input 
                              type="checkbox" 
                              checked={isChecked}
                              onChange={(e) => {
                                let newAssigned = [];
                                if (e.target.checked) {
                                  newAssigned = [...currentRoles, r];
                                } else {
                                  newAssigned = currentRoles.filter(role => role !== r);
                                  if (newAssigned.length === 0) newAssigned = ['Parent'];
                                }
                                const primary = newAssigned[0];
                                handleSaveUserRoles(user.id, primary, newAssigned);
                              }}
                            />
                            <span>{r === 'Admin' ? 'Site Owner (Admin)' : r}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </GroveDialog>
    </div>
  );
}
