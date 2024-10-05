// src/services/pokemonService.js
export const getAllPokemon = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error fetching Pokémon');
    }
    return response.json();
  };
  
  export const getRegions = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error fetching regions');
    }
    return response.json();
  };
  
  export const getTypes = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error fetching types');
    }
    return response.json();
  };
  
  export const createPokemon = async (url, data) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Error creating Pokémon');
    }
    return response.json();
  };
  
  export const updatePokemon = async (url, id, data) => {
    const response = await fetch(`${url}${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Error updating Pokémon');
    }
    return response.json();
  };
  
  export const deletePokemon = async (url, id) => {
    const response = await fetch(`${url}${id}/`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error deleting Pokémon');
    }
  };
  