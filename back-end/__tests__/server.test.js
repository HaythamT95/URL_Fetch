import chai from 'chai';
import axios from "axios"

const { expect } = chai;

const apiUrl = 'http://localhost:5555/url/metadata';

const validUrls = ["www.google.com", "www.youtube.com", "www.meta.com"]
const invalidUrls = ["www.aasfascasdcsadf.com", "<script>alert(111)</script>", "www.meta.com"]

describe('Backend API Tests', function () {
    // Test for GET /url/metadata with valid URLs
    it('should stream data for valid URLs', async function () {
        this.timeout(10000)
        const encodedUrls = encodeURIComponent(JSON.stringify(validUrls));

        const response = await axios.get(`${apiUrl}?urls=${encodedUrls}`, {
            headers: { 'Accept': 'text/event-stream' }
        });

        expect(response.status).to.equal(200);
    });

    // Test for GET /url/metadata with an empty URL list
    it('should return 204 with an empty URL list', async function () {
        this.timeout(10000)

        const response = await axios.get(`${apiUrl}?urls=[]`, {
            headers: { 'Accept': 'text/event-stream' }
        });

        expect(response.status).to.equal(204);
    });

    // Test for GET /url/metadata with missing URLs parameter
    it('should return 400 for missing URLs parameter', async function () {
        this.timeout(10000)

        try {
            await axios.get(apiUrl, {
                headers: { 'Accept': 'text/event-stream' }
            });

        } catch (error) {
            expect(error.response.status).to.equal(400);
        }
    });

    // Test for GET /url/metadata with malformed URL parameter
    it('should return 400 for malformed URL parameter', async function () {
        this.timeout(10000)
        const encodedUrls = encodeURIComponent(JSON.stringify(invalidUrls));

        try {
            await axios.get(`${apiUrl}?urls=${encodedUrls}`, {
                headers: { 'Accept': 'text/event-stream' }
            });
        }
        catch (error) {
            expect(error.response.data).to.have.property('error').that.includes('Failed to retrieve metadata');
        }
    });
});