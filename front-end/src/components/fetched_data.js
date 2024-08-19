import React from 'react';
import styles from '../styles/fetched_data.module.css';
import { useLocation } from 'react-router-dom';

const FetchedData = () => {
    const { state } = useLocation();
    const data = state?.data || [];

    return (
        <div className={styles.container}>
        {data.map((item, index) => (
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
