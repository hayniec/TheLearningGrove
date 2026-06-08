import React, { useState, useEffect } from 'react';

// --- INLINE SVG ICONS (PREMIUM, ZERO-LATENCY) ---
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

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('explorer');

  // Community Forum State
  const [posts, setPosts] = useState([]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPost, setNewPost] = useState({ author: '', title: '', content: '', category: 'General' });
  const [postSearchQuery, setPostSearchQuery] = useState('');
  const [selectedPostCategory, setSelectedPostCategory] = useState('All');

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
  const [pendingResources, setPendingResources] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '' });
  const [newSubUserForm, setNewSubUserForm] = useState({ email: '', password: '', name: '', role: 'Student' });
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [newResource, setNewResource] = useState({ name: '', subject: 'Math', cost: 'free', link: '', description: '', type: 'website' });
  const [showModQueue, setShowModQueue] = useState(false);

  // Modal States
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);
  const [showTripModal, setShowTripModal] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);

  // Form Input States
  const [newCurriculum, setNewCurriculum] = useState({
    name: '', subject: 'Math', delivery: 'online', grouping: 'grade',
    cost: '$$', rating: 5, favoritePart: '', answerKey: 'provided',
    methodology: 'spiral', onlineResources: false, selfPaced: false,
    classParticipation: false, worldview: 'secular', videos: false, description: ''
  });
  const [newTrip, setNewTrip] = useState({
    name: '', subject: 'Science', cost: '$$', rating: 5, description: '',
    location: '', gradeRecommendation: 'All Grades',
    city: '', state: '', zip: '', websiteUrl: ''
  });
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

  // Featured Carousel Index (Dashboard)
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Fetch Data from Server
  const fetchData = async () => {
    try {
      const [currRes, tripRes, adRes, resRes, postRes] = await Promise.all([
        fetch('/api/curricula').then(r => r.json()),
        fetch('/api/fieldtrips').then(r => r.json()),
        fetch('/api/businessads').then(r => r.json()),
        fetch('/api/resources').then(r => r.json()),
        fetch('/api/posts').then(r => r.json())
      ]);

      setCurricula(currRes);
      setFieldTrips(tripRes);
      setBusinessAds(adRes);
      setResources(resRes);
      setPosts(postRes);

      setStats({
        curricula: currRes.length,
        trips: tripRes.length,
        ads: adRes.length,
        resources: resRes.length
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

  // Community Forum Filtering Logic
  const filteredPosts = posts.filter(item => {
    const matchesSearch = postSearchQuery.trim() === '' || 
                          item.title.toLowerCase().includes(postSearchQuery.toLowerCase()) || 
                          item.content.toLowerCase().includes(postSearchQuery.toLowerCase()) ||
                          item.author.toLowerCase().includes(postSearchQuery.toLowerCase());
                          
    const matchesCategory = selectedPostCategory === 'All' || item.category === selectedPostCategory;
    
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch subusers and pending resources based on login status
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('grove_user', JSON.stringify(currentUser));
      if (currentUser.role === 'Parent') {
        fetch(`/api/users/${currentUser.id}/subusers`)
          .then(r => r.json())
          .then(data => setSubUsers(data))
          .catch(err => console.error("Error fetching subusers:", err));
      } else {
        setSubUsers([]);
      }
      if (currentUser.role === 'Moderator') {
        fetch('/api/resources/pending')
          .then(r => r.json())
          .then(data => setPendingResources(data))
          .catch(err => console.error("Error fetching pending resources:", err));
      } else {
        setPendingResources([]);
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
      const mapContainer = document.getElementById('field-trip-map');
      if (mapContainer && window.L) {
        // Clean up previous map if any
        if (window.tripMap) {
          window.tripMap.remove();
          window.tripMap = null;
        }

        const tripsWithCoords = filteredFieldTrips.filter(t => t.lat && t.lng);
        const center = tripsWithCoords.length > 0 
          ? [tripsWithCoords[0].lat, tripsWithCoords[0].lng] 
          : [39.8283, -98.5795]; // Center of US
        const zoom = tripsWithCoords.length > 0 ? 10 : 4;

        try {
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
                <button onclick="window.showTripFromMap('${trip.id}')" style="background: var(--color-primary); color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 0.75rem; cursor: pointer; font-weight: 600; width: 100%; transition: all 0.2s;">View Details</button>
              </div>
            `;
            const marker = window.L.marker([trip.lat, trip.lng]).addTo(map);
            marker.bindPopup(popupHtml);
          });
        } catch (err) {
          console.error("Error drawing Leaflet map: ", err);
        }
      }
    }

    return () => {
      if (map) {
        map.remove();
        if (window.tripMap === map) {
          window.tripMap = null;
        }
      }
    };
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

  // Star Rating Renderer
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<StarFilledIcon key={i} />);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(<StarHalfIcon key={i} />);
      } else {
        stars.push(<StarEmptyIcon key={i} />);
      }
    }
    return <span className="rating-stars">{stars}</span>;
  };

  // Form Submissions
  const handleCurriculumSubmit = async (e) => {
    e.preventDefault();
    if (!newCurriculum.name || !newCurriculum.description) return alert("Please fill out Name and Description.");
    
    try {
      const payload = { ...newCurriculum, gradeLevels: gradeLevelsSelected, userId: currentUser ? currentUser.id : 'parent-1' };
      const res = await fetch('/api/curricula', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowCurriculumModal(false);
        setNewCurriculum({
          name: '', subject: 'Math', delivery: 'online', grouping: 'grade',
          cost: '$$', rating: 5, favoritePart: '', answerKey: 'provided',
          methodology: 'spiral', onlineResources: false, selfPaced: false,
          classParticipation: false, worldview: 'secular', videos: false, description: ''
        });
        setGradeLevelsSelected([]);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTripSubmit = async (e) => {
    e.preventDefault();
    if (!newTrip.name || !newTrip.description || !newTrip.location || !newTrip.city || !newTrip.state) {
      return alert("Please fill out Name, Location, City, State, and Description.");
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
      const payload = { ...newTrip, lat, lng, userId: currentUser ? currentUser.id : 'parent-1' };
      const res = await fetch('/api/fieldtrips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowTripModal(false);
        setNewTrip({
          name: '', subject: 'Science', cost: '$$', rating: 5, description: '',
          location: '', gradeRecommendation: 'All Grades',
          city: '', state: '', zip: '', websiteUrl: ''
        });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdSubmit = async (e) => {
    e.preventDefault();
    if (!newAd.businessName || !newAd.owner || !newAd.description || !newAd.contact || !newAd.businessType) {
      return alert("Please fill out Business Name, Owner, Contact, Business Type, and Description.");
    }

    try {
      const res = await fetch('/api/businessads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newAd, userId: currentUser ? currentUser.id : 'parent-1' })
      });
      if (res.ok) {
        setShowAdModal(false);
        setNewAd({
          owner: '', businessName: '', description: '', category: 'Cottage Industries',
          businessType: '', contact: '', link: ''
        });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.author || !newPost.content) {
      return alert("Please fill out Title, Author/Your Name, and Post Content.");
    }

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newPost, userId: currentUser ? currentUser.id : 'parent-1' })
      });
      if (res.ok) {
        setShowPostModal(false);
        setNewPost({
          author: '', title: '', content: '', category: 'General'
        });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (authMode === 'login') {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: authForm.email, password: authForm.password })
        });
        if (res.ok) {
          const user = await res.json();
          setCurrentUser(user);
          setShowAuthModal(false);
          setAuthForm({ email: '', password: '', name: '' });
          fetchData();
        } else {
          const err = await res.json();
          alert(err.error || "Login failed");
        }
      } catch (err) {
        console.error(err);
        alert("Login failed");
      }
    } else {
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(authForm)
        });
        if (res.ok) {
          const user = await res.json();
          setCurrentUser(user);
          setShowAuthModal(false);
          setAuthForm({ email: '', password: '', name: '' });
          fetchData();
        } else {
          const err = await res.json();
          alert(err.error || "Registration failed");
        }
      } catch (err) {
        console.error(err);
        alert("Registration failed");
      }
    }
  };

  const handleNewSubUserSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser || currentUser.role !== 'Parent') return;

    try {
      const res = await fetch(`/api/users/${currentUser.id}/subusers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSubUserForm)
      });
      if (res.ok) {
        const newSub = await res.json();
        setSubUsers(prev => [...prev, newSub]);
        setNewSubUserForm({ email: '', password: '', name: '', role: 'Student' });
        alert("Child profile added successfully!");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create child profile");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create child profile");
    }
  };

  const handleApproveResource = async (id) => {
    try {
      const res = await fetch(`/api/resources/${id}/approve`, { method: 'POST' });
      if (res.ok) {
        setPendingResources(prev => prev.filter(r => r.id !== id));
        fetchData();
      } else {
        alert("Failed to approve resource");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectResource = async (id) => {
    if (!confirm("Are you sure you want to reject and delete this resource?")) return;
    try {
      const res = await fetch(`/api/resources/${id}/reject`, { method: 'POST' });
      if (res.ok) {
        setPendingResources(prev => prev.filter(r => r.id !== id));
      } else {
        alert("Failed to reject resource");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResourceSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("You must be logged in to submit resources.");
      return;
    }
    if (!newResource.name || !newResource.link || !newResource.description) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const payload = {
        ...newResource,
        userId: currentUser.id,
        approved: currentUser.role === 'Moderator'
      };

      const res = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowResourceModal(false);
        setNewResource({ name: '', subject: 'Math', cost: 'free', link: '', description: '', type: 'website' });
        if (currentUser.role === 'Moderator') {
          alert("Resource published successfully!");
        } else {
          alert("Resource submitted successfully! It will appear once approved by a moderator.");
        }
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to submit resource");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit resource");
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
      {/* LEFT SIDEBAR (morphs to bottom bar on mobile) */}
      <aside className="sidebar">
        <div>
          <div className="brand-section">
            <svg className="brand-logo" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
            <span className="brand-name">The Learning Grove</span>
          </div>

          {/* USER PROFILE SECTION */}
          <div style={{ padding: '0.75rem 1rem', background: 'var(--color-primary-light)', margin: '0 1rem 1rem 1rem', borderRadius: '8px', border: '1px solid var(--color-accent-sage-light)' }}>
            {currentUser ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '600', fontSize: '0.8rem', color: 'var(--color-text-dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentUser.name}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-accent-oak)', fontWeight: '700', textTransform: 'uppercase' }}>{currentUser.role}</div>
                  </div>
                </div>

                {currentUser.role === 'Parent' && subUsers.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '0.5rem' }}>
                    <label style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>Switch Profile:</label>
                    <select 
                      style={{ fontSize: '0.75rem', padding: '0.15rem', borderRadius: '4px', border: '1px solid var(--color-accent-sage-light)', width: '100%' }}
                      value={currentUser.id}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === currentUser.id) return;
                        const sub = subUsers.find(s => s.id === val);
                        if (sub) {
                          localStorage.setItem('grove_parent_user', JSON.stringify(currentUser));
                          setCurrentUser(sub);
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
                      }
                    }}
                    style={{ width: '100%', fontSize: '0.7rem', padding: '3px 0', border: '1px solid var(--color-primary)', background: 'white', color: 'var(--color-primary)', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', marginBottom: '0.25rem' }}
                  >
                    Switch to Parent
                  </button>
                )}

                <button 
                  onClick={() => {
                    localStorage.removeItem('grove_parent_user');
                    setCurrentUser(null);
                  }}
                  style={{ width: '100%', fontSize: '0.7rem', padding: '3px 0', border: '1px solid var(--color-accent-oak)', background: 'white', color: 'var(--color-accent-oak)', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', margin: '0 0 0.5rem 0' }}>Join the grove to share, post and connect!</p>
                <button 
                  onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                  style={{ width: '100%', fontSize: '0.75rem', padding: '5px 0', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
                >
                  Sign In / Register
                </button>
              </div>
            )}
          </div>

          <nav>
            <ul className="nav-list">
              {/*
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  <DashboardIcon />
                  <span>Dashboard</span>
                </button>
              </li>
              */}
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'explorer' ? 'active' : ''}`}
                  onClick={() => setActiveTab('explorer')}
                >
                  <CurriculaIcon />
                  <span>Curricula</span>
                </button>
              </li>
              {/*
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'community' ? 'active' : ''}`}
                  onClick={() => setActiveTab('community')}
                >
                  <CommunityIcon />
                  <span>Community Board</span>
                </button>
              </li>
              */}
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'fieldtrips' ? 'active' : ''}`}
                  onClick={() => setActiveTab('fieldtrips')}
                >
                  <PinIcon />
                  <span>Field Trips</span>
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'businesses' ? 'active' : ''}`}
                  onClick={() => setActiveTab('businesses')}
                >
                  <BusinessIcon />
                  <span>Business Board</span>
                </button>
              </li>
              {/*
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'resources' ? 'active' : ''}`}
                  onClick={() => setActiveTab('resources')}
                >
                  <ResourcesIcon />
                  <span>Resources</span>
                </button>
              </li>
              */}
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
                                {renderStars(item.rating)}
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
                        <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
                          {renderStars(item.rating)}
                          <span className="rating-val">{item.rating.toFixed(1)}</span>
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
        {/* TABS 3: COMMUNITY BOARD (FORUM)         */}
        {/* ======================================= */}
        {activeTab === 'community' && (
          <div>
            <header className="content-header">
              <div>
                <h1 className="page-title">Community Board</h1>
              </div>
              {(!currentUser || currentUser.role !== 'Student') && (
                <button className="btn btn-primary" onClick={() => setShowPostModal(true)}>
                  <PlusIcon /> Share Update / Post
                </button>
              )}
            </header>

            <div className="explorer-container">
              {/* Forum Filters */}
              <aside className="filter-sidebar">
                <div className="filter-title">
                  <strong>Filter Discussions</strong>
                  <span className="filter-clear" onClick={() => {
                    setPostSearchQuery('');
                    setSelectedPostCategory('All');
                  }}>Clear</span>
                </div>

                {/* Keyword Search */}
                <div className="filter-group">
                  <div className="search-input-wrapper">
                    <input 
                      type="text" 
                      className="search-input" 
                      placeholder="Search posts..." 
                      value={postSearchQuery}
                      onChange={(e) => setPostSearchQuery(e.target.value)}
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
                    {['All', 'General', 'Questions', 'Advice', 'Meetups'].map(cat => (
                      <li 
                        className="option-item" 
                        key={cat} 
                        onClick={() => setSelectedPostCategory(cat)}
                        style={{ fontWeight: selectedPostCategory === cat ? '700' : 'normal', color: selectedPostCategory === cat ? 'var(--color-primary)' : 'inherit' }}
                      >
                        <input 
                          type="radio" 
                          name="post-category"
                          checked={selectedPostCategory === cat}
                          onChange={() => {}}
                        />
                        <span>{cat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>

              {/* Feed of Posts */}
              <section className="feed-list" style={{ width: '100%' }}>
                {filteredPosts.length > 0 ? (
                  filteredPosts.map(post => (
                    <article className="post-card" key={post.id}>
                      <div className="post-header">
                        <h3 className="post-title">{post.title}</h3>
                        <span className={`badge-category badge-${post.category.toLowerCase()}`}>
                          {post.category}
                        </span>
                      </div>
                      <div className="post-meta">
                        <span>By <strong>{post.author}</strong></span>
                        <span>•</span>
                        <span>{new Date(post.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="post-content">{post.content}</p>
                    </article>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                    <h3>No community posts matched your filters.</h3>
                    <p style={{ marginTop: '0.5rem' }}>Be the first to share an update or question!</p>
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
                      {renderStars(trip.rating)}
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
      {/* MODAL: SUBMIT CURRICULUM REVIEW        */}
      {/* ======================================= */}
      {showCurriculumModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowCurriculumModal(false)}>×</button>
            <h2 className="modal-title">Write a Curriculum Review</h2>
            
            <form onSubmit={handleCurriculumSubmit}>
              <div className="form-group">
                <label className="form-label">Curriculum Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Beast Academy Math"
                  required
                  value={newCurriculum.name}
                  onChange={(e) => setNewCurriculum(prev => ({...prev, name: e.target.value}))}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <select 
                    className="form-control"
                    value={newCurriculum.subject}
                    onChange={(e) => setNewCurriculum(prev => ({...prev, subject: e.target.value}))}
                  >
                    <option value="Math">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="Language Arts">Language Arts & Lit</option>
                    <option value="History">History & Social Studies</option>
                    <option value="Art & Music">Art & Music</option>
                    <option value="All Subjects">All Subjects / Unified</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Format</label>
                  <select 
                    className="form-control"
                    value={newCurriculum.delivery}
                    onChange={(e) => setNewCurriculum(prev => ({...prev, delivery: e.target.value}))}
                  >
                    <option value="online">Online Interface</option>
                    <option value="printable">Printable PDF</option>
                    <option value="consumable">Consumable Workbook</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Grouping Style</label>
                  <select 
                    className="form-control"
                    value={newCurriculum.grouping}
                    onChange={(e) => setNewCurriculum(prev => ({...prev, grouping: e.target.value}))}
                  >
                    <option value="grade">Grade-based</option>
                    <option value="family">Family-based (Multi-grade)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Cost Range</label>
                  <select 
                    className="form-control"
                    value={newCurriculum.cost}
                    onChange={(e) => setNewCurriculum(prev => ({...prev, cost: e.target.value}))}
                  >
                    <option value="Free">Free</option>
                    <option value="$">$ (Low Cost)</option>
                    <option value="$$">$$ (Medium Cost)</option>
                    <option value="$$$">$$$ (High Cost)</option>
                  </select>
                </div>
              </div>

              {/* Target Grade Levels Selection Grid (K-12 checkboxes) */}
              <div className="form-group">
                <label className="form-label">Target Grade Levels (Select all that apply)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(48px, 1fr))', gap: '0.4rem', marginTop: '0.4rem' }}>
                  {['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(grade => {
                    const isSelected = gradeLevelsSelected.includes(grade);
                    return (
                      <button
                        type="button"
                        key={grade}
                        onClick={() => {
                          setGradeLevelsSelected(prev =>
                            prev.includes(grade) ? prev.filter(g => g !== grade) : [...prev, grade]
                          );
                        }}
                        style={{
                          padding: '0.35rem 0.2rem',
                          border: '1px solid var(--color-border)',
                          borderRadius: '6px',
                          background: isSelected ? 'var(--color-primary)' : 'var(--color-bg)',
                          color: isSelected ? 'white' : 'var(--color-text-dark)',
                          fontWeight: '700',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          textAlign: 'center',
                          fontSize: '0.8rem'
                        }}
                      >
                        {grade}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Rating (1-5 Stars)</label>
                  <select 
                    className="form-control"
                    value={newCurriculum.rating}
                    onChange={(e) => setNewCurriculum(prev => ({...prev, rating: parseFloat(e.target.value)}))}
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5 / 5)</option>
                    <option value="4">⭐⭐⭐⭐ (4 / 5)</option>
                    <option value="3">⭐⭐⭐ (3 / 5)</option>
                    <option value="2">⭐⭐ (2 / 5)</option>
                    <option value="1">⭐ (1 / 5)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Worldview</label>
                  <select 
                    className="form-control"
                    value={newCurriculum.worldview}
                    onChange={(e) => setNewCurriculum(prev => ({...prev, worldview: e.target.value}))}
                  >
                    <option value="secular">Secular</option>
                    <option value="nonsecular">Nonsecular / Faith-based</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Answer Key Pricing</label>
                  <select 
                    className="form-control"
                    value={newCurriculum.answerKey}
                    onChange={(e) => setNewCurriculum(prev => ({...prev, answerKey: e.target.value}))}
                  >
                    <option value="provided">Included in price</option>
                    <option value="extra">Costs extra</option>
                    <option value="self-graded">Self-graded by student</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Methodology</label>
                  <select 
                    className="form-control"
                    value={newCurriculum.methodology}
                    onChange={(e) => setNewCurriculum(prev => ({...prev, methodology: e.target.value}))}
                  >
                    <option value="spiral">Spiral Review (incremental steps)</option>
                    <option value="mastery">Mastery (focused topics)</option>
                  </select>
                </div>
              </div>

              {/* Checklist details */}
              <div className="form-group">
                <label className="form-label">Additional Features</label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={newCurriculum.onlineResources}
                      onChange={(e) => setNewCurriculum(prev => ({...prev, onlineResources: e.target.checked}))}
                    />
                    <span>Provides extra online resources</span>
                  </label>
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={newCurriculum.selfPaced}
                      onChange={(e) => setNewCurriculum(prev => ({...prev, selfPaced: e.target.checked}))}
                    />
                    <span>Self-paced</span>
                  </label>
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={newCurriculum.classParticipation}
                      onChange={(e) => setNewCurriculum(prev => ({...prev, classParticipation: e.target.checked}))}
                    />
                    <span>Includes live online class participation</span>
                  </label>
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={newCurriculum.videos}
                      onChange={(e) => setNewCurriculum(prev => ({...prev, videos: e.target.checked}))}
                    />
                    <span>Includes video instruction elements</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Overall Description</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  placeholder="Review explanation of the curriculum structure..."
                  required
                  value={newCurriculum.description}
                  onChange={(e) => setNewCurriculum(prev => ({...prev, description: e.target.value}))}
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Your Favorite Part</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="What did you and your students love most?"
                  value={newCurriculum.favoritePart}
                  onChange={(e) => setNewCurriculum(prev => ({...prev, favoritePart: e.target.value}))}
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCurriculumModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Review</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* MODAL: SHARE FIELD TRIP                 */}
      {/* ======================================= */}
      {showTripModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowTripModal(false)}>×</button>
            <h2 className="modal-title">Share a Field Trip Idea</h2>

            <form onSubmit={handleTripSubmit}>
              <div className="form-group">
                <label className="form-label">Location / Site Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Metro Space & Rocket Museum"
                  required
                  value={newTrip.name}
                  onChange={(e) => setNewTrip(prev => ({...prev, name: e.target.value}))}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Academic Focus</label>
                  <select 
                    className="form-control"
                    value={newTrip.subject}
                    onChange={(e) => setNewTrip(prev => ({...prev, subject: e.target.value}))}
                  >
                    <option value="Science">Science & Biology</option>
                    <option value="History">History & Social Studies</option>
                    <option value="Art & Music">Art & Creative Expression</option>
                    <option value="Mathematics">Practical Math/STEM</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Cost Level</label>
                  <select 
                    className="form-control"
                    value={newTrip.cost}
                    onChange={(e) => setNewTrip(prev => ({...prev, cost: e.target.value}))}
                  >
                    <option value="free">Free Admission</option>
                    <option value="$">$ (Low Cost)</option>
                    <option value="$$">$$ (Medium Cost)</option>
                    <option value="$$$">$$$ (High Cost)</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Address / General Location</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. 100 Main St"
                    required
                    value={newTrip.location}
                    onChange={(e) => setNewTrip(prev => ({...prev, location: e.target.value}))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Recommended Ages/Grades</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. Elementary, Middle School"
                    required
                    value={newTrip.gradeRecommendation}
                    onChange={(e) => setNewTrip(prev => ({...prev, gradeRecommendation: e.target.value}))}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. Austin"
                    required
                    value={newTrip.city}
                    onChange={(e) => setNewTrip(prev => ({...prev, city: e.target.value}))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. TX"
                    required
                    value={newTrip.state}
                    onChange={(e) => setNewTrip(prev => ({...prev, state: e.target.value}))}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Zip Code (Optional)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. 78754"
                    value={newTrip.zip}
                    onChange={(e) => setNewTrip(prev => ({...prev, zip: e.target.value}))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Website Link (Optional)</label>
                  <input 
                    type="url" 
                    className="form-control" 
                    placeholder="e.g. https://www.mos.org"
                    value={newTrip.websiteUrl}
                    onChange={(e) => setNewTrip(prev => ({...prev, websiteUrl: e.target.value}))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Rating</label>
                <select 
                  className="form-control"
                  value={newTrip.rating}
                  onChange={(e) => setNewTrip(prev => ({...prev, rating: parseInt(e.target.value)}))}
                >
                  <option value="5">⭐⭐⭐⭐⭐ (5 / 5)</option>
                  <option value="4">⭐⭐⭐⭐ (4 / 5)</option>
                  <option value="3">⭐⭐⭐ (3 / 5)</option>
                  <option value="2">⭐⭐ (2 / 5)</option>
                  <option value="1">⭐ (1 / 5)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Details / Description</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  placeholder="Review instructions, discount codes, or highlight exhibits..."
                  required
                  value={newTrip.description}
                  onChange={(e) => setNewTrip(prev => ({...prev, description: e.target.value}))}
                ></textarea>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowTripModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Post Field Trip</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* MODAL: POST MOMS BUSINESS AD            */}
      {/* ======================================= */}
      {showAdModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowAdModal(false)}>×</button>
            <h2 className="modal-title">List on Business Board</h2>

            <form onSubmit={handleAdSubmit}>
              <div className="form-group">
                <label className="form-label">Business or Service Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Phonics Tutoring & Reading Services"
                  required
                  value={newAd.businessName}
                  onChange={(e) => setNewAd(prev => ({...prev, businessName: e.target.value}))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Business Type / Specialty</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Baked Goods, IT Support, Music Lessons, Tutoring"
                  required
                  value={newAd.businessType}
                  onChange={(e) => setNewAd(prev => ({...prev, businessType: e.target.value}))}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Contact Person (Owner Name)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. Sarah Jenkins"
                    required
                    value={newAd.owner}
                    onChange={(e) => setNewAd(prev => ({...prev, owner: e.target.value}))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select 
                    className="form-control"
                    value={newAd.category}
                    onChange={(e) => setNewAd(prev => ({...prev, category: e.target.value}))}
                  >
                    <option value="Cottage Industries">Cottage Industries</option>
                    <option value="Storefronts">Storefronts</option>
                    <option value="Academic Services">Academic Services</option>
                    <option value="Creative & Extracurriculars">Creative & Extracurriculars</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Contact Email / Phone</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. contact@email.com"
                    required
                    value={newAd.contact}
                    onChange={(e) => setNewAd(prev => ({...prev, contact: e.target.value}))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Website Link (Optional)</label>
                  <input 
                    type="url" 
                    className="form-control" 
                    placeholder="e.g. https://www.mybusiness.com"
                    value={newAd.link}
                    onChange={(e) => setNewAd(prev => ({...prev, link: e.target.value}))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description of Business / Service</label>
                <textarea 
                  className="form-control" 
                  rows="4" 
                  placeholder="Outline your tutoring rates, lessons structure, co-op dates, or products pricing..."
                  required
                  value={newAd.description}
                  onChange={(e) => setNewAd(prev => ({...prev, description: e.target.value}))}
                ></textarea>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAdModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Publish Ad</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* MODAL: CREATE COMMUNITY POST           */}
      {/* ======================================= */}
      {showPostModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <button className="modal-close" onClick={() => setShowPostModal(false)}>×</button>
            <h2 className="modal-title">Share a Community Update / Post</h2>

            <form onSubmit={handlePostSubmit}>
              <div className="form-group">
                <label className="form-label">Post Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Suggestions for homeschool field trips in June?"
                  required
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({...prev, title: e.target.value}))}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. Sarah Jenkins"
                    required
                    value={newPost.author}
                    onChange={(e) => setNewPost(prev => ({...prev, author: e.target.value}))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select 
                    className="form-control"
                    value={newPost.category}
                    onChange={(e) => setNewPost(prev => ({...prev, category: e.target.value}))}
                  >
                    <option value="General">General / Updates</option>
                    <option value="Questions">Questions / Help Needed</option>
                    <option value="Advice">Advice / Reviews</option>
                    <option value="Meetups">Co-ops / Meetups</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Post Content</label>
                <textarea 
                  className="form-control" 
                  rows="5" 
                  placeholder="Type your message here..."
                  required
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({...prev, content: e.target.value}))}
                ></textarea>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPostModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Publish Post</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* MODAL: SUBMIT RESOURCE                  */}
      {/* ======================================= */}
      {showResourceModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <button className="modal-close" onClick={() => setShowResourceModal(false)}>×</button>
            <h2 className="modal-title">Submit Recommended Resource</h2>

            <form onSubmit={handleResourceSubmit}>
              <div className="form-group">
                <label className="form-label">Resource Name / Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Khan Academy"
                  required
                  value={newResource.name}
                  onChange={(e) => setNewResource(prev => ({...prev, name: e.target.value}))}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <select 
                    className="form-control"
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
                </div>
                <div className="form-group">
                  <label className="form-label">Cost Range</label>
                  <select 
                    className="form-control"
                    value={newResource.cost}
                    onChange={(e) => setNewResource(prev => ({...prev, cost: e.target.value}))}
                  >
                    <option value="free">Free</option>
                    <option value="low-cost">Low Cost</option>
                    <option value="subscription">Subscription</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Resource Type</label>
                  <select 
                    className="form-control"
                    value={newResource.type}
                    onChange={(e) => setNewResource(prev => ({...prev, type: e.target.value}))}
                  >
                    <option value="website">Web Link / Website</option>
                    <option value="video">Video Channel / Playlist</option>
                    <option value="printable">Printable / Worksheet</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Website URL</label>
                  <input 
                    type="url" 
                    className="form-control" 
                    placeholder="e.g. https://www.khanacademy.org"
                    required
                    value={newResource.link}
                    onChange={(e) => setNewResource(prev => ({...prev, link: e.target.value}))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Short Description</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  placeholder="Explain why you recommend this resource..."
                  required
                  value={newResource.description}
                  onChange={(e) => setNewResource(prev => ({...prev, description: e.target.value}))}
                ></textarea>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowResourceModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit for Approval</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* MODAL: USER AUTHENTICATION (SIGN IN)    */}
      {/* ======================================= */}
      {showAuthModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <button className="modal-close" onClick={() => setShowAuthModal(false)}>×</button>
            <h2 className="modal-title">{authMode === 'login' ? 'Sign In' : 'Create Account'}</h2>

            <form onSubmit={handleAuthSubmit}>
              {authMode === 'register' && (
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Sarah Jenkins"
                    required
                    value={authForm.name}
                    onChange={(e) => setAuthForm(prev => ({...prev, name: e.target.value}))}
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="parent@example.com"
                  required
                  value={authForm.email}
                  onChange={(e) => setAuthForm(prev => ({...prev, email: e.target.value}))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="••••••••"
                  required
                  value={authForm.password}
                  onChange={(e) => setAuthForm(prev => ({...prev, password: e.target.value}))}
                />
              </div>

              <div className="form-actions" style={{ flexDirection: 'column', gap: '0.75rem' }}>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  {authMode === 'login' ? 'Sign In' : 'Register Parent Account'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setAuthMode(prev => prev === 'login' ? 'register' : 'login')}
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  {authMode === 'login' ? "Don't have an account? Register" : "Already have an account? Sign In"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* MODAL: CURRICULUM DETAIL VIEW          */}
      {/* ======================================= */}
      {selectedCurriculumDetail && (
        <div className="modal-overlay" onClick={() => setSelectedCurriculumDetail(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '750px' }}>
            <button className="modal-close" onClick={() => setSelectedCurriculumDetail(null)}>×</button>
            
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

            <h2 className="modal-title" style={{ borderBottom: 'none', marginBottom: '0.5rem', paddingBottom: 0 }}>
              {selectedCurriculumDetail.name}
            </h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
              {renderStars(selectedCurriculumDetail.rating)}
              <span className="rating-val" style={{ fontSize: '1rem' }}>
                {selectedCurriculumDetail.rating.toFixed(1)} / 5.0 Rating
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
              {/* Left Column: Description & Testimonial */}
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

              {/* Right Column: Specifications Table */}
              <div style={{ background: 'var(--color-bg)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--color-border)', height: 'fit-content' }}>
                <h4 style={{ color: 'var(--color-primary)', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
                  Specifications
                </h4>
                
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Format:</span>
                    <strong style={{ textTransform: 'capitalize' }}>{selectedCurriculumDetail.delivery}</strong>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Grouping:</span>
                    <strong style={{ textTransform: 'capitalize' }}>{selectedCurriculumDetail.grouping}</strong>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Methodology:</span>
                    <strong style={{ textTransform: 'capitalize' }}>{selectedCurriculumDetail.methodology === 'spiral' ? 'Spiral Review' : 'Mastery'}</strong>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Answer Key:</span>
                    <strong style={{ textTransform: 'capitalize' }}>{selectedCurriculumDetail.answerKey === 'provided' ? 'Included' : selectedCurriculumDetail.answerKey === 'extra' ? 'Extra Cost' : 'Self-Graded'}</strong>
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

            <div className="form-actions" style={{ marginTop: '2rem' }}>
              <button className="btn btn-primary" onClick={() => setSelectedCurriculumDetail(null)}>Close Details</button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* MODAL: FIELD TRIP DETAIL VIEW          */}
      {/* ======================================= */}
      {selectedTripDetail && (
        <div className="modal-overlay" onClick={() => setSelectedTripDetail(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <button className="modal-close" onClick={() => setSelectedTripDetail(null)}>×</button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              <span className="subject-badge">{selectedTripDetail.subject}</span>
              <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--color-accent-oak)', marginLeft: 'auto' }}>
                Cost: {selectedTripDetail.cost.toUpperCase()}
              </span>
            </div>

            <h2 className="modal-title" style={{ borderBottom: 'none', marginBottom: '0.5rem', paddingBottom: 0 }}>
              {selectedTripDetail.name}
            </h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {renderStars(selectedTripDetail.rating)}
              <span className="rating-val" style={{ fontSize: '1rem' }}>
                {selectedTripDetail.rating.toFixed(1)} / 5.0 Rating
              </span>
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

            <div className="form-actions" style={{ marginTop: '2rem' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedTripDetail(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* MODAL: BUSINESS AD DETAIL VIEW         */}
      {/* ======================================= */}
      {selectedAdDetail && (
        <div className="modal-overlay" onClick={() => setSelectedAdDetail(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <button className="modal-close" onClick={() => setSelectedAdDetail(null)}>×</button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              <span className="ad-category" style={{ fontSize: '0.85rem' }}>{selectedAdDetail.category}</span>
            </div>

            <h2 className="modal-title" style={{ borderBottom: 'none', marginBottom: '0.5rem', paddingBottom: 0 }}>
              {selectedAdDetail.businessName}
            </h2>
            
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

            <div className="form-actions" style={{ marginTop: '2rem' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedAdDetail(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
