import { useEffect, useState } from 'react';

interface Artists {
  name: string;
}

function StorePage() {
  const [artists, setArtists] = useState<Artists[]>([]);
  const [image, setImage] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [selectedArtist, setSelectedArtist] = useState<string>('Ed Mell');
  const token = localStorage.getItem('jwtToken');

  const getAllArtistsAndImage = async () => {
    try {
      const response = await fetch('http://localhost:5000/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt, selected_artist: selectedArtist })
      });

      const data = await response.json();
      setArtists(data.artists);
      setImage(data.image);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getAllArtistsAndImage();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    getAllArtistsAndImage();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input 
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter image prompt"
        />

        <select value={selectedArtist} onChange={(e) => setSelectedArtist(e.target.value)}>
          {artists.map((artist) => (
            <option key={artist.name} value={artist.name}>{artist.name}</option>
          ))}
        </select>

        <button type="submit">Generate Image</button>
      </form>

      <div>
        <h3>Generated Image:</h3>
        {image && <img src={`data:image/png;base64,${image}`} alt="Generated" />}
      </div>
    </>
  );
}

export default StorePage;
