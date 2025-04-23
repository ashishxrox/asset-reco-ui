import React, { useState, useEffect } from 'react';

const LocationSelector = ({ onLocationSelect }) => {
    const [search, setSearch] = useState('');
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState(null);

    const fetchLocations = async (searchTerm = '') => {
        setLoading(true);
        try {
            const response = await fetch('https://devapi.monetez.com/api/univerze/v1/alllocationsforMediaPlanner', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: searchTerm }),
            });
            const data = await response.json();
            setLocations(data?.data || []);
        } catch (err) {
            console.error("Failed to fetch locations", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);

        if (typingTimeout) clearTimeout(typingTimeout);
        setTypingTimeout(setTimeout(() => {
            fetchLocations(value);
        }, 400));
    };

    const handleSelect = (location) => {
        onLocationSelect(location.location_id); // send only location id to App
    };

    return (
        <div className="w-[400px] min-h-[350px] max-h-[350px] mx-auto mt-10  p-4  rounded-xl shadow-lg bg-white">
            <h2 className="text-lg font-semibold mb-3">Select Your Location</h2>
            <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search your location..."
                className="w-full p-2 border rounded-md mb-3"
            />
            {loading ? (
                <p className="text-gray-500">Loading...</p>
            ) : (
                <ul className="max-h-[200px] overflow-y-auto rounded-md">
                    {locations.length > 0 ? (
                        locations.map((loc) => (
                            <li
                                key={loc.id}
                                className="p-2 cursor-pointer hover:bg-blue-100 border-b border-[#d9d9d9]"
                                onClick={() => handleSelect(loc)}
                            >
                                {loc.company_name}
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500 p-2">No locations found</p>
                    )}
                </ul>
            )}
        </div>
    );
};

export default LocationSelector;
