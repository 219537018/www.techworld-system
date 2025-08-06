import { createContext } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const backendUrl = "http://localhost:4000";

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Format job date to "12 May 2025" from "2025-05-12" or Date object
    const formatJobDate = (date) => {
        const d = typeof date === 'string' ? new Date(date) : date;
        const day = d.getDate();
        const month = months[d.getMonth()];
        const year = d.getFullYear();
        return `${day} ${month} ${year}`;
    };

    // Check if the job closing date has passed
    const isJobClosed = (closingDate) => {
        const today = new Date();
        const close = new Date(closingDate);
        return today > close;
    };

    const value = {
        backendUrl,
        formatJobDate,
        isJobClosed,
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
