import React, { useState } from 'react';
import styles from '../styles/homepage.module.css'
import axios from "axios"
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
    const navigate = useNavigate();

    const [inputCount, setInputCount] = useState(0);
    const [msgUpdate, setMsgUpdate] = useState('')
    const [loading, setLoading] = useState(false);

    function addInputWithValues() {
        const inputGroup = document.querySelector('.inp-group');

        const div_ = document.createElement('div');

        const option1 = document.createElement('p');
        option1.innerText = 'URL';

        div_.appendChild(option1);

        const name = document.createElement('input');
        name.type = "text";
        name.placeholder = "Enter name";
        name.value = '';

        const btnDelete = document.createElement('a');
        btnDelete.className = styles.delete;
        btnDelete.innerHTML = "&times;";

        btnDelete.addEventListener('click', function () {
            this.parentElement.remove();
            setInputCount(inputCount => inputCount - 1);
        });

        const flex = document.createElement('div');
        flex.className = `${styles.flex} flex`

        flex.appendChild(div_);
        flex.appendChild(name);
        flex.appendChild(btnDelete);

        inputGroup.appendChild(flex);
        setInputCount(inputCount + 1);
    }

    async function submitPreferences() {
        const inputGroup = document.querySelector('.inp-group');
        let urls = []

        inputGroup.querySelectorAll('.flex').forEach(flex => {
            const url = flex.querySelector('input').value;
            urls.push(url);
        });

        let filteredUrls = urls.filter(url => url); //remove empty urls

        if (filteredUrls.length < 1) {
            setMsgUpdate('There should be at least 3 URLs given');
            setTimeout(() => setMsgUpdate(''), 5000);
            return;
        }

        setLoading(true);

        try {
            await axios.post(`http://localhost:5555/url/metadata`, { urls: filteredUrls }).then(res => {
                if (res.status === 200) {
                    navigate('/FetchedData', { state: { data: res.data } });
                } else {
                    console.error('Error retreiving data');
                    setMsgUpdate('Error retreiving data')
                    setTimeout(() => setMsgUpdate(''), 5000);
                }
            })

        } catch (error) {
            console.error('Network error:', error);
            setMsgUpdate("Error occured")
            setTimeout(() => setMsgUpdate(''), 5000);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.wrap}>
                <h1>URLs</h1>
                <a href="#" className={styles.add} onClick={addInputWithValues}>&#43;</a>
            </div>
            <div className='inp-group'>

            </div>
            {msgUpdate && <div className={styles.centerdiv}><p className={styles.errormessage}>{msgUpdate}</p></div>}
            {loading && (
                <div className={styles.loaderContainer}>
                    <div className={styles.loader}></div>
                    <p className={styles.fetchingText}>Fetching data, please wait</p>
                </div>
            )}

            {inputCount > 0 &&
                <div className={styles.centerdiv}>
                    <button type="submit" className={styles.submitbtn} onClick={submitPreferences}>Submit</button>
                </div>}
        </div>
    )
}

export default Homepage;