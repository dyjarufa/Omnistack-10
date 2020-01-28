import React, { useState, useEffect } from 'react';


function DevForm({ onSubmit }) {

  const [github_username, setGithubUserName] = useState('');
  const [techs, setTechs] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  /** Recebe 2 parametros: 1º a função, 2º quando será chamada */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => { /**formato de callback */
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
      },
      (err) => {
        console.log(err);
      },
      {
        timeout: 30000,
      }
    )
  }, []);

  /**Essa função serve para buscar a propriedade onSubmit dentro desse componente */
  async function handleSubmit(e) {
    e.preventDefault();

    /** executo a função onSubmit do componente  Pai no momento em que submeter o formulário*/
    /** Passo um objeto com os dados do usuário para a funcção  handleAddDev do componente pai,
     * esse objeto será armazenado no data da função handleAddDev
    */
    await onSubmit({
      github_username,
      techs,
      latitude,
      longitude
    });
    /**Limpar campos após o submit */
    setGithubUserName('');
    setTechs('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-block">
        <label htmlFor="github_username">Usuário do Github</label>
        <input
          name="github_username"
          id="github_username"
          required
          value={github_username}
          onChange={e => setGithubUserName(e.target.value)}
        />
      </div>

      <div className="input-block">
        <label htmlFor="techs">Tecnologias</label>
        <input
          name="techs"
          id="techs"
          required
          value={techs}
          onChange={e => setTechs(e.target.value)}
        />
      </div>

      <div className="input-group">
        <div className="input-block">
          <label htmlFor="latitude">Latitude</label>
          <input
            type="number"
            name="latitude"
            id="latitude"
            required
            value={latitude}
            onChange={e => setLatitude(e.target.value)}
          />
        </div>
        <div className="input-block">
          <label htmlFor="longitude">Longitude</label>
          <input
            type="number"
            name="longitude"
            id="longitude"
            required
            value={longitude}
            onChange={e => setLongitude(e.target.value)}
          />
        </div>
      </div>
      <button type="submit">Salvar</button>
    </form>
  );
}

export default DevForm;