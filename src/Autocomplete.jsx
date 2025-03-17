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
let idx = 0;
const simulateRaceCondition = true;

const getFruits = (query, { signal }) => {
  console.log("Called", query);
  return new Promise((res, rej) => {
    const filteredFruits = fruits.filter((fruit) =>
      fruit.toLowerCase().includes(query.toLowerCase())
    );

    const delay = simulateRaceCondition
      ? idx === 0
        ? 3000
        : 300
      : Math.random() * 1000;

    setTimeout(() => {
      if (signal.aborted) {
        rej(new Error("Abort Error"));
      } else {
        res(filteredFruits);
      }
    }, delay);
    idx++;
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
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);

  const handlQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const getData = useCallback(async (debouncedQuery, signal) => {
    try {
      setIsLoading(true);
      setSuggestions([]);

      const data = await getFruits(debouncedQuery, {
        signal,
      });
      setSuggestions(data);
    } catch (err) {
      if (err.message === "Abort Error") return;
      console.dir(err);
      setIsError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    if (debouncedQuery.trim().length > 3) {
      getData(debouncedQuery, controller.signal);
    } else {
      setSuggestions([]);
    }

    // The cleanup function is important to avoid race condition
    return () => controller.abort();
  }, [debouncedQuery, getData]);

  /** START: Alternative to useDebounce */
  //   const getData = async () => {
  //     const data = await getFruits(query);
  //     setSuggestions(data);
  //   };

  //   useEffect(() => {
  //     let token = null;
  //     if (query.trim().length > 3) {
  //       token = setTimeout(getData, 300);
  //     } else {
  //       setSuggestions([]);
  //     }

  //     return () => clearTimeout(token);
  //   }, [query]);
  /** END */

  return (
    <div className="autocomplete-container">
      <input
        type="text"
        value={query}
        placeholder="Search..."
        onChange={handlQueryChange}
      />
      {isLoading && <p className="suggestion-container">Loading...</p>}
      {suggestions.length > 0 && (
        <ul className="suggestion-container suggestion-box">
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
