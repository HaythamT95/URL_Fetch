import express from "express";
import expressXssSanitizer from "express-xss-sanitizer";
import { getMetaData } from "../service/metadataService.js";
import logger from "../utils/logger.js";

const controllerRoute = express.Router();

controllerRoute.get('/metadata', async (req, res) => {

    logger.info(`${req.method}-${req.originalUrl}`)

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
        const urls = req.query.urls ? JSON.parse(req.query.urls) : [];

        if(urls.length < 3){
            logger.error('Less than 3 urls')
            return res.status(204).json({ error: 'Less than 3 urls' });
        }

        if (!urls || !Array.isArray(urls)) {
            logger.error('Invalid request format. Expected an array of URLs.')
            return res.status(400).json({ error: 'Invalid request format. Expected an array of URLs.' });
        }

        const sanitizedUrls = expressXssSanitizer.sanitize(urls);

        for (let url of sanitizedUrls) {
            const result = await getMetaData([url]);
            logger.info(`Retreived data - ${result}`)

            const metadata = result[0];
            res.status(200).write(`data: ${JSON.stringify(metadata)}\n\n`);
        }
        res.end(); 
    } catch (error) {
        logger.error(`Error streaming data: ${error}`);
        res.status(500).write(`data: ${JSON.stringify({ error: 'Failed to stream data' })}\n\n`);
        res.end();
    }
});


export default controllerRoute;
