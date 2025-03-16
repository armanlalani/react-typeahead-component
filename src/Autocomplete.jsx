import { useState, useEffect, useCallback } from "react";
import "./autocomplete.css";

const fruits = [
  "Apple",
  "Apricot",
  "Avocado",
  "Banana",
  "Bilberry",
  "Blackberry",
  "Blackcurrant",
  "Blueberry",
  "Boysenberry",
  "Cantaloupe",
  "Cherimoya",
  "Cherry",
  "Clementine",
  "Coconut",
  "Cranberry",
  "Cucumber",
  "Currant",
  "Damson",
  "Date",
  "Dragonfruit",
  "Elderberry",
  "Fig",
  "Gooseberry",
  "Grape",
  "Grapefruit",
  "Guava",
  "Honeydew",
  "Huckleberry",
  "Jackfruit",
  "Jujube",
  "Kiwi",
  "Kumquat",
  "Lemon",
  "Lime",
  "Loganberry",
  "Loquat",
  "Lychee",
  "Mandarin",
  "Mango",
  "Marionberry",
  "Melon",
  "Nectarine",
  "Olive",
  "Orange",
  "Papaya",
  "Passionfruit",
  "Peach",
  "Pear",
  "Persimmon",
  "Pineapple",
  "Plantain",
  "Plum",
  "Pomegranate",
  "Prickly Pear",
  "Quince",
  "Raspberry",
  "Soursop",
  "Starfruit",
  "Strawberry",
  "Tangerine",
  "Watermelon",
];

const getFruits = (query) => {
  console.log("Called", query);
  return new Promise((res, rej) => {
    const filteredFruits = fruits.filter((fruit) =>
      fruit.toLowerCase().includes(query.toLowerCase())
    );

    setTimeout(() => {
      res(filteredFruits);
    }, Math.random() * 1000);
  });
};

function debounce(fn, wait = 3000) {
  let token;
  return function (...args) {
    clearTimeout(token);
    token = setTimeout(() => fn.apply(this, args), wait);
  };
}

function useDebounce(value, wait = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    let token = setTimeout(() => {
      setDebouncedValue(value);
    }, wait);

    return () => clearTimeout(token);
  }, [value, wait]);

  return debouncedValue;
}

function Autocomplete() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const debouncedQuery = useDebounce(query, 300);

  const handlQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const getData = useCallback(async () => {
    const data = await getFruits(debouncedQuery);
    setSuggestions(data);
  }, [debouncedQuery]);

  useEffect(() => {
    if (debouncedQuery.trim().length > 3) {
      getData();
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery, getData]);

  return (
    <div className="autocomplete-container">
      <input
        type="text"
        value={query}
        placeholder="Search..."
        onChange={handlQueryChange}
      />
      {suggestions.length > 0 && (
        <ul className="suggestion-box">
          {suggestions.map((item) => (
            <li key={item} className="suggestion-item">
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Autocomplete;
