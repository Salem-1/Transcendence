"use client"
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

const CampusData = () => {
  const { data: session } = useSession();
  const [campusData, setCampusData] = useState(null);

  useEffect(() => {
    const fetchCampusData = async () => {
      try {
        const res = await fetch("https://api.intra.42.fr/v2/campus/43/users?per_page=300&page=9", {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setCampusData(data);
        } else {
          console.error("Failed to fetch campus data");
        }
      } catch (error) {
        console.error("Error fetching campus data:", error);
      }
    };

    if (session?.accessToken) {
      fetchCampusData();
    }
  }, [session]);

  return (
    <div>
      {campusData ? (
        <pre>{JSON.stringify(campusData, null, 2)}</pre>
      ) : (
        <p>Loading campus data...</p>
      )}
    </div>
  );
};

export default CampusData;
