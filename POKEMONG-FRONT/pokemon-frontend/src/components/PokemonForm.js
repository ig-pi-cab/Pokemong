import React, { useState, useEffect } from 'react';

const PokemonForm = ({ formData, regions, types, onSubmit, onChange, onTypeChange, view }) => {
  const [secondTypeVisible, setSecondTypeVisible] = useState(false); 
  const [firstType, setFirstType] = useState(''); 
  const [secondType, setSecondType] = useState(''); 

  // Populate types on update
  useEffect(() => {
    if (formData.tipos_ids.length > 0) {
      setFirstType(formData.tipos_ids[0] || '');  
      if (formData.tipos_ids[1]) {
        setSecondType(formData.tipos_ids[1] || ''); 
        setSecondTypeVisible(true);  
      }
    } else {
      // Resets on Create
      setFirstType('');
      setSecondType('');
      setSecondTypeVisible(false);
    }
  }, [formData.tipos_ids, view]);

  const handleFirstTypeChange = (e) => {
    const selectedType = e.target.value;
    setFirstType(selectedType);
    setSecondTypeVisible(true); 
    onTypeChange(selectedType, secondType); 
  };

  const handleSecondTypeChange = (e) => {
    const selectedType = e.target.value;
    setSecondType(selectedType);
    onTypeChange(firstType, selectedType); 
  };

  return (
    <div className="pokemon-form-card">
      <h2>{view === 'create' ? 'Crear Pokémon' : 'Editar Pokémon'}</h2>
      <div className="pokemon-info">
        {/* Nombre */}
        <p>
          <strong>Nombre:</strong>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del Pokémon"
            value={formData.nombre}
            onChange={onChange}
            className="pokemon-form-input"
          />
        </p>

        {/* Region */}
        <p>
          <strong>Región:</strong>
          <select
            name="region_id"
            value={formData.region_id}
            onChange={onChange}
            className="pokemon-form-input"
          >
            <option value="">Selecciona una región</option>
            {regions.map(region => (
              <option key={region.id} value={region.id}>
                {region.nombre}
              </option>
            ))}
          </select>
        </p>

        {/* First Type */}
        <p>
          <strong>Tipo:</strong>
          <select
            name="tipo_1"
            value={firstType}
            onChange={handleFirstTypeChange}
            className="pokemon-form-input"
          >
            <option value="">Selecciona un tipo</option>
            {types.map(tipo => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre}
              </option>
            ))}
          </select>
        </p>

        {/* Second Type*/}
        {secondTypeVisible && (
          <p>
            <strong>Otro Tipo (opcional):</strong>
            <select
              name="tipo_2"
              value={secondType} 
              onChange={handleSecondTypeChange}
              className="pokemon-form-input"
            >
              <option value="">Selecciona otro tipo</option>
              {types
                .filter(tipo => tipo.id !== firstType)
                .map(tipo => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
            </select>
          </p>
        )}

        <button className="form-button" onClick={onSubmit}>
          {view === 'create' ? 'Crear Pokémon' : 'Actualizar Pokémon'}
        </button>
      </div>
    </div>
  );
};

export default PokemonForm;
