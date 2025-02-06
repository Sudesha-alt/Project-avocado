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
exports.initializeClient = initializeClient;
exports.getClient = getClient;
const openid_client_1 = require("openid-client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let client;
// Initialize OpenID Client
function initializeClient() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const issuer = yield openid_client_1.Issuer.discover(`https://cognito-idp.us-east-1.amazonaws.com/${process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID}`);
            client = new issuer.Client({
                client_id: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID,
                client_secret: process.env.SECRET_HASH,
                redirect_uris: ["https://prod.d33bfnbhhikuex.amplifyapp.com/"],
                response_types: ["code"],
            });
            console.log("OpenID Client initialized successfully.");
        }
        catch (error) {
            console.error("Error initializing OpenID Client:", error);
        }
    });
}
function getClient() {
    if (!client) {
        throw new Error("Client is not initialized. Call initializeClient first.");
    }
    return client;
}
