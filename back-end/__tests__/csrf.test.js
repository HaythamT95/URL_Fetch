import chai from 'chai';
import supertest from 'supertest';
import express from 'express';
import session from 'express-session';

const { expect } = chai;

const app = express();
app.use(session({
    secret: 'test_secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, 
        httpOnly: true,
        sameSite: 'strict',
    },
}));

app.get('/session-test', (req, res) => {
    if (req.session.views) {
        req.session.views++;
    } else {
        req.session.views = 1;
    }
    res.json({ views: req.session.views });
});

const request = supertest(app);

describe('Session Middleware Tests', function () {
    /*
        The first test makes a request to the /session-test route and verifies that a session was created by checking the set-cookie header.
        It also checks that the session data (the views counter) is properly initialized.
    */
    it('should create a session and set the session cookie', async function () {

        const response = await request.get('/session-test');


        expect(response.body.views).to.equal(1);


        const cookies = response.headers['set-cookie'];
        expect(cookies).to.exist;
        expect(cookies[0]).to.include('connect.sid');
    });

    /**
     * The second test sends two sequential requests.
     * The first request initializes the session, and the second request includes the session cookie returned by the first response.
        This ensures that the session data persists across requests, as expected in session-based authentication.
     */
    it('should persist session data across multiple requests', async function () {
        let response = await request.get('/session-test');

        const sessionCookie = response.headers['set-cookie'][0];

        response = await request.get('/session-test')
            .set('Cookie', sessionCookie);

        expect(response.body.views).to.equal(2);
    });
});
