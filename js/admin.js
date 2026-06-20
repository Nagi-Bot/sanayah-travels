(function(){
const PASS_KEY='sanayah_admin_pass';
// ─── HELPERS ───
function g(id){return document.getElementById(id)}
function lsGet(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d??null}catch{return d??null}}
function lsSet(k,v){localStorage.setItem(k,JSON.stringify(v))}
// API sync helpers
async function loadSettingAsync(key, fallback) {
  var v = await apiGetSetting(key);
  if (v !== null && v !== undefined) { lsSet(key, v); return v; }
  return lsGet(key, fallback);
}
async function saveSettingAsync(key, value) {
  lsSet(key, value);
  await apiSaveSetting(key, value);
}

// ─── DEFAULT DATA ───
const DEFAULT_AIRLINES=[
  {id:'al1',name:'Emirates',logo:'https://upload.wikimedia.org/wikipedia/commons/d/d9/Emirates_logo.svg'},
  {id:'al2',name:'Qatar Airways',logo:'https://upload.wikimedia.org/wikipedia/commons/2/27/Qatar_Airways_Logo.svg'},
  {id:'al3',name:'Etihad Airways',logo:'https://upload.wikimedia.org/wikipedia/commons/9/96/Etihad_Airways_Logo_Vector.svg'},
  {id:'al4',name:'Saudi Arabian Airlines',logo:'https://upload.wikimedia.org/wikipedia/commons/7/73/Saudia_logo.svg'},
  {id:'al5',name:'Flydubai',logo:'https://upload.wikimedia.org/wikipedia/commons/a/a7/Flydubai_Logo.svg'},
  {id:'al6',name:'Air Arabia',logo:'https://upload.wikimedia.org/wikipedia/commons/8/88/Air_Arabia_Logo.svg'},
  {id:'al7',name:'Turkish Airlines',logo:'https://upload.wikimedia.org/wikipedia/commons/2/22/Turkish_Airlines_logo_2019_compact.svg'},
  {id:'al8',name:'PIA',logo:'https://upload.wikimedia.org/wikipedia/commons/b/b7/Pakistan_International_Airlines_logo.svg'},
  {id:'al9',name:'Oman Air',logo:'https://upload.wikimedia.org/wikipedia/commons/8/82/Oman_Air_logo.svg'},
  {id:'al10',name:'Gulf Air',logo:'https://upload.wikimedia.org/wikipedia/commons/4/4b/Gulf_Air_Logo.svg'}
];
const DEFAULT_BLOG={posts:[],settings:{label:'Travel Blog',title:'Get Inspired',desc:'Stories, guides and tips.'}};
const DEFAULT_FAQ=[{q:'What documents do I need for Umrah?',a:'A valid passport with 6+ months validity, Umrah visa, and vaccination certificate.'},{q:'How do I book a ticket?',a:'Call us or WhatsApp us with your preferred dates and destinations.'}];
const DEFAULT_QA=[
  {key:'hello',reply:"Hello! Welcome to Sanayah Travels & Tourism! How can I assist you today? For Umrah packages, flights, visas, or tours — just ask!"},
  {key:'hi',reply:"Hi there! Thanks for reaching out to Sanayah Travels. How can I help you with your travel plans?"},
  {key:'assalam',reply:"Assalam-o-Alaikum! Welcome to Sanayah Travels & Tourism. How may we assist you with your travel needs today?"},
  {key:'umrah',reply:"We offer 4 Umrah packages for 2026:\n- Economy: 10 Nights, 3-Star, from PKR 130K\n- Standard: 14 Nights, 4-Star, from PKR 180K (Most Popular)\n- Premium: 14 Nights, 5-Star, from PKR 280K (VIP)\n- Family: 14 Nights, from PKR 150K/pp (4+ group, kids under 5 free)\nAll include visa, flights, hotels, and guided Ziyarat."},
  {key:'visa',reply:"We provide visa assistance for: UAE (3-5 days), Saudi (5-7 days), UK (15-21 days), USA (4-8 wks), Schengen (10-15 days), Malaysia (2-4 days), Thailand (2-3 days), Turkey (3-5 days), China (5-7 days), Jordan (3-5 days), Canada (4-8 wks), Australia (3-6 wks). Process: Consultation → Documents → Application → Approved!"},
  {key:'flight',reply:"We book domestic & international flights with top airlines like Emirates, Qatar Airways, Turkish Airlines, PIA, Etihad, Flydubai, and more. Call +92 300 2816459 or WhatsApp for the best rates!"},
  {key:'ticket',reply:"For flight bookings, contact us with your preferred dates and destinations. We offer competitive rates on all major airlines. Call +92 300 2816459 or WhatsApp!"},
  {key:'price',reply:"Our packages start from PKR 18K (Lahore Tour) to PKR 350K (Europe Tour). Umrah starts from PKR 130K. Contact us for a custom quote tailored to your needs!"},
  {key:'package',reply:"We offer: Umrah Packages (from PKR 130K), Dubai Explorer (5N from PKR 95K), Thailand (7N from PKR 120K), Europe Grand Tour (10N from PKR 350K), Northern Pakistan (7N from PKR 55K), Swat Valley (5N from PKR 35K), Lahore Heritage (3N from PKR 18K)."},
  {key:'contact',reply:"📍 M-06 Mezzanine Floor, Galaxy Excel Block 10, Karachi 75300\n📞 +92 300 2816459\n📞 92 21 34832373\n✉ sanayahtravels@gmail.com\n💬 WhatsApp: https://wa.me/923002816459\n🕐 Mon-Sat 12PM-11PM (Sun Closed)"},
  {key:'phone',reply:"You can reach us at +92 300 2816459 or PTCL: 92 21 34832373. We're available Monday-Saturday, 12PM-11PM."},
  {key:'address',reply:"Our office is at M-06 Mezzanine Floor, Galaxy Excel Block 10, Karachi 75300, Pakistan. Business hours: Mon-Sat 12PM-11PM. Sunday closed."},
  {key:'whatsapp',reply:"Chat with us on WhatsApp: https://wa.me/923002816459 — we respond quickly!"},
  {key:'email',reply:"You can email us at sanayahtravels@gmail.com and we'll get back to you promptly."},
  {key:'hours',reply:"We're open Monday to Saturday, 12:00 PM to 11:00 PM. Sunday is closed."},
  {key:'destination',reply:"We cover 80+ destinations including: Makkah/Madinah, Dubai, Northern Pakistan (Hunza, Skardu), Thailand, Malaysia, Europe, Turkey, Jordan, Bali, Maldives, Sri Lanka, and more!"},
  {key:'northern',reply:"Northern Pakistan packages:\n- Hunza/Khunjerab/Attabad: 7 Nights from PKR 55K (Most Popular)\n- Swat & Kalam Valley: 5 Nights from PKR 35K\n- Lahore Heritage Tour: 3 Nights from PKR 18K\nIncludes transport, hotels, and guided tours."},
  {key:'dubai',reply:"Dubai Explorer: 5 Nights from PKR 95,000. Includes flights, 4-star hotel, airport transfers, and city tour. Contact us for details!"},
  {key:'europe',reply:"Europe Grand Tour (Paris, Rome, Barcelona): 10 Nights from PKR 350,000. Premium package with 4-star hotels, guided tours, and flights."},
  {key:'thailand',reply:"Thailand Bangkok & Phuket: 7 Nights from PKR 120,000. Our trending package! Includes flights, hotels, island tours, and transfers."},
  {key:'hotel',reply:"We book hotels worldwide — from budget to 5-star luxury. Give us your dates and preferences and we'll find the best rates!"},
  {key:'insurance',reply:"We offer travel insurance covering medical expenses, trip cancellation, and lost baggage. Ask us for a quote with your package!"},
  {key:'cruise',reply:"We offer cruise packages for Arabian Sea, Mediterranean, and Southeast Asia. Contact us for available dates and pricing!"},
  {key:'license',reply:"Sanayah Travels is fully government-licensed with G.L # 5134. We've been serving travelers since 2013 with 100% reliability."},
  {key:'trust',reply:"Sanayah Travels is a government-licensed agency (G.L # 5134) with 15+ years of experience, 5K+ happy travelers, and 1K+ Umrah pilgrims served. Your trust is our priority!"},
  {key:'team',reply:"Our team: Fahad Naseem (Founder, 15+ yrs), Farrukh Naseem (Director), Haris Khan (Visa Head), Hannan Moorad (Web & Marketing). All dedicated to your travel experience!"}
];

function initDefaults(){
  if(!lsGet(PASS_KEY))lsSet(PASS_KEY,'admin123');
  if(!lsGet('sanayah_airlines'))lsSet('sanayah_airlines',DEFAULT_AIRLINES);
  if(!lsGet('sanayah_blog'))lsSet('sanayah_blog',DEFAULT_BLOG);
  if(!lsGet('sanayah_faq'))lsSet('sanayah_faq',DEFAULT_FAQ);
  if(!lsGet('sanayah_qa'))lsSet('sanayah_qa',DEFAULT_QA);
  var chatCfg=lsGet('sanayah_chatconfig');if(!chatCfg||!chatCfg.apiKey)lsSet('sanayah_chatconfig',{provider:'deepseek',apiKey:'sk-7EkpLqt3XqAfxeGNJnk07gU6eJQ9fsddaGBTSTeMjIdcwLssiEJilH5G6w3v0i0Q',systemPrompt:"You are a dedicated customer service AI assistant for Sanayah Travels & Tourism, a government-licensed (G.L # 5134) travel agency based in Karachi, Pakistan, operating since 2013. Your role is to warmly and accurately answer customer questions about the company's full range of services.\n\nCOMPANY INFO:\n- Name: Sanayah Travels & Tourism\n- Tagline: \"Your Gateway to the World\"\n- Location: M-06 Mezzanine Floor, Galaxy Excel Block 10, Karachi 75300, Pakistan\n- Hours: Monday-Saturday 12:00 PM - 11:00 PM (Sunday Closed)\n- Phone: +92 300 2816459\n- PTCL: 92 21 34832373\n- Email: sanayahtravels@gmail.com\n- WhatsApp: https://wa.me/923002816459\n- License: G.L # 5134, Government Licensed\n- Experience: 15+ years\n\nSERVICES:\n1. Flight Bookings - Domestic & international with PIA, Emirates, Qatar, Turkish Airlines, etc.\n2. Umrah Packages - Complete arrangements: visa, flights, hotels, guided Ziyarat tours, meals\n3. Hotel Reservations - Budget to 5-star luxury worldwide\n4. Visa Assistance - For UAE, Saudi Arabia, UK, USA, Schengen, Malaysia, Thailand, Turkey, China, Jordan, Canada, Australia\n5. Tour Packages - Domestic (Northern Pakistan: Hunza, Swat, Skardu, Lahore) & International (Dubai, Thailand, Europe, Turkey, Bali, Maldives)\n6. Airport Transfers - Pickup/drop-off in Pakistan and internationally\n7. Cruise Packages - Arabian Sea, Mediterranean, Southeast Asia\n8. Corporate Travel - Bulk bookings, business class, priority service\n9. Travel Insurance - Medical, trip cancellation, lost baggage coverage\n\nUMRAH PACKAGES 2026:\n- Economy Umrah: 10 Nights, 3-Star Hotel, from PKR 130,000 (includes return flights, visa, guided Ziyarat)\n- Standard Umrah: 14 Nights, 4-Star Hotel, from PKR 180,000 (most popular, includes meals, Zam Zam, guided tours)\n- Premium Umrah: 14 Nights, 5-Star Hotel, from PKR 280,000 (steps from Haram, business class flights, VIP service)\n- Family Umrah: 14 Nights, from PKR 150,000 per person (group rates for 4+, kids under 5 free)\n\nINTERNATIONAL PACKAGES:\n- Dubai Explorer: 5 Nights from PKR 95,000\n- Thailand Bangkok & Phuket: 7 Nights from PKR 120,000 (Trending)\n- Europe Grand Tour (Paris, Rome, Barcelona): 10 Nights from PKR 350,000\n\nDOMESTIC PACKAGES:\n- Northern Pakistan (Hunza, Khunjerab, Attabad): 7 Nights from PKR 55,000 (Popular)\n- Swat & Kalam Valley: 5 Nights from PKR 35,000\n- Lahore Heritage Tour: 3 Nights from PKR 18,000\n\nVISA PROCESSING TIMES:\n- UAE/Dubai: 3-5 Working Days\n- Saudi Arabia: 5-7 Working Days\n- UK: 15-21 Working Days\n- USA: 4-8 Weeks\n- Schengen (Europe): 10-15 Working Days\n- Malaysia: 2-4 Working Days\n- Thailand: 2-3 Working Days\n- Turkey: 3-5 Working Days\n- China: 5-7 Working Days\n- Jordan: 3-5 Working Days\n- Canada: 4-8 Weeks\n- Australia: 3-6 Weeks\n\nVisa Process: Consultation → Document Collection → Application Filing → Visa Approved\n\nDESTINATIONS:\n- Makkah & Madinah (Most Popular, from PKR 180,000)\n- Northern Pakistan: Hunza, Gilgit, Skardu (from PKR 55,000)\n- Dubai & UAE (from PKR 95,000)\n- Thailand & Malaysia (from PKR 95,000)\n- Europe Tours (Premium)\n- USA & Canada (Premium)\n- Bali & Indonesia (Exotic)\n- Turkey & Jordan (Cultural)\n- Sri Lanka & Maldives (Adventure)\n\nTEAM:\n- Fahad Naseem: Founder & Director (15+ years, Umrah & international specialist)\n- Farrukh Naseem: Director (operations & quality service)\n- Haris Khan: Head of Visa Services (Schengen, UAE, UK, all major visas)\n- Hannan Moorad: Web Developer & Marketing\n\nSTATISTICS: 15+ Years | 5K+ Happy Travelers | 80+ Destinations | 1K+ Umrah Pilgrims Served | 100% Licensed & Verified\n\nSOCIAL MEDIA:\n- Facebook: https://www.facebook.com/share/1Y8gzFqBPC/?mibextid=wwXIfr\n- Instagram: https://www.instagram.com/sanayah_travels\n- TikTok: https://www.tiktok.com/@sanayahtravels\n- LinkedIn, Twitter, YouTube: Coming soon\n\nINSTRUCTIONS:\n- Be friendly, warm, and professional in your tone\n- Answer questions about any service listed above with specific details (prices, durations, processing times)\n- If asked about visa requirements, explain the process and timeframes\n- If asked about Umrah packages, share the 4 package options with details\n- If asked about flights, mention partner airlines and that customers should contact directly for quotes\n- Promote the company's 15+ years of experience, 5K+ happy travelers, and government license (G.L # 5134)\n- Always invite the customer to call +92 300 2816459 or WhatsApp for booking or personalized quotes\n- If asked something outside your knowledge, politely say you'll have a team member follow up and provide the phone number\n- Keep responses concise but informative, in English"})
  if(!lsGet('sanayah_reviews'))lsSet('sanayah_reviews',[]);
  if(!lsGet('sanayah_wa'))lsSet('sanayah_wa','923002816459');
  if(!lsGet('sanayah_social'))lsSet('sanayah_social',{facebook:'',instagram:'',twitter:'',linkedin:'',youtube:'',tiktok:''});
  if(!lsGet('sanayah_about'))lsSet('sanayah_about',{title:'Welcome to Sanayah Travels',p1:'Your trusted travel partner since 2015.',p2:'We provide Umrah packages, international flights, visa assistance, and guided tours.',p3:'Our team is dedicated to making your travel seamless and memorable.',image:''});
  if(!lsGet('sanayah_contact'))lsSet('sanayah_contact',{email:'info@sanayahtravels.com',address:'Office No. 2, Al-Noor Plaza, Peshawar',ptcl:'092 21 34832373',hours:'Mon-Sat: 9am to 7pm'});
  if(!lsGet('sanayah_seo'))lsSet('sanayah_seo',{title:'Sanayah Travels & Tourism | G.L # 5134',desc:'Sanayah Travels & Tourism - G.L # 5134. Umrah Packages, International & Domestic Flights, Visa Assistance, Hotel Booking, and Tour Packages.',keywords:'sanayah travels, umrah packages, flights, visa assistance, travel agency peshawar'});
  if(!lsGet('sanayah_email'))lsSet('sanayah_email',{key:'',service:'',template:'',recipient:'sanayahtravels@gmail.com'});
  if(!lsGet('sanayah_pages'))lsSet('sanayah_pages',{home:{title:'Welcome!',subtitle:'Your trusted travel partner'},about:{title:'About Us',p1:'We are one of the leading travel agencies in Peshawar.',p2:'With years of experience in the industry, we pride ourselves on delivering exceptional service.',p3:'We specialize in Umrah packages, flight bookings, visa assistance, and guided tours.'},umrah:{title:'Umrah Packages',subtitle:'Complete packages for your spiritual journey'},flights:{title:'International Flights',subtitle:'Book flights worldwide at the best prices'},visa:{title:'Visa Assistance',subtitle:'Hassle-free visa processing'},tours:{title:'Tour Packages',subtitle:'Explore the world with us'},honeymoon:{title:'Honeymoon Packages',subtitle:'Romantic getaways for couples'},contact:{title:'Contact Us',subtitle:'Get in touch with our team'}});
}
initDefaults();

// ─── TOAST ───
let toastTimer;
function showToast(msg,t='success'){
  const el=g('adminToast');if(!el)return;
  el.textContent=msg;el.className='admin-toast '+t+' show';
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3500);
}

// ─── LOGIN ───
window.doAdminLogin=async function(){
  const u=g('loginUser').value.trim(),p=g('loginPass').value.trim();
  var ok = false;
  try { ok = await apiLogin(u, p); } catch(e) {}
  const stored=lsGet(PASS_KEY,'admin123');
  if(ok || (u==='admin'&&p===stored)){
    g('adminLogin').style.display='none';g('adminDash').classList.add('active');
    var all = await apiGetAllSettings();
    if (all) { Object.keys(all).forEach(function(k) { lsSet(k, all[k]); }); }
    loadAll();
  }else{
    g('loginErr').style.display='block';
  }
};
window.doAdminLogout=function(){
  g('adminLogin').style.display='flex';g('adminDash').classList.remove('active');
  g('loginUser').value='';g('loginPass').value='';
};

// ─── TAB SWITCH ───
window.switchAdminTab=function(tab){
  document.querySelectorAll('.admin-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.admin-section').forEach(s=>s.classList.remove('active'));
  const tEl=Array.from(document.querySelectorAll('.admin-tab')).find(t=>t.textContent.trim().toLowerCase()===tab);
  if(tEl)tEl.classList.add('active');
  const sec=g('tab-'+tab);
  if(sec)sec.classList.add('active');
  // refresh relevant
  if(tab==='dashboard')loadDashboard();
  else if(tab==='reviews')loadReviews();
  else if(tab==='airlines')loadAirlines();
  else if(tab==='pages'){loadPages();loadAboutContent();}
  else if(tab==='branding')loadBranding();
  else if(tab==='blog')loadBlog();
  else if(tab==='faq')loadFaqEditor();
  else if(tab==='chatbot')loadChatbot();
  else if(tab==='visitors')loadVisitors();
  else if(tab==='settings')loadSettings();
};

// ─── DASHBOARD ───
function loadDashboard(){
  const reviews=lsGet('sanayah_reviews',[]);
  const airlines=lsGet('sanayah_airlines',[]);
  const blog=lsGet('sanayah_blog',DEFAULT_BLOG);
  const faq=lsGet('sanayah_faq',[]);
  const qa=lsGet('sanayah_qa',[]);
  const approved=reviews.filter(r=>r.approved===true).length;
  const pending=reviews.filter(r=>!r.approved&&r.status!=='rejected').length;
  const stars=reviews.filter(r=>r.approved===true).reduce((s,r)=>s+(r.rating||r.stars||5),0);
  const avg=approved>0?(stars/approved).toFixed(1):'0';
  const visitors=lsGet('sanayah_visitors',[]);
  g('dashStats').innerHTML=
    `<div class="astat"><div class="astat-icon"><svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div><div class="astat-val">${reviews.length}</div><div class="astat-lbl">Total Reviews</div></div>
<div class="astat"><div class="astat-icon"><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div><div class="astat-val">${avg}</div><div class="astat-lbl">Avg Rating</div></div>
<div class="astat"><div class="astat-icon"><svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></div><div class="astat-val">${approved}</div><div class="astat-lbl">Approved</div></div>
<div class="astat"><div class="astat-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div><div class="astat-val">${pending}</div><div class="astat-lbl">Pending</div></div>
<div class="astat"><div class="astat-icon"><svg viewBox="0 0 24 24"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg></div><div class="astat-val">${airlines.length}</div><div class="astat-lbl">Airlines</div></div>
<div class="astat"><div class="astat-icon"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></div><div class="astat-val">${blog.posts.length}</div><div class="astat-lbl">Blog Posts</div></div>
<div class="astat" onclick="switchAdminTab('visitors')" style="cursor:pointer"><div class="astat-icon"><svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div><div class="astat-val">${visitors.length}</div><div class="astat-lbl">Visitors</div></div>`;
}

// ─── REVIEWS ───
function loadReviews(){
    apiGetReviews(true).then(function(reviews){
      if (!reviews || !reviews.length) { reviews = lsGet('sanayah_reviews',[]); }
      else { lsSet('sanayah_reviews', reviews); }
      renderReviewTable(reviews);
    });
  }
  function renderReviewTable(reviews) {
    const approved=reviews.filter(r=>r.approved===true).length;
    const pending=reviews.filter(r=>!r.approved&&r.status!=='rejected').length;
    const rejected=reviews.filter(r=>r.status==='rejected').length;
    g('reviewStats').innerHTML=
    `<div class="astat"><div class="astat-icon"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div><div class="astat-val">${approved}</div><div class="astat-lbl">Approved</div></div>
<div class="astat"><div class="astat-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div><div class="astat-val">${pending}</div><div class="astat-lbl">Pending</div></div>
<div class="astat"><div class="astat-icon"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></div><div class="astat-val">${rejected}</div><div class="astat-lbl">Rejected</div></div>`;
  const tbody=g('reviewsTableBody');
  if(!reviews.length){
    tbody.innerHTML='<tr><td colspan="7" style="text-align:center;color:#64748b;padding:40px">No reviews yet.</td></tr>';
    return;
  }
  tbody.innerHTML=reviews.map((r,i)=>{
    const statusClass=r.approved?'approved':r.status||'pending';
    return `<tr><td>${i+1}</td><td><span class="tbl-name">${esc(r.name)}</span></td><td>${esc(r.text||r.review||'')}</td><td>${'★'.repeat(r.rating||r.stars||5)}</td><td>${r.date||''}</td><td><span class="rev-status ${statusClass}">${statusClass}</span></td><td class="tbl-actions">
<button class="tbl-btn approve" onclick="reviewAction(${i},'approved')">✓</button>
<button class="tbl-btn reject" onclick="reviewAction(${i},'rejected')">✗</button>
<button class="tbl-btn del" onclick="deleteReview(${i})">🗑</button></td></tr>`;
  }).join('');
}
window.reviewAction=function(i,st){
  const reviews=lsGet('sanayah_reviews',[]);
  if(!reviews[i])return;
  reviews[i].approved=(st==='approved');reviews[i].status=st;lsSet('sanayah_reviews',reviews);
  if (reviews[i]._id) { apiApproveReview(reviews[i]._id, st==='approved'); }
  loadReviews();showToast(st==='approved'?'Review approved':'Review rejected');
};
window.deleteReview=function(i){
  window._delIdx=i;window._delCb=function(){
    const r=lsGet('sanayah_reviews',[]);
    if (r[i] && r[i]._id) apiDeleteReview(r[i]._id);
    r.splice(window._delIdx,1);lsSet('sanayah_reviews',r);loadReviews();showToast('Review deleted');
  };
  g('deleteModalMsg').textContent='Delete this review?';
  g('deleteModal').classList.add('open');
};

// ─── AIRLINES ───
let _editAlId=null,_alDataUrl='';
function loadAirlines(){
  const al=lsGet('sanayah_airlines',[]);
  const wrap=g('airlineList');
  if(!al.length){wrap.innerHTML='<p style="color:#64748b;padding:20px">No airlines added yet.</p>';return;}
  wrap.innerHTML=al.map(a=>{
    const img=a.logo?`<img src="${esc(a.logo)}" alt="${esc(a.name)}" onerror="this.style.display='none'" />`:'';
    return `<div style="background:#1e293b;border-radius:10px;padding:16px;text-align:center;border:1px solid rgba(255,255,255,.06)">
<div style="width:100%;height:64px;display:flex;align-items:center;justify-content:center;margin-bottom:8px">${img||'<span style="color:#64748b;font-size:.7rem">No logo</span>'}</div>
<p style="color:#fff;font-size:.85rem;font-weight:600;margin-bottom:8px">${esc(a.name)}</p>
<div class="tbl-actions" style="justify-content:center"><button class="tbl-btn edit" onclick="openEditAirline('${a.id}')">Edit</button><button class="tbl-btn del" onclick="deleteAirline('${a.id}')">Delete</button></div></div>`;
  }).join('');
}
window.openAddAirline=function(){
  _editAlId=null;_alDataUrl='';
  g('airlineModalTitle').textContent='Add Airline';
  g('alName').value='';
  g('alPreview').style.display='none';
  g('airlineModal').classList.add('open');
};
window.openEditAirline=function(id){
  const al=lsGet('sanayah_airlines',[]).find(a=>a.id===id);
  if(!al)return;
  _editAlId=id;
  g('airlineModalTitle').textContent='Edit Airline';
  g('alName').value=al.name;
  _alDataUrl=al.logo||'';
  const p=g('alPreview');
  if(_alDataUrl){p.src=_alDataUrl;p.style.display='block';}else p.style.display='none';
  g('airlineModal').classList.add('open');
};
window.handleAirlineImg=function(inp){
  const file=inp.files&&inp.files[0];if(!file)return;
  const r=new FileReader();
  r.onload=function(e){_alDataUrl=e.target.result;const p=g('alPreview');p.src=_alDataUrl;p.style.display='block';};
  r.readAsDataURL(file);
};
window.saveAirline=function(){
  const name=g('alName').value.trim();
  if(!name){showToast('Please enter airline name','error');return;}
  const al=lsGet('sanayah_airlines',[]);
  if(_editAlId){
    const idx=al.findIndex(a=>a.id===_editAlId);
    if(idx>-1){al[idx].name=name;al[idx].logo=_alDataUrl;}
  }else{
    al.push({id:'al'+Date.now(),name,logo:_alDataUrl});
  }
  lsSet('sanayah_airlines',al);
  closeAirlineModal();loadAirlines();showToast(_editAlId?'Airline updated':'Airline added');
};
window.deleteAirline=function(id){
  window._delCb=function(){const al=lsGet('sanayah_airlines',[]).filter(a=>a.id!==id);lsSet('sanayah_airlines',al);loadAirlines();showToast('Airline deleted');};
  g('deleteModalMsg').textContent='Delete this airline?';
  g('deleteModal').classList.add('open');
};
function closeAirlineModal(){g('airlineModal').classList.remove('open');_editAlId=null;_alDataUrl='';}
window.closeAirlineModal=closeAirlineModal;

// ─── ABOUT CONTENT ───
let _aboutImgData='';
function loadAboutContent(){
  const ab=lsGet('sanayah_about',{title:'',p1:'',p2:'',p3:'',image:''});
  g('aboutTitle').value=ab.title||'';
  g('aboutP1').value=ab.p1||'';
  g('aboutP2').value=ab.p2||'';
  g('aboutP3').value=ab.p3||'';
  _aboutImgData=ab.image||'';
  const p=g('aboutImgPreview');
  if(_aboutImgData){p.src=_aboutImgData;p.style.display='block';}else p.style.display='none';
}
window.handleAboutImg=function(inp){
  const file=inp.files&&inp.files[0];if(!file)return;
  const r=new FileReader();
  r.onload=function(e){_aboutImgData=e.target.result;const p=g('aboutImgPreview');p.src=_aboutImgData;p.style.display='block';};
  r.readAsDataURL(file);
};
window.saveAboutContent=function(){
  lsSet('sanayah_about',{title:g('aboutTitle').value.trim(),p1:g('aboutP1').value.trim(),p2:g('aboutP2').value.trim(),p3:g('aboutP3').value.trim(),image:_aboutImgData});
  showToast('About section saved');
};

// ─── PAGES ───
function loadPages(){
  const pages=lsGet('sanayah_pages',{});
  const pageNames=Object.keys(pages);
  const tabWrap=g('pageTabs');
  const editor=g('pageEditor');
  if(!pageNames.length){editor.innerHTML='<p style="color:#64748b">No pages found.</p>';tabWrap.innerHTML='';return;}
  tabWrap.innerHTML=pageNames.map((n,i)=>`<button class="tbl-btn ${i===0?'approve':'edit'}" onclick="selectPage('${n}')">${n.charAt(0).toUpperCase()+n.slice(1)}</button>`).join('');
  selectPage(pageNames[0]);
}
window.selectPage=function(name){
  const pages=lsGet('sanayah_pages',{});
  const pg=pages[name]||{};
  document.querySelectorAll('#pageTabs button').forEach(b=>{b.style.background=b.textContent.toLowerCase()===name?'rgba(34,197,94,.2)':'rgba(59,130,246,.2)';b.style.color=b.textContent.toLowerCase()===name?'#4ade80':'#60a5fa';});
  let html=`<div class="settings-card"><h3>Editing: ${name.charAt(0).toUpperCase()+name.slice(1)}</h3><p>Edit page content below.</p>`;
  for(const key of Object.keys(pg)){
    const val=pg[key]||'';
    const isLong=typeof val==='string'&&val.length>80;
    html+=`<label class="m-label">${key}</label>${isLong?`<textarea class="m-input pg-inp" data-page="${name}" data-key="${key}" style="min-height:100px">${esc(val)}</textarea>`:`<input class="m-input pg-inp" data-page="${name}" data-key="${key}" value="${esc(val)}"/>`}`;
  }
  html+=`<button class="settings-save" onclick="saveCurrentPage('${name}')" style="margin-top:16px">Save ${name.charAt(0).toUpperCase()+name.slice(1)} Page</button></div>`;
  g('pageEditor').innerHTML=html;
};
window.saveCurrentPage=function(name){
  const pages=lsGet('sanayah_pages',{});
  const pg=pages[name]||{};
  document.querySelectorAll('.pg-inp').forEach(inp=>{
    if(inp.dataset.page===name)pg[inp.dataset.key]=inp.value;
  });
  pages[name]=pg;lsSet('sanayah_pages',pages);
  showToast(name.charAt(0).toUpperCase()+name.slice(1)+' page saved');
};

// ─── BRANDING ───
function loadBranding(){
  const social=lsGet('sanayah_social',{});
  g('socFb').value=social.facebook||'';g('socIg').value=social.instagram||'';
  g('socTw').value=social.twitter||'';g('socLi').value=social.linkedin||'';
  g('socYt').value=social.youtube||'';g('socTk').value=social.tiktok||'';
  g('socWa').value=lsGet('sanayah_wa','923002816459');
  updateSocialPreview();
  const logo=lsGet('sanayah_logo','');
  const box=g('logoPreviewBox');
  if(logo){box.innerHTML=`<img src="${logo}" alt="Logo" onerror="this.style.display='none'"/>`;}else box.innerHTML='<span style="color:#64748b;font-size:.75rem">No logo</span>';
  const iata=lsGet('sanayah_iata','');
  const ibox=g('iataPreviewBox');
  if(iata){ibox.innerHTML=`<img src="${iata}" alt="IATA Logo" onerror="this.style.display='none'"/>`;}else ibox.innerHTML='<span style="color:#64748b;font-size:.75rem">No logo</span>';
  g('brandSiteName').value=lsGet('sanayah_site_name','')||'';
  g('brandAnnounce').value=lsGet('sanayah_announcement','')||'';
  g('brandHeroTitle').value=lsGet('sanayah_hero_title','')||'';
  g('brandHeroSub').value=lsGet('sanayah_hero_sub','')||'';
  const color=lsGet('sanayah_accent','#1E90D8');
  g('brandColor').value=color;g('brandColorHex').value=color;
}
function updateSocialPreview(){
  const map={facebook:'socFb',instagram:'socIg',twitter:'socTw',linkedin:'socLi',youtube:'socYt',tiktok:'socTk'};
  const svgs={
    facebook:'<svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
    instagram:'<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
    twitter:'<svg viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>',
    linkedin:'<svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>',
    youtube:'<svg viewBox="0 0 24 24"><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/><path d="M19.42 4.37A2.07 2.07 0 0 0 18 4.07H6a2 2 0 0 0-1.42.6 2.07 2.07 0 0 0-.58 1.4v11.86a2.07 2.07 0 0 0 .58 1.4 2 2 0 0 0 1.42.6h12a2 2 0 0 0 1.42-.6 2.07 2.07 0 0 0 .58-1.4V5.77a2.07 2.07 0 0 0-.58-1.4z"/></svg>',
    tiktok:'<svg viewBox="0 0 24 24"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>'
  };
  const p=g('socialPreview');
  let html='';
  for(const [plat,inpId] of Object.entries(map)){
    const val=g(inpId).value.trim();
    const active=!!val;
    html+=`<div class="soc-icon-box${active?' active':''}" title="${plat}">${svgs[plat]||''}</div>`;
  }
  p.innerHTML=html;
}
['socFb','socIg','socTw','socLi','socYt','socTk'].forEach(id=>{g(id).addEventListener('input',updateSocialPreview);});

window.saveBrandSocial=function(){
  const social={facebook:g('socFb').value.trim(),instagram:g('socIg').value.trim(),twitter:g('socTw').value.trim(),linkedin:g('socLi').value.trim(),youtube:g('socYt').value.trim(),tiktok:g('socTk').value.trim()};
  lsSet('sanayah_social',social);apiSaveSetting('sanayah_social',social);
  const wa=g('socWa').value.trim();
  if(wa){lsSet('sanayah_wa',wa);apiSaveSetting('sanayah_wa',wa);}
  showToast('Social links saved! The changes will update across your site.');
};
window.saveBrandSiteName=function(){
  const v=g('brandSiteName').value.trim();
  if(v)lsSet('sanayah_site_name',v);else localStorage.removeItem('sanayah_site_name');
  showToast('Site name saved');
};
window.saveBrandAnnounce=function(){
  const v=g('brandAnnounce').value.trim();
  if(v)lsSet('sanayah_announcement',v);else localStorage.removeItem('sanayah_announcement');
  showToast('Announcement saved');
};
window.saveBrandHero=function(){
  const t=g('brandHeroTitle').value.trim(),s=g('brandHeroSub').value.trim();
  if(t)lsSet('sanayah_hero_title',t);else localStorage.removeItem('sanayah_hero_title');
  if(s)lsSet('sanayah_hero_sub',s);else localStorage.removeItem('sanayah_hero_sub');
  showToast('Hero section saved');
};
window.saveBrandColor=function(){
  let hex=g('brandColorHex').value.trim();
  if(!hex||!hex.startsWith('#'))hex=g('brandColor').value;
  lsSet('sanayah_accent',hex);showToast('Accent color saved');
};
// sync color picker + hex input
g('brandColor').addEventListener('input',function(){g('brandColorHex').value=this.value;});
g('brandColorHex').addEventListener('input',function(){
  const v=this.value.trim();
  if(/^#[0-9a-f]{6}$/i.test(v))g('brandColor').value=v;
});
window.adminUploadLogo=function(inp){
  const file=inp.files&&inp.files[0];if(!file)return;
  const r=new FileReader();
  r.onload=function(e){
    const url=e.target.result;
    lsSet('sanayah_logo',url);
    const box=g('logoPreviewBox');box.innerHTML=`<img src="${url}" alt="Logo" />`;
    showToast('Logo updated');
  };
  r.readAsDataURL(file);
};
window.adminUploadIata=function(inp){
  const file=inp.files&&inp.files[0];if(!file)return;
  const r=new FileReader();
  r.onload=function(e){
    const url=e.target.result;lsSet('sanayah_iata',url);
    const box=g('iataPreviewBox');box.innerHTML=`<img src="${url}" alt="IATA" />`;
    showToast('IATA logo updated');
  };
  r.readAsDataURL(file);
};
window.adminRemoveIata=function(){
  localStorage.removeItem('sanayah_iata');
  g('iataPreviewBox').innerHTML='<span style="color:#64748b;font-size:.75rem">No logo</span>';
  showToast('IATA logo removed');
};
window.adminRemoveLogo=function(){
  localStorage.removeItem('sanayah_logo');
  g('logoPreviewBox').innerHTML='<span style="color:#64748b;font-size:.75rem">No logo</span>';
  showToast('Logo removed');
};

// ─── BLOG ───
function loadBlog(){
  const blog=lsGet('sanayah_blog',DEFAULT_BLOG);
  const grid=g('blogGrid');
  g('blogSecLabel').value=blog.settings.label||'';
  g('blogSecTitle').value=blog.settings.title||'';
  g('blogSecDesc').value=blog.settings.desc||'';
  if(!blog.posts.length){grid.innerHTML='<p style="color:#64748b">No blog posts yet.</p>';return;}
  grid.innerHTML=blog.posts.map((p,i)=>`<div class="blog-card"><div class="blog-card-body"><div class="blog-card-title">${esc(p.title||'Untitled')}</div><div class="blog-card-date">${p.date||''}</div><div class="blog-card-excerpt">${esc((p.content||'').substring(0,150))}${(p.content||'').length>150?'...':''}</div><div class="tbl-actions" style="margin-top:10px"><button class="tbl-btn edit" onclick="openEditBlog(${i})">Edit</button><button class="tbl-btn del" onclick="deleteBlog(${i})">Delete</button></div></div></div>`).join('');
}
let _editBlogIdx=null;
window.openBlogModal=function(idx){
  _editBlogIdx=idx!==undefined?idx:null;
  g('blogModalTitle').textContent=_editBlogIdx!==null?'Edit Post':'New Blog Post';
  if(_editBlogIdx!==null){
    const blog=lsGet('sanayah_blog',DEFAULT_BLOG);
    const p=blog.posts[_editBlogIdx];
    g('bpTitle').value=p.title||'';
    g('bpContent').value=p.content||'';
  }else{g('bpTitle').value='';g('bpContent').value='';}
  g('blogModal').classList.add('open');
};
window.openEditBlog=function(i){window.openBlogModal(i);};
window.saveBlogPost=function(){
  const title=g('bpTitle').value.trim(),content=g('bpContent').value.trim();
  if(!title){showToast('Please enter a title','error');return;}
  const blog=lsGet('sanayah_blog',DEFAULT_BLOG);
  if(_editBlogIdx!==null){
    blog.posts[_editBlogIdx]={...blog.posts[_editBlogIdx],title,content};
  }else{
    blog.posts.push({title,content,date:new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})});
  }
  lsSet('sanayah_blog',blog);
  closeBlogModal();loadBlog();showToast(_editBlogIdx!==null?'Post updated':'Post created');
};
window.deleteBlog=function(i){
  window._delCb=function(){const blog=lsGet('sanayah_blog',DEFAULT_BLOG);blog.posts.splice(i,1);lsSet('sanayah_blog',blog);loadBlog();showToast('Post deleted');};
  g('deleteModalMsg').textContent='Delete this blog post?';
  g('deleteModal').classList.add('open');
};
function closeBlogModal(){g('blogModal').classList.remove('open');_editBlogIdx=null;}
window.closeBlogModal=closeBlogModal;
window.saveBlogSettings=function(){
  const blog=lsGet('sanayah_blog',DEFAULT_BLOG);
  blog.settings={label:g('blogSecLabel').value.trim(),title:g('blogSecTitle').value.trim(),desc:g('blogSecDesc').value.trim()};
  lsSet('sanayah_blog',blog);showToast('Blog settings saved');
};

// ─── FAQ ───
function loadFaqEditor(){
  const faq=lsGet('sanayah_faq',[]);
  const wrap=g('faqEditorList');
  if(!faq.length){wrap.innerHTML='<p style="color:#64748b">No FAQs yet. Click "Add FAQ" to add one.</p>';return;}
  wrap.innerHTML=faq.map((f,i)=>`<div class="faq-item">
<div class="faq-header"><span>Q${i+1}</span><div class="tbl-actions"><button class="tbl-btn edit" onclick="removeFaqItem(${i})">Remove</button></div></div>
<label class="m-label">Question</label><input class="m-input faq-q" data-idx="${i}" value="${esc(f.q)}" style="margin-bottom:6px"/>
<label class="m-label">Answer</label><textarea class="m-input faq-a" data-idx="${i}" style="min-height:70px">${esc(f.a)}</textarea>
</div>`).join('');
}
window.addFaqItem=function(){
  const faq=lsGet('sanayah_faq',[]);
  faq.push({q:'New question?',a:'Answer here.'});
  lsSet('sanayah_faq',faq);
  loadFaqEditor();showToast('FAQ added');
};
window.removeFaqItem=function(i){
  window._delCb=function(){const faq=lsGet('sanayah_faq',[]);faq.splice(i,1);lsSet('sanayah_faq',faq);loadFaqEditor();showToast('FAQ removed');};
  g('deleteModalMsg').textContent='Remove this FAQ?';
  g('deleteModal').classList.add('open');
};
window.saveFaqAll=function(){
  const faq=lsGet('sanayah_faq',[]);
  document.querySelectorAll('.faq-q').forEach(inp=>{const idx=parseInt(inp.dataset.idx);if(faq[idx])faq[idx].q=inp.value;});
  document.querySelectorAll('.faq-a').forEach(inp=>{const idx=parseInt(inp.dataset.idx);if(faq[idx])faq[idx].a=inp.value;});
  lsSet('sanayah_faq',faq);showToast('All FAQ saved');
};

// ─── CHATBOT ───
function loadChatbot(){
  const cfg=lsGet('sanayah_chatconfig',{provider:'deepseek',apiKey:'sk-7EkpLqt3XqAfxeGNJnk07gU6eJQ9fsddaGBTSTeMjIdcwLssiEJilH5G6w3v0i0Q',systemPrompt:"You are a dedicated customer service AI assistant for Sanayah Travels & Tourism, a government-licensed (G.L # 5134) travel agency based in Karachi, Pakistan, operating since 2013. Your role is to warmly and accurately answer customer questions about the company's full range of services.\n\nCOMPANY INFO:\n- Name: Sanayah Travels & Tourism\n- Tagline: \"Your Gateway to the World\"\n- Location: M-06 Mezzanine Floor, Galaxy Excel Block 10, Karachi 75300, Pakistan\n- Hours: Monday-Saturday 12:00 PM - 11:00 PM (Sunday Closed)\n- Phone: +92 300 2816459\n- PTCL: 92 21 34832373\n- Email: sanayahtravels@gmail.com\n- WhatsApp: https://wa.me/923002816459\n- License: G.L # 5134, Government Licensed\n- Experience: 15+ years\n\nSERVICES:\n1. Flight Bookings - Domestic & international with PIA, Emirates, Qatar, Turkish Airlines, etc.\n2. Umrah Packages - Complete arrangements: visa, flights, hotels, guided Ziyarat tours, meals\n3. Hotel Reservations - Budget to 5-star luxury worldwide\n4. Visa Assistance - For UAE, Saudi Arabia, UK, USA, Schengen, Malaysia, Thailand, Turkey, China, Jordan, Canada, Australia\n5. Tour Packages - Domestic (Northern Pakistan: Hunza, Swat, Skardu, Lahore) & International (Dubai, Thailand, Europe, Turkey, Bali, Maldives)\n6. Airport Transfers - Pickup/drop-off in Pakistan and internationally\n7. Cruise Packages - Arabian Sea, Mediterranean, Southeast Asia\n8. Corporate Travel - Bulk bookings, business class, priority service\n9. Travel Insurance - Medical, trip cancellation, lost baggage coverage\n\nUMRAH PACKAGES 2026:\n- Economy Umrah: 10 Nights, 3-Star Hotel, from PKR 130,000 (includes return flights, visa, guided Ziyarat)\n- Standard Umrah: 14 Nights, 4-Star Hotel, from PKR 180,000 (most popular, includes meals, Zam Zam, guided tours)\n- Premium Umrah: 14 Nights, 5-Star Hotel, from PKR 280,000 (steps from Haram, business class flights, VIP service)\n- Family Umrah: 14 Nights, from PKR 150,000 per person (group rates for 4+, kids under 5 free)\n\nINTERNATIONAL PACKAGES:\n- Dubai Explorer: 5 Nights from PKR 95,000\n- Thailand Bangkok & Phuket: 7 Nights from PKR 120,000 (Trending)\n- Europe Grand Tour (Paris, Rome, Barcelona): 10 Nights from PKR 350,000\n\nDOMESTIC PACKAGES:\n- Northern Pakistan (Hunza, Khunjerab, Attabad): 7 Nights from PKR 55,000 (Popular)\n- Swat & Kalam Valley: 5 Nights from PKR 35,000\n- Lahore Heritage Tour: 3 Nights from PKR 18,000\n\nVISA PROCESSING TIMES:\n- UAE/Dubai: 3-5 Working Days\n- Saudi Arabia: 5-7 Working Days\n- UK: 15-21 Working Days\n- USA: 4-8 Weeks\n- Schengen (Europe): 10-15 Working Days\n- Malaysia: 2-4 Working Days\n- Thailand: 2-3 Working Days\n- Turkey: 3-5 Working Days\n- China: 5-7 Working Days\n- Jordan: 3-5 Working Days\n- Canada: 4-8 Weeks\n- Australia: 3-6 Weeks\n\nVisa Process: Consultation → Document Collection → Application Filing → Visa Approved\n\nDESTINATIONS:\n- Makkah & Madinah (Most Popular, from PKR 180,000)\n- Northern Pakistan: Hunza, Gilgit, Skardu (from PKR 55,000)\n- Dubai & UAE (from PKR 95,000)\n- Thailand & Malaysia (from PKR 95,000)\n- Europe Tours (Premium)\n- USA & Canada (Premium)\n- Bali & Indonesia (Exotic)\n- Turkey & Jordan (Cultural)\n- Sri Lanka & Maldives (Adventure)\n\nTEAM:\n- Fahad Naseem: Founder & Director (15+ years, Umrah & international specialist)\n- Farrukh Naseem: Director (operations & quality service)\n- Haris Khan: Head of Visa Services (Schengen, UAE, UK, all major visas)\n- Hannan Moorad: Web Developer & Marketing\n\nSTATISTICS: 15+ Years | 5K+ Happy Travelers | 80+ Destinations | 1K+ Umrah Pilgrims Served | 100% Licensed & Verified\n\nSOCIAL MEDIA:\n- Facebook: https://www.facebook.com/share/1Y8gzFqBPC/?mibextid=wwXIfr\n- Instagram: https://www.instagram.com/sanayah_travels\n- TikTok: https://www.tiktok.com/@sanayahtravels\n- LinkedIn, Twitter, YouTube: Coming soon\n\nINSTRUCTIONS:\n- Be friendly, warm, and professional in your tone\n- Answer questions about any service listed above with specific details (prices, durations, processing times)\n- If asked about visa requirements, explain the process and timeframes\n- If asked about Umrah packages, share the 4 package options with details\n- If asked about flights, mention partner airlines and that customers should contact directly for quotes\n- Promote the company's 15+ years of experience, 5K+ happy travelers, and government license (G.L # 5134)\n- Always invite the customer to call +92 300 2816459 or WhatsApp for booking or personalized quotes\n- If asked something outside your knowledge, politely say you'll have a team member follow up and provide the phone number\n- Keep responses concise but informative, in English"});
  g('chatProvider').value=cfg.provider||'';
  g('chatApiKey').value=cfg.apiKey||'';
  g('chatSystemPrompt').value=cfg.systemPrompt||'';
  loadQaList();
}
window.saveChatConfig=function(){
  const cfg={provider:g('chatProvider').value,apiKey:g('chatApiKey').value,systemPrompt:g('chatSystemPrompt').value};
  lsSet('sanayah_chatconfig',cfg);showToast('Chatbot settings saved');
};
function loadQaList(){
  const qa=lsGet('sanayah_qa',[]);
  const w=g('qaList');
  if(!qa.length){w.innerHTML='<p style="color:#64748b">No Q&A pairs yet.</p>';return;}
  w.innerHTML=qa.map((q,i)=>`<div class="qa-row"><span class="qa-key">${esc(q.key)}</span><span class="qa-reply">${esc(q.reply)}</span><div class="qa-actions"><button class="tbl-btn edit" onclick="openEditQa(${i})">Edit</button><button class="tbl-btn del" onclick="deleteQa(${i})">Del</button></div></div>`).join('');
}
let _editQaIdx=null;
window.openQaModal=function(){
  _editQaIdx=null;g('qaModalTitle').textContent='Add Q&A Pair';
  g('qaKeyword').value='';g('qaReply').value='';
  g('qaModal').classList.add('open');
};
window.openEditQa=function(i){
  const qa=lsGet('sanayah_qa',[]);const item=qa[i];if(!item)return;
  _editQaIdx=i;g('qaModalTitle').textContent='Edit Q&A Pair';
  g('qaKeyword').value=item.key;
  g('qaReply').value=item.reply;
  g('qaModal').classList.add('open');
};
window.saveQaPair=function(){
  const key=g('qaKeyword').value.trim().toLowerCase(),reply=g('qaReply').value.trim();
  if(!key){showToast('Please enter a keyword','error');return;}
  if(!reply){showToast('Please enter a reply','error');return;}
  const qa=lsGet('sanayah_qa',[]);
  if(_editQaIdx!==null){qa[_editQaIdx]={key,reply};}
  else {qa.push({key,reply});}
  lsSet('sanayah_qa',qa);
  closeQaModal();loadQaList();showToast(_editQaIdx!==null?'Q&A updated':'Q&A added');
};
window.deleteQa=function(i){
  window._delCb=function(){const qa=lsGet('sanayah_qa',[]);qa.splice(i,1);lsSet('sanayah_qa',qa);loadQaList();showToast('Q&A deleted');};
  g('deleteModalMsg').textContent='Delete this Q&A pair?';
  g('deleteModal').classList.add('open');
};
function closeQaModal(){g('qaModal').classList.remove('open');_editQaIdx=null;}
window.closeQaModal=closeQaModal;

// ─── SETTINGS ───
function loadSettings(){
  g('newPass').value='';
  g('waNum').value=lsGet('sanayah_wa','923002816459');
  loadSettingAsync('sanayah_contact',{email:'',address:'',ptcl:'',hours:''}).then(function(contact){
    g('setEmail').value=contact.email||'';
    g('setAddress').value=contact.address||'';
    g('setPtcl').value=contact.ptcl||'';
    g('setHours').value=contact.hours||'';
  });
  const seo=lsGet('sanayah_seo',{title:'',desc:'',keywords:''});
  g('seoTitle').value=seo.title||'';
  g('seoDesc').value=seo.desc||'';
  g('seoKeywords').value=seo.keywords||'';
  const popup=lsGet('sanayah_popup',{enabled:false,text:'',image:''});
  g('popupEnabled').value=popup.enabled?'1':'0';
  g('popupText').value=popup.text||'';
  _popupImgData=popup.image||'';
  const pp=g('popupImgPreview');
  if(_popupImgData){pp.src=_popupImgData;pp.style.display='block';}else pp.style.display='none';
  const emailCfg=lsGet('sanayah_email',{key:'',service:'',template:'',recipient:'sanayahtravels@gmail.com'});
  g('emailjsKey').value=emailCfg.key||'';
  g('emailjsService').value=emailCfg.service||'';
  g('emailjsTemplate').value=emailCfg.template||'';
  g('emailjsRecipient').value=emailCfg.recipient||'sanayahtravels@gmail.com';
}
window.changeAdminPass=function(){
  const p=g('newPass').value.trim();
  if(p.length<4){showToast('Password must be at least 4 characters','error');return;}
  lsSet(PASS_KEY,p);
  apiChangePassword('',p);
  showToast('Password changed');
};
window.saveWaNum=function(){
  const v=g('waNum').value.trim();
  if(v){lsSet('sanayah_wa',v);apiSaveSetting('sanayah_wa',v);showToast('WhatsApp number saved');}
  else showToast('Please enter a number','error');
};
window.saveContactInfo=function(){
  const v={email:g('setEmail').value.trim(),address:g('setAddress').value.trim(),ptcl:g('setPtcl').value.trim(),hours:g('setHours').value.trim()};
  lsSet('sanayah_contact',v);apiSaveSetting('sanayah_contact',v);
  showToast('Contact info saved');
};
window.saveSeo=function(){
  const v={title:g('seoTitle').value.trim(),desc:g('seoDesc').value.trim(),keywords:g('seoKeywords').value.trim()};
  lsSet('sanayah_seo',v);apiSaveSetting('sanayah_seo',v);
  showToast('SEO settings saved');
};
let _popupImgData='';
window.handlePopupImg=function(inp){
  const file=inp.files&&inp.files[0];if(!file)return;
  const r=new FileReader();
  r.onload=function(e){_popupImgData=e.target.result;const p=g('popupImgPreview');p.src=_popupImgData;p.style.display='block';};
  r.readAsDataURL(file);
};
window.adminRemovePopupImg=function(){
  _popupImgData='';g('popupImgPreview').style.display='none';
  showToast('Popup image removed');
};
window.savePopupSettings=function(){
  const v={enabled:g('popupEnabled').value==='1',text:g('popupText').value.trim(),image:_popupImgData};
  lsSet('sanayah_popup',v);apiSaveSetting('sanayah_popup',v);
  showToast('Popup settings saved');
};
window.saveEmailConfig=function(){
  const v={key:g('emailjsKey').value.trim(),service:g('emailjsService').value.trim(),template:g('emailjsTemplate').value.trim(),recipient:g('emailjsRecipient').value.trim()};
  lsSet('sanayah_email',v);apiSaveSetting('sanayah_email',v);
  showToast('Email settings saved');
};
window.loadVisitors=function(){
  apiGetVisitors(50).then(function(visitors){
    if (!visitors || !visitors.length) visitors = lsGet('sanayah_visitors',[]);
    else lsSet('sanayah_visitors', visitors);
    renderVisitorsTable(visitors);
  });
};
function renderVisitorsTable(visitors) {
  const tbody=g('visitorsTableBody');
  if(!visitors.length){tbody.innerHTML='<tr><td colspan="7" style="text-align:center;color:#64748b;padding:40px">No visitors tracked yet.</td></tr>';return;}
  tbody.innerHTML=visitors.map(function(v,i){
    var timeStr='';
    if(v.time){var d=new Date(v.time);timeStr=d.toLocaleDateString()+' '+d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});}
    return '<tr><td>'+(i+1)+'</td><td style="font-family:monospace;font-size:.8rem">'+esc(v.ip||'')+'</td><td>'+esc(v.country||'')+'</td><td>'+esc(v.city||'')+'</td><td>'+esc(v.region||'')+'</td><td>'+esc(v.page||'')+'</td><td style="font-size:.75rem;white-space:nowrap">'+timeStr+'</td></tr>';
  }).join('');
}

// ─── DELETE MODAL ───
window.closeDeleteModal=function(){g('deleteModal').classList.remove('open');window._delCb=null;};
window.confirmDeleteAction=function(){if(window._delCb){window._delCb();window._delCb=null;}g('deleteModal').classList.remove('open');};

// ─── MODAL CLOSE ON OVERLAY CLICK ───
document.addEventListener('click',function(e){
  ['airlineModal','blogModal','qaModal','deleteModal'].forEach(id=>{
    const el=g(id);
    if(el&&el.classList.contains('open')&&e.target===el)el.classList.remove('open');
  });
});

// ─── ESCAPE ───
function esc(s){
  if(!s||typeof s!=='string')return s||'';
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

// ─── INIT ───
function loadAll(){
  loadDashboard();
}
})();
