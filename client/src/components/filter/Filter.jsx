import { useEffect, useState } from "react";
import "./filter.scss";
import { useSearchParams } from "react-router-dom";

function Filter() {

  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState({
    type: searchParams.get("type") || "",
    city: searchParams.get("city") || "",
    vehicletype: searchParams.get("vehicletype") || "",
    minPrice: searchParams.get("minPrice") || 0,
    maxPrice: searchParams.get("maxPrice") || 1000000000,
    year: searchParams.get("year") || 2010,
  });

  useEffect(() => {
    // Update the query state whenever searchParams change
    setQuery({
      type: searchParams.get("type") || "",
      city: searchParams.get("city") || "",
      vehicletype: searchParams.get("vehicletype") || "",
      minPrice: searchParams.get("minPrice") || 0,
      maxPrice: searchParams.get("maxPrice") || 1000000000,
      year: searchParams.get("year") || "",
    });
  }, [searchParams]);

  const handleChange = (e) => {
    setQuery({
      ...query,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilter = () => {
    setSearchParams(query);
  };

  return (
    <div className="filter">
      <h1>
        Search results for <b>{searchParams.get("city")}</b>
      </h1>
      <div className="top">
        <div className="item">
          <label htmlFor="city">Location</label>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="City Location"
            onChange={handleChange}
            defaultValue={query.city}
          />
        </div>
      </div>
      <div className="bottom">
        <div className="item">
          <label htmlFor="type">Type</label>
          <select name="type" id="type" onChange={handleChange} defaultValue={query.type}>
            <option value="">any</option>
            <option value="buy">Buy</option>
            <option value="rent">Rent</option>
          </select>
        </div>
        <div className="item">
          <label htmlFor="vehicletype">Vehicle Type</label>
          <select name="vehicletype" id="vehicletype" onChange={handleChange} defaultValue={query.vehicletype}>
            <option value="">any</option>
            <option value="Car">Car</option>
            <option value="Van">Van</option>
            <option value="SUV">SUV</option>
            <option value="Pickup">Pickup</option>
            <option value="Lorry">Lorry</option>
            <option value="Bike">Bike</option>
            <option value="Bus">Bus</option>
            <option value="Construction">Construction</option>
          </select>
        </div>
        <div className="item">
          <label htmlFor="minPrice">Min Price</label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            min={0}
            placeholder="any"
            onChange={handleChange}
            defaultValue={query.minPrice}
          />
        </div>
        <div className="item">
          <label htmlFor="maxPrice">Max Price</label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            min={10000}
            placeholder="any"
            onChange={handleChange}
            defaultValue={query.maxPrice}
          />
        </div>
        <div className="item">
          <label htmlFor="year">Year</label>
          <input
            type="number"
            id="year"
            name="year"
            min={1900}
            placeholder="any"
            onChange={handleChange}
          // defaultValue={query.year}
          />
        </div>
        <button onClick={handleFilter}>
          <img src="/search.png" alt="" />
        </button>
      </div>
    </div>
  );
}

export default Filter;
