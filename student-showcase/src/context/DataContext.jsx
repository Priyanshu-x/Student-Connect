import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [profiles, setProfiles] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      setError(null);
      try {
        const token = localStorage.getItem('sgsu_token'); // Get token from localStorage
        const headers = {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        };

        const [profilesRes, leaderboardRes, eventsRes, notificationsRes] = await Promise.all([
          fetch(`${API_BASE}/api/users/profiles`, { headers }),
          fetch(`${API_BASE}/api/users/leaderboard`, { headers }),
          fetch(`${API_BASE}/api/events`, { headers }),
          fetch(`${API_BASE}/api/notifications`, { headers }), // Assuming a notifications endpoint
        ]);

        const profilesData = await profilesRes.json();
        const leaderboardData = await leaderboardRes.json();
        const eventsData = await eventsRes.json();
        const notificationsData = await notificationsRes.json();

        if (!profilesRes.ok) throw new Error(profilesData.message || 'Failed to fetch profiles');
        if (!leaderboardRes.ok) throw new Error(leaderboardData.message || 'Failed to fetch leaderboard');
        if (!eventsRes.ok) throw new Error(eventsData.message || 'Failed to fetch events');
        if (!notificationsRes.ok) throw new Error(notificationsData.message || 'Failed to fetch notifications');

        setProfiles(Array.isArray(profilesData) ? profilesData : []); // Ensure it's an array
        setLeaderboard(leaderboardData);
        setEvents(eventsData);
        setNotifications(notificationsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [API_BASE]);

  return (
    <DataContext.Provider value={{ profiles, leaderboard, events, notifications, isLoadingData, error }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);