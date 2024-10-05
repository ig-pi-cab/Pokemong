import React from 'react';

const PokemonCard = ({ pokemon, onEdit, onDelete }) => {
  return (
    <div className="pokemon-card">
      <h2>{pokemon.nombre}</h2>
      <p>Región: {pokemon.region.nombre}</p>
      <p>Tipos: {pokemon.tipos.map(tipo => tipo.nombre).join(', ')}</p>
      <div className="card-buttons">
        <button className="card-button" onClick={() => onEdit(pokemon.id)}>Editar</button>
        <button className="delete-button" onClick={() => onDelete(pokemon.id)}>Eliminar</button>
      </div>
    </div>
  );
};

export default PokemonCard;
