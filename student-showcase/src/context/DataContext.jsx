import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [profiles, setProfiles] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [projects, setProjects] = useState([]); // Add projects state
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const fetchData = async () => {
    setIsLoadingData(true);
    setError(null);
    try {
      const token = localStorage.getItem('sgsu_token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      // Define promises for public data
      const publicPromises = [
        fetch(`${API_BASE}/api/users/profiles`, { headers }),
        fetch(`${API_BASE}/api/users/leaderboard`, { headers }),
        fetch(`${API_BASE}/api/events`, { headers }),
        fetch(`${API_BASE}/api/projects`, { headers }),
      ];

      // Add protected data promise if token exists
      let notificationsPromise = Promise.resolve(null);
      if (token) {
        notificationsPromise = fetch(`${API_BASE}/api/notifications`, { headers });
      }

      const [profilesRes, leaderboardRes, eventsRes, projectsRes] = await Promise.all(publicPromises);
      const notificationsRes = await notificationsPromise;

      const profilesData = await profilesRes.json();
      const leaderboardData = await leaderboardRes.json();
      const eventsData = await eventsRes.json();
      const projectsData = await projectsRes.json();

      let notificationsData = [];
      if (notificationsRes && notificationsRes.ok) {
        notificationsData = await notificationsRes.json();
      }

      // Handle individual failures gracefully where possible
      if (!profilesRes.ok) console.error('Failed to fetch profiles:', profilesData.message);
      if (!leaderboardRes.ok) console.error('Failed to fetch leaderboard:', leaderboardData.message);

      setProfiles(Array.isArray(profilesData) ? profilesData : []);
      setLeaderboard(Array.isArray(leaderboardData) ? leaderboardData : []);
      setEvents(Array.isArray(eventsData) ? eventsData : []);
      setProjects(Array.isArray(projectsData) ? projectsData : []);
      setNotifications(Array.isArray(notificationsData) ? notificationsData : []);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [API_BASE]);

  const addProject = (newProject) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  return (
    <DataContext.Provider value={{ profiles, leaderboard, events, notifications, projects, isLoadingData, error, addProject }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);