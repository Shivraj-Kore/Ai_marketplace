import { useEffect, useState } from 'react'


interface Artists {
    username:string,
    walletAddress:string
}
const HomePage = () => {
    const [artists , setArtists] = useState<Artists[]>([]);
    const token = localStorage.getItem('jwtToken');

    const getAllArtisis = async () => {
        try {
            const response = await fetch("http://localhost:5000/artists-available", {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
    
            const data = await response.json();
            setArtists(data.artists);
        } catch (error: any) {
            console.log(error.message);
        }
    };


    useEffect(() => {
        getAllArtisis();
    },[])
    return (
    <>
        <h1>Hello this is home , hese are artists available</h1>
    {artists.map((artist, i) => (
        <div key={i}>
            <div>{artist.username} : : {artist.walletAddress}</div> 
        </div>
    ))}
    
    </>
  )
}

export default HomePage
