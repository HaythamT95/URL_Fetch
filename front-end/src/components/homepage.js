import React, { useState } from 'react';
import styles from '../styles/homepage.module.css'
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
    const navigate = useNavigate();

    const [inputCount, setInputCount] = useState(0);
    const [msgUpdate, setMsgUpdate] = useState('')

    function addInputWithValues() {
        const inputGroup = document.querySelector('.inp-group');

        const div_ = document.createElement('div');

        const urlNum = document.createElement('p');
        urlNum.innerText = `URL`;

        div_.appendChild(urlNum);

        const name = document.createElement('input');
        name.type = "text";
        name.placeholder = "Enter URL";
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
            if(url !== ''){
                urls.push(url);
            }
        });

        if (urls.length < 1) {
            setMsgUpdate('There should be at least 3 URLs given');
            setTimeout(() => setMsgUpdate(''), 5000);
            return;
        }

        navigate('/FetchedData', { state: { urls: urls } });
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

            {inputCount > 0 &&
                <div className={styles.centerdiv}>
                    <button type="submit" className={styles.submitbtn} onClick={submitPreferences}>Submit</button>
                </div>}
        </div>
    )
}

export default Homepage;