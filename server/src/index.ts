import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import { Issuer, generators } from 'openid-client';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { Request } from 'express';

// Routes
import projectRoutes from './routes/projectRoutes';
import taskRoutes from './routes/taskRoutes';
import searchRoutes from './routes/searchRoutes';
import userRoutes from './routes/userRoutes';
import teamRoutes from './routes/teamRoutes';


declare module "express-serve-static-core" {
  interface Request {
    isAuthenticated?: boolean;
  }
}

declare module "express-session" {
  interface SessionData {
    userInfo?: { [key: string]: any }; // Adjust according to your user schema
    nonce?: string;
    state?: string;
  }
}



dotenv.config();

const app = express();

// Initialize OpenID Client
let client: any;
async function initializeClient() {
  const issuer = await Issuer.discover('https://cognito-idp.us-east-1.amazonaws.com/us-east-1_HS9IdSEzO');
  client = new issuer.Client({
    client_id: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID as string,
    client_secret: process.env.COGNITO_CLIENT_SECRET,
    redirect_uris: [process.env.REDIRECT_URI || ''],
    response_types: ['code'],
  });
}
initializeClient().catch(console.error);

// Middleware Setup
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(morgan('common'));
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(bodyParser.urlencoded({ extended: false }));

// Session Configuration
app.use(
  session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: false,
  })
);

// Authentication Check Middleware
const checkAuth = (req: any, res: any, next: any) => {
  if (!req.session.userInfo) {
    req.isAuthenticated = false;
  } else {
    req.isAuthenticated = true;
  }
  next();
};

// Routes
app.get('/', checkAuth, (req, res) => {
  res.send({
    message: 'Home Route',
    isAuthenticated: req.isAuthenticated,
    userInfo: req.session.userInfo,
  });
});

app.get('/login', (req, res) => {
  const nonce = generators.nonce();
  const state = generators.state();

  req.session.nonce = nonce;
  req.session.state = state;

  const authUrl = client.authorizationUrl({
    scope: 'email openid phone',
    state: state,
    nonce: nonce,
  });

  res.redirect(authUrl);
});

// Callback route after Cognito authentication
app.get('/callback', async (req, res) => {
  try {
    const params = client.callbackParams(req);
    const tokenSet = await client.callback(
      process.env.REDIRECT_URI || '',
      params,
      {
        nonce: req.session.nonce,
        state: req.session.state,
      }
    );

    const userInfo = await client.userinfo(tokenSet.access_token);
    req.session.userInfo = userInfo;

    res.redirect('/');
  } catch (err) {
    console.error('Callback error:', err);
    res.redirect('/');
  }
});

// Logout route
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    const logoutUrl = `https://us-east-1hs9idsezo.auth.us-east-1.amazoncognito.com/logout?client_id=21fdgb4fiqd2uhujr3f55j9je1&logout_uri=<logout uri>`;
    res.redirect(logoutUrl);
  });
})


// Additional Routes for Projects, Tasks, Search, etc.
app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);
app.use('/search', searchRoutes);
app.use('/users', userRoutes);
app.use('/teams', teamRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
