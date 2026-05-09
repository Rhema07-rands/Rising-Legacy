// Central API config — reads VITE_API_URL at build time.
// In production (Render), this is set to the deployed backend URL.
// Locally, it defaults to http://localhost:8000
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export default API_BASE;
