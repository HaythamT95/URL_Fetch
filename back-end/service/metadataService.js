
import got from "got";
import createMetascraper from "metascraper";
import metascraperDescription from 'metascraper-description';
import metascraperImage from 'metascraper-image';
import metascraperTitle from 'metascraper-title';
import logger from "../utils/logger.js";

export async function getMetaData(sanitize_urls) {
    logger.info(`Called getMetaData`)

    const metascraper = createMetascraper([metascraperDescription(), metascraperImage(), metascraperTitle()]);

    const results = await Promise.all(
        sanitize_urls.map(async (url) => {
            try {
                const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
                const { body: html } = await got(formattedUrl);

                const metadata = await metascraper({ html, url: formattedUrl });
                
                logger.info(`Returning from getMetaData`)

                return metadata;
            } catch (error) {
                logger.error(`Failed to retrieve metadata from ${url}`)
                return { url, error: 'Failed to retrieve metadata' };
            }
        })
    );
    return results;
}