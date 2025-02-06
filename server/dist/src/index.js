"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_session_1 = __importDefault(require("express-session"));
const openid_client_1 = require("openid-client");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
// Routes
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const searchRoutes_1 = __importDefault(require("./routes/searchRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const teamRoutes_1 = __importDefault(require("./routes/teamRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Initialize OpenID Client
let client;
function initializeClient() {
    return __awaiter(this, void 0, void 0, function* () {
        const issuer = yield openid_client_1.Issuer.discover('https://cognito-idp.us-east-1.amazonaws.com/us-east-1_HS9IdSEzO');
        client = new issuer.Client({
            client_id: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID,
            client_secret: process.env.COGNITO_CLIENT_SECRET,
            redirect_uris: [process.env.REDIRECT_URI || ''],
            response_types: ['code'],
        });
    });
}
initializeClient().catch(console.error);
// Middleware Setup
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('common'));
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(body_parser_1.default.urlencoded({ extended: false }));
// Session Configuration
app.use((0, express_session_1.default)({
    secret: 'some secret',
    resave: false,
    saveUninitialized: false,
}));
// Authentication Check Middleware
const checkAuth = (req, res, next) => {
    if (!req.session.userInfo) {
        req.isAuthenticated = false;
    }
    else {
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
    const nonce = openid_client_1.generators.nonce();
    const state = openid_client_1.generators.state();
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
app.get('/callback', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = client.callbackParams(req);
        const tokenSet = yield client.callback(process.env.REDIRECT_URI || '', params, {
            nonce: req.session.nonce,
            state: req.session.state,
        });
        const userInfo = yield client.userinfo(tokenSet.access_token);
        req.session.userInfo = userInfo;
        res.redirect('/');
    }
    catch (err) {
        console.error('Callback error:', err);
        res.redirect('/');
    }
}));
// Logout route
app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
        }
        const logoutUrl = `https://us-east-1hs9idsezo.auth.us-east-1.amazoncognito.com/logout?client_id=21fdgb4fiqd2uhujr3f55j9je1&logout_uri=<logout uri>`;
        res.redirect(logoutUrl);
    });
});
// Additional Routes for Projects, Tasks, Search, etc.
app.use('/projects', projectRoutes_1.default);
app.use('/tasks', taskRoutes_1.default);
app.use('/search', searchRoutes_1.default);
app.use('/users', userRoutes_1.default);
app.use('/teams', teamRoutes_1.default);
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
