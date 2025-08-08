import { useContext, useState, useEffect, createContext } from 'react';
import axios from 'axios';
// import {  } from 'react-toastify';

const SearchedItemsContext = createContext();

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

    return <SearchedItemsContext.Provider value={{ searchedItems, isLoading }}>
        {children}
    </SearchedItemsContext.Provider>
}

function useSearchedItems() {
    const context = useContext(SearchedItemsContext);

    if (context === undefined) throw new Error("SearchedItems Context was used outside the CitiesProvider");

    return context;
}

export { SearchedItemsProvider, useSearchedItems }
