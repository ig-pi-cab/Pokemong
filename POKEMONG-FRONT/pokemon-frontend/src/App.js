// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import { getAllPokemon, getRegions, getTypes, createPokemon, updatePokemon, deletePokemon } from './services/pokemon';
import PokemonCard from './components/PokemonCard';
import PokemonForm from './components/PokemonForm';

function App() {
  const [pokemonData, setPokemonData] = useState([]);
  const [regions, setRegions] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('view');
  const [formData, setFormData] = useState({ nombre: '', region_id: '', tipos_ids: [] });
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const initialUrl = 'http://127.0.0.1:8000/api/pokemons/';
  const regionsUrl = 'http://127.0.0.1:8000/api/regiones/';
  const typesUrl = 'http://127.0.0.1:8000/api/tipos/';

  useEffect(() => {
    fetchPokemons();
    fetchRegions();
    fetchTypes();
  }, []);

  const fetchPokemons = async () => {
    setLoading(true);
    try {
      const data = await getAllPokemon(initialUrl);
      setPokemonData(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchRegions = async () => {
    try {
      const data = await getRegions(regionsUrl);
      setRegions(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchTypes = async () => {
    try {
      const data = await getTypes(typesUrl);
      setTypes(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCreate = async () => {
    try {
      setError(null);
      await createPokemon(initialUrl, {
        nombre: formData.nombre,
        region_id: parseInt(formData.region_id),
        tipos_ids: formData.tipos_ids.map(id => parseInt(id))
      });
      fetchPokemons();
      setView('view');
    } catch (error) {
      setError(error.message);
    }
  };
  

  const handleUpdate = async () => {
    if (!selectedPokemon) return;
    try {
      setError(null);
      await updatePokemon(initialUrl, selectedPokemon.id, {
        ...formData,
        tipos_ids: formData.tipos_ids.map(id => parseInt(id)),
      });
      fetchPokemons();
      setView('view');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      setError(null);
      await deletePokemon(initialUrl, id);
      fetchPokemons();
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleTypeChange = (firstType, secondType) => {
    const selectedTypes = [firstType];
    if (secondType) {
      selectedTypes.push(secondType);
    }
    setFormData({ ...formData, tipos_ids: selectedTypes });
    setError(null);
  };

  const handleEdit = (id) => {
    const selected = pokemonData.find(p => p.id === id);
    setSelectedPokemon(selected);
    setFormData({
      nombre: selected.nombre,
      region_id: selected.region.id,
      tipos_ids: selected.tipos.map(tipo => tipo.id),
    });
    setView('update');
    setError(null);
  };

  const handleCreateMode = () => {
    setFormData({ nombre: '', region_id: '', tipos_ids: [] });
    setSelectedPokemon(null);
    setView('create');
    setError(null);
  };

  const handleReturnToView = () => {
    setView('view');
    setFormData({ nombre: '', region_id: '', tipos_ids: [] });
    setSelectedPokemon(null);
    setError(null);
  };
  
  return (
    <div className="App">
      <h1 onClick={handleReturnToView} style={{ cursor: 'pointer' }}>Pokemon API</h1>

      {view === 'view' && (
        <button onClick={handleCreateMode} className="create-button">
          +
        </button>
      )}
      {error && <div className="error-message">{error}</div>}

      {view === 'view' && (
        <div className="pokemon-grid">
          {pokemonData.map(pokemon => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              onEdit={handleEdit}
              onDelete={handleDelete}
              selectedPokemon={selectedPokemon}
            />
          ))}
        </div>
      )}

      {(view === 'create' || view === 'update') && (
        <PokemonForm
          formData={formData}
          regions={regions}
          types={types}
          onSubmit={view === 'create' ? handleCreate : handleUpdate}
          onChange={handleChange}
          onTypeChange={handleTypeChange}
          view={view}
        />
      )}
    </div>
  );
}

export default App;
