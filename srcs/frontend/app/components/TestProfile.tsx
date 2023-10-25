// TestProfile.tsx

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const TestProfile: React.FC = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (session) {
      try {
        setLoading(true);
        const response = await fetch('https://api.intra.42.fr/v2/me', {
          headers: {
            Authorization: `Bearer ${session.user.name}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUserData(userData);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  return (
    <div>
      <h2>Test Profile</h2>
      {loading && <p>Loading...</p>}
      {session ? (
        <div>
          <p>Welcome, {session.user.name}!</p>
          <button onClick={fetchData} disabled={loading}>
            Fetch User Data
          </button>
          {userData && (
            <div>
              <h3>User Data:</h3>
              <pre>{JSON.stringify(userData, null, 2)}</pre>
            </div>
          )}
        </div>
      ) : (
        <p>Please log in to view your profile.</p>
      )}
    </div>
  );
};

export default TestProfile;
