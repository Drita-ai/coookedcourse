import { useContext, useState, useEffect, createContext } from 'react';
import axios from 'axios';
// import {  } from 'react-toastify';

const SearchedItemsContext = createContext();

// JSON file server
const BASE_URL = 'http://localhost:3000'

function SearchedItemsProvider({ children }) {
    const [searchedItems, setSearchedItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    /*
    const notify = () => {
        toast(CustomNotification, {
            data: {
                title: 'Oh Snap!',
                content: 'Something went wrong',
            },
            progress: 0.2,
            ariaLabel: 'Something went wrong',
            autoClose: false,
        });
    }
        */

    // FETCH Videos and Playlists
    async function fetchVideosAndPlaylists() {
        try {
            setIsLoading(true);
            const response = await axios.get(`${BASE_URL}/items`);
            const data = await response.json()
            setSearchedItems(data)
        } catch (err) {
            console.log("There was an error loading the data..." + err)
        } finally {
            setIsLoading(false)
        }
    }

    return <SearchedItemsContext.Provider value={{ searchedItems, isLoading, fetchVideosAndPlaylists }}>
        {children}
    </SearchedItemsContext.Provider>
}

function useSearchedItems() {
    const context = useContext(SearchedItemsContext);

    if (context === undefined) throw new Error("SearchedItems Context was used outside the CitiesProvider");

    return context;
}

export { SearchedItemsProvider, useSearchedItems }
