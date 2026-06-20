// Sanayah Travels API Client
// Falls back to localStorage when backend is unavailable

const API_BASE = window.location.origin + '/api';

// Token management
let _authToken = localStorage.getItem('sanayah_admin_token') || null;
function setToken(t) { _authToken = t; if (t) localStorage.setItem('sanayah_admin_token', t); else localStorage.removeItem('sanayah_admin_token'); }
function getToken() { return _authToken; }

async function apiFetch(path, opts) {
  opts = opts || {};
  opts.headers = opts.headers || {};
  opts.headers['Content-Type'] = 'application/json';
  if (_authToken) opts.headers['x-auth-token'] = _authToken;
  try {
    const res = await fetch(API_BASE + path, opts);
    if (res.status === 401) { setToken(null); return null; }
    if (!res.ok) return null;
    return await res.json();
  } catch(e) { return null; }
}

// Auth
async function apiLogin(username, password) {
  const data = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) });
  if (data && data.token) { setToken(data.token); return true; }
  return false;
}
async function apiChangePassword(current, next) {
  return await apiFetch('/auth/change-password', { method: 'POST', body: JSON.stringify({ currentPassword: current, newPassword: next }) });
}

// Reviews
async function apiGetReviews(all) {
  const data = await apiFetch('/reviews?all=' + (all ? 'true' : 'false'));
  if (data) return data;
  // Fallback to localStorage
  try { return JSON.parse(localStorage.getItem('sanayah_reviews') || '[]'); } catch(e) { return []; }
}
async function apiSubmitReview(r) {
  const data = await apiFetch('/reviews', { method: 'POST', body: JSON.stringify(r) });
  if (data) return data;
  // Fallback
  const reviews = JSON.parse(localStorage.getItem('sanayah_reviews') || '[]');
  reviews.unshift({ ...r, _id: Date.now().toString(), date: new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}), approved: false, status: 'pending' });
  localStorage.setItem('sanayah_reviews', JSON.stringify(reviews));
  return reviews[0];
}
async function apiApproveReview(id, approved) {
  return await apiFetch('/reviews/' + id, { method: 'PUT', body: JSON.stringify({ approved, status: approved ? 'approved' : 'rejected' }) });
}
async function apiDeleteReview(id) {
  return await apiFetch('/reviews/' + id, { method: 'DELETE' });
}

// Visitors
async function apiTrackVisitor(data) {
  await apiFetch('/visitors', { method: 'POST', body: JSON.stringify(data) });
}
async function apiGetVisitors(limit) {
  const data = await apiFetch('/visitors?limit=' + (limit||50));
  if (data) return data;
  try { return JSON.parse(localStorage.getItem('sanayah_visitors') || '[]'); } catch(e) { return []; }
}

// Contact form
async function apiSubmitContact(data) {
  await apiFetch('/contact/submit', { method: 'POST', body: JSON.stringify(data) });
}
async function apiGetContactSubmissions() {
  return await apiFetch('/contact/submissions');
}

// Airlines
async function apiGetAirlines() {
  const data = await apiFetch('/airlines');
  if (data) return data;
  try { return JSON.parse(localStorage.getItem('sanayah_airlines') || '[]'); } catch(e) { return []; }
}
async function apiSaveAirlines(al) {
  localStorage.setItem('sanayah_airlines', JSON.stringify(al));
  return await apiFetch('/airlines', { method: 'POST', body: JSON.stringify(al) });
}
async function apiAddAirline(a) {
  return await apiFetch('/airlines', { method: 'POST', body: JSON.stringify(a) });
}
async function apiUpdateAirline(id, a) {
  return await apiFetch('/airlines/' + id, { method: 'PUT', body: JSON.stringify(a) });
}
async function apiDeleteAirline(id) {
  return await apiFetch('/airlines/' + id, { method: 'DELETE' });
}

// Blog
async function apiGetBlog() {
  const data = await apiFetch('/blog');
  if (data) return data;
  try { return JSON.parse(localStorage.getItem('sanayah_blog') || '{"posts":[],"settings":{}}'); } catch(e) { return {posts:[],settings:{}}; }
}
async function apiAddBlogPost(p) {
  return await apiFetch('/blog/post', { method: 'POST', body: JSON.stringify(p) });
}
async function apiUpdateBlogPost(id, p) {
  return await apiFetch('/blog/post/' + id, { method: 'PUT', body: JSON.stringify(p) });
}
async function apiDeleteBlogPost(id) {
  return await apiFetch('/blog/post/' + id, { method: 'DELETE' });
}
async function apiSaveBlogSettings(s) {
  return await apiFetch('/blog/settings', { method: 'PUT', body: JSON.stringify(s) });
}

// FAQ
async function apiGetFaq() {
  const data = await apiFetch('/faq');
  if (data) return data;
  try { return JSON.parse(localStorage.getItem('sanayah_faq') || '[]'); } catch(e) { return []; }
}
async function apiAddFaq(f) {
  return await apiFetch('/faq', { method: 'POST', body: JSON.stringify(f) });
}
async function apiUpdateFaq(id, f) {
  return await apiFetch('/faq/' + id, { method: 'PUT', body: JSON.stringify(f) });
}
async function apiDeleteFaq(id) {
  return await apiFetch('/faq/' + id, { method: 'DELETE' });
}

// Q&A
async function apiGetQa() {
  const data = await apiFetch('/qa');
  if (data) return data;
  try { return JSON.parse(localStorage.getItem('sanayah_qa') || '[]'); } catch(e) { return []; }
}
async function apiAddQa(q) {
  return await apiFetch('/qa', { method: 'POST', body: JSON.stringify(q) });
}
async function apiUpdateQa(id, q) {
  return await apiFetch('/qa/' + id, { method: 'PUT', body: JSON.stringify(q) });
}
async function apiDeleteQa(id) {
  return await apiFetch('/qa/' + id, { method: 'DELETE' });
}

// Settings
async function apiGetSetting(key) {
  const data = await apiFetch('/settings/' + key);
  if (data !== null && data !== undefined) return data;
  try { return JSON.parse(localStorage.getItem(key)); } catch(e) { return null; }
}
async function apiSaveSetting(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  return await apiFetch('/settings/' + key, { method: 'PUT', body: JSON.stringify({ value }) });
}
async function apiGetAllSettings() {
  return await apiFetch('/settings');
}

// Chatbot
async function apiChatbotMessage(msg, provider, apiKey, systemPrompt) {
  const data = await apiFetch('/chatbot/message', { method: 'POST', body: JSON.stringify({ message: msg, provider, apiKey, systemPrompt }) });
  return data ? data.reply : null;
}

// Page content
async function apiGetPages() {
  const data = await apiFetch('/pages');
  if (data) return data;
  try { return JSON.parse(localStorage.getItem('sanayah_pages') || '{}'); } catch(e) { return {}; }
}
async function apiSavePages(value) {
  localStorage.setItem('sanayah_pages', JSON.stringify(value));
  return await apiFetch('/pages', { method: 'PUT', body: JSON.stringify({ value }) });
}
