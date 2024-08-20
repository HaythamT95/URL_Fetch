import React, { useEffect, useState } from 'react';
import styles from '../styles/fetched_data.module.css';
import { useLocation } from 'react-router-dom';
import dotenv from "dotenv"

dotenv.config()

const FetchedData = () => {
    const { state } = useLocation();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const queryParams = new URLSearchParams({
            urls: JSON.stringify(state?.urls || [])
        });

        const eventSource = new EventSource(`${process.env.SERVER_URL}?${queryParams.toString()}`);
    
        eventSource.onmessage = (event) => {
            const newData = JSON.parse(event.data);
            setData((prevData) => [...prevData, newData]);
        };
    
        eventSource.onerror = (error) => {
            setLoading(false);
            eventSource.close(); 
        };
    
        return () => {
            eventSource.close(); 
        };
    }, [state?.urls]);

    return (
        <div className={styles.container}>
            {loading && (
                <div className={styles.loaderContainer}>
                    <div className={styles.loader}></div>
                    <p className={styles.fetchingText}>Fetching data, please wait</p>
                </div>
            )}
            {data.length > 0 && data.map((item, index) => (
                <div key={index} className={styles.item}>
                    <div className={styles.title}>
                        {item.title ? item.title : 'Title is not available'}
                    </div>
                    <div className={styles.description}>
                        {item.description ? item.description : 'Description is not available'}
                    </div>
                    {item.image ? (
                        <img src={item.image} alt={item.title || 'Image'} className={styles.image} />
                    ) : (
                        <p>No image available</p>
                    )}
                </div>
            ))}
        </div>
    );
}

export default FetchedData;
