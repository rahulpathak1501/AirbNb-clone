import React, { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import "../style/SearchBar.css";

interface Props {
  onSearch: (query: string, totalGuests: number) => void;
}

const SearchBar: React.FC<Props> = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const guestDropdownRef = useRef<HTMLDivElement>(null);

  const [guests, setGuests] = useState({
    adults: 0,
    children: 0,
    infants: 0,
    pets: 0,
  });

  const totalGuests = guests.adults + guests.children + guests.infants;

  const handleSearch = () => {
    onSearch(query, totalGuests);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      guestDropdownRef.current &&
      !guestDropdownRef.current.contains(event.target as Node)
    ) {
      setShowGuestDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const guestTypes = [
    {
      key: "adults",
      label: "Adults",
      description: "Ages 13 or above",
    },
    {
      key: "children",
      label: "Children",
      description: "Ages 2–12",
    },
    {
      key: "infants",
      label: "Infants",
      description: "Under 2",
    },
    {
      key: "pets",
      label: "Pets",
      description: (
        <a href="#" className="guest-link">
          Bringing a service animal?
        </a>
      ),
    },
  ];

  return (
    <div className="airbnb-search-bar">
      <div className="search-section">
        <span className="label">Where</span>
        <input
          type="text"
          placeholder="Search destinations"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="divider" />
      <div className="search-section">
        <span className="label">Check in</span>
        <input type="date" min={new Date().toISOString().split("T")[0]} />
      </div>
      <div className="divider" />
      <div className="search-section">
        <span className="label">Check out</span>
        <input type="date" min={new Date().toISOString().split("T")[0]} />
      </div>
      <div className="divider" />
      <div
        className="search-section guest-dropdown-wrapper"
        ref={guestDropdownRef}
      >
        <span className="label">Who</span>
        <div
          className="guest-selector"
          onClick={() => setShowGuestDropdown(!showGuestDropdown)}
        >
          {totalGuests > 0 ? `${totalGuests} guests` : "Add guests"}
        </div>

        {showGuestDropdown && (
          <div className="guest-dropdown">
            {guestTypes.map(({ key, label, description }) => (
              <div className="guest-row" key={key}>
                <div>
                  <div className="guest-type">{label}</div>
                  <div className="guest-age">{description}</div>
                </div>
                <div className="guest-controls">
                  <button
                    onClick={() =>
                      setGuests({
                        ...guests,
                        [key]: Math.max(
                          0,
                          guests[key as keyof typeof guests] - 1
                        ),
                      })
                    }
                  >
                    −
                  </button>
                  <span>{guests[key as keyof typeof guests]}</span>
                  <button
                    onClick={() =>
                      setGuests({
                        ...guests,
                        [key]: guests[key as keyof typeof guests] + 1,
                      })
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <button className="search-btn" onClick={handleSearch}>
        <FaSearch />
      </button>
    </div>
  );
};

export default SearchBar;
