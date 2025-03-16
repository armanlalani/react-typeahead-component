import { useState, useEffect } from "react";
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
  return new Promise((res, rej) => {
    const filteredFruits = fruits.filter((fruit) =>
      fruit.toLowerCase().includes(query.toLowerCase())
    );

    setTimeout(() => {
      res(filteredFruits);
    }, Math.random() * 1000);
  });
};

function Autocomplete() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handlQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const getData = async () => {
    const data = await getFruits(query);
    console.log(data);
    setSuggestions(data);
  };

  useEffect(() => {
    if (query.length > 3) {
      getData();
    }

    setSuggestions([]);
  }, [query]);

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
