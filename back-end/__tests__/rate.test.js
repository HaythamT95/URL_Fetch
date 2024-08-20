import chai from 'chai';
import axios from "axios"
import dotenv from "dotenv"

dotenv.config()
const { expect } = chai;

const apiUrl = `http://localhost:${process.env.PORT}/url/metadata`;

const validUrls = ["www.google.com", "www.youtube.com", "www.meta.com"]

describe('Backend API Tests', function () {

    // Test for GET /url/metadata with alot of requests
    it('should block requests after exceeding the limit', async function () {
        this.timeout(10000)

        const requests = [];
        const encodedUrls = encodeURIComponent(JSON.stringify(validUrls));

        for (let i = 0; i < 6; i++) {
            requests.push(
                axios.get(`${apiUrl}?urls=${encodedUrls}`, {
                    headers: { 'Accept': 'text/event-stream' }
                }).catch(err => err.response) 
            );
        }

        const responses = await Promise.all(requests);

        const has200 = responses.some(res => res.status === 200);
        const has429 = responses.some(res => res.status === 429);

        expect(has429).to.be.true;
        expect(has200).to.be.true;

    });
})