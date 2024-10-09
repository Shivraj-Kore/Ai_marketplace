import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Web3 from 'web3';
import axios from 'axios';
import gearSpinner from '../assets/gear-spinner.svg';

const StoreFront = () => {
  const [account, setAccount] = useState<string>('');
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [artists, setArtists] = useState<{ id: number, username: string }[]>([]); // Artists state
  const [selectedArtist, setSelectedArtist] = useState<number | null>(null); // State for selected artist
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  // Connect MetaMask
  const connectMetaMask = async () => {
    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          toast.success('MetaMask connected');
        } else {
          toast.error('No account found in MetaMask');
        }
      } else {
        toast.error('MetaMask not detected');
      }
    } catch (error: any) {
      toast.error(`Error connecting to MetaMask: ${error.message}`);
    }
  };

  // Fetch artists available from the backend
  const fetchArtists = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/artists-available');
      setArtists(response.data.artists); // Set the artists state with response data
    } catch (error) {
      toast.error('Failed to fetch artists');
    }
  };

  // Generate image
  const generateImage = async () => {
    if (!selectedArtist) {
      toast.error("Please select an artist");
      return;
    }
    
    setLoading(true); // Start loading

    try {
      const response = await axios.post('http://127.0.0.1:5000/store', {
        prompt,
        artist_id: selectedArtist, // Send the selected artist ID
      });
      const { image } = response.data;
      setGeneratedImage(`data:image/png;base64,${image}`);
      toast.success('Image generated successfully');
    } catch (error) {
      toast.error('Failed to generate image');
    } finally {
      setLoading(false); // End loading
    }
  };

  // Fetch artists when the component mounts
  useEffect(() => {
    fetchArtists();
  }, []);

  return (
    <>
      <div className="flex mt-[50px] text-white items-center justify-center ">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
          {/* MetaMask Connect Button */}
          <div className="mb-4">
            <button
              onClick={connectMetaMask}
              className="w-full py-2 bg-pink-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              Connect MetaMask
            </button>
            {account && (
              <p className="text-sm mt-2">Connected MetaMask account: {account}</p>
            )}
          </div>

          {/* Prompt Input */}
          <div className="mb-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-2 text-black"
              placeholder="Enter image prompt"
            />
          </div>

          {/* Dropdown for Artists */}
          <form className="max-w-sm mx-auto">
            <div className="flex text-white items-center justify-center ">
              <label
                htmlFor="artists"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Select an Artist
              </label>
            </div>
            <div>
              <select
                id="artists"
                onChange={(e) => setSelectedArtist(Number(e.target.value))}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">Select an artist</option>
                {artists.map((artist) => (
                  <option key={artist.id} value={artist.id}>
                    {artist.username}
                  </option>
                ))}
              </select>
            </div>
          </form>

          <button
            onClick={generateImage}
            className="mt-4 w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Generate Image
          </button>

          {/* Display generated image */}
          {generatedImage && (
            <div className="mt-4">
              <img src={generatedImage} alt="Generated by Stable Diffusion" className="rounded-md" />
            </div>
          )}
            <div className='flex items-center justify-center'>

          {/* Loading Spinner */}
          {loading && (
              <img src={gearSpinner} alt="Generating..." height={140} width={140} className="mt-4" />
            )}
            </div>
        </div>
      </div>
    </>
  );
};

export default StoreFront;
