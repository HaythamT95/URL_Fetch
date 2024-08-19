import express from "express";
import expressXssSanitizer from "express-xss-sanitizer";
import { getMetaData } from "../service/metadataService.js";
import logger from "../utils/logger.js";

const controllerOrder = express.Router();

controllerOrder.post('/metadata', async (req, res) => {

    logger.info(`${req.method}-${req.originalUrl}`)

    const { urls } = req.body;
    const sanitize_urls = expressXssSanitizer.sanitize(urls); //dont allow <script> tag to be send

    if (!urls || !Array.isArray(urls)) {
        logger.error('Invalid request format. Expected an array of URLs.')
        return res.status(400).json({ error: 'Invalid request format. Expected an array of URLs.' });
    }

    try {
        const results = await getMetaData(sanitize_urls);

        logger.info(`Retreived data - ${results}`)

        res.status(200).json(results);
    } catch (error) {
        logger.error(`Error processing URLs: ${error}`)
        res.status(500).json({ error: 'Failed to process URLs' });
    }
});

export default controllerOrder;
