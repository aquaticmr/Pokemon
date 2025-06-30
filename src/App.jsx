import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [pokemon, setPokemon] = useState(null);
  const [pokemonList, setPokemonList] = useState([]);
  const [offset, setOffset] = useState(0); // for pagination
  const limit = 12;

  useEffect(() => {
    fetchPokemonPage(offset);
  }, [offset]);

  async function fetchPokemonPage(currentOffset) {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${currentOffset}`
      );
      const data = await response.json();

      const details = await Promise.all(
        data.results.map(async (p) => {
          const res = await fetch(p.url);
          return await res.json();
        })
      );

      setPokemonList(details);
    } catch (error) {
      alert("Failed to load Pokémon.");
    }
  }

  async function searchPokemon() {
    if (!query.trim()) {
      alert("Please enter a Pokémon name.");
      return;
    }

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`
      );
      if (!response.ok) throw new Error("Not found");
      const data = await response.json();
      setPokemon(data);
      setQuery("");
    } catch (error) {
      alert("Pokémon not found. Please check the spelling.");
      setPokemon(null);
    }
  }

  return (
    <>
   <>
  <div className="App">
    <div className="pokedex-wrapper">
      {/* Search Section */}
      <div className="search-section">
        <input
          type="text"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter Pokémon name"
          value={query}
        />
        <button onClick={searchPokemon}>Search</button>
      </div>

      {/* Search Result */}
      {pokemon && (
        <div className="pokemon-display">
          <h1>{pokemon.name}</h1>
          <img src={pokemon.sprites?.front_default} alt={pokemon.name} />
          <h2>Height: {pokemon.height / 10} m</h2>
          <h2>Weight: {pokemon.weight / 10} kg</h2>
          <h2>
            Abilities:{" "}
            {pokemon.abilities.map((a) => a.ability.name).join(", ")}
          </h2>
        </div>
      )}

      {/* Pokémon List */}
      <div className="pokemon-section">
        <ul className="pokemon-list-ul">
          {pokemonList.map((p, index) => (
            <li key={index} className="pokemon-item" onMouseEnter={() => setQuery(p.name)} onClick={searchPokemon}>
              {p.name}
              <br />
              <img src={p.sprites?.front_default} alt={p.name} />
            </li>
          ))}
        </ul>

        {/* Pagination */}
        <div className="pagination-controls">
          {offset > 0 && (
            <button onClick={() => setOffset(offset - limit)}>⬅️ Previous</button>
          )}
          <button onClick={() => setOffset(offset + limit)}>Next ➡️</button>
        </div>
      </div>
    </div>
  </div>
</>
</>
  );
}

export default App;
