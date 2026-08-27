const $=s=>document.querySelector(s);
const programs=["Birthday Decoration","Theme Based Birthday","Anniversary","Baby Shower","Welcome Baby","Annaprashan","Balloon Decoration","Wedding Stage","Haldi - Mehendi","Entry Setup"];
const budgets=["Starting","Under ₹3,000","Under ₹5,000","Under ₹8,000","Under ₹10,000","Under ₹15,000","Under ₹20,000","Under ₹25,000","Under ₹30,000","Under ₹40,000","Under ₹50,000"];
const icons=["🎂","👑","❤️","👶","🍼","🌸","🎈","💍","🌿","✨"];
let view="albums", offset=0;

function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function shareButton(title,url){return `<button class="share" data-share-title="${esc(title)}" data-share-url="${esc(url)}">↗ Share</button>`}
async function share(title,url){try{if(navigator.share) await navigator.share({title,url}); else {await navigator.clipboard.writeText(url);alert("Link copied!");}}catch(e){}}
document.addEventListener("click",e=>{const b=e.target.closest("[data-share-url]");if(b)share(b.dataset.shareTitle,b.dataset.shareUrl)});
function skeleton(n=4){return Array.from({length:n},()=>'<div class="skeleton"></div>').join("")}

async function get(url){const r=await fetch(url);if(!r.ok)throw new Error(await r.text());return r.json()}

function initFilters(){
  programs.forEach(x=>$("#program").insertAdjacentHTML("beforeend",`<option>${esc(x)}</option>`));
  budgets.forEach(x=>$("#budget").insertAdjacentHTML("beforeend",`<option>${esc(x)}</option>`));
  $("#program").onchange=()=>loadGallery(true);$("#budget").onchange=()=>loadGallery(true);$("#sort").onchange=()=>loadGallery(true);
  document.querySelectorAll("[data-view]").forEach(b=>b.onclick=()=>{view=b.dataset.view;document.querySelectorAll("[data-view]").forEach(x=>x.classList.remove("active"));b.classList.add("active");loadGallery(true)});
}
function albumCard(a){
 const url=`${location.origin}/album/${encodeURIComponent(a.slug)}`;
 return `<article class="card"><a class="cover photo-cover" href="/album/${encodeURIComponent(a.slug)}">${a.cover_url?`<img src="${esc(a.cover_url)}" alt="${esc(a.title)}">`:"<div class=\"cover-fallback\">VIP<br>CELEBRATIONS</div>"}<span>▧ ${a.photo_count||0} Photos</span></a><div class="info"><h3>${esc(a.title)}</h3><p>${esc(a.program_name||"")} • ${esc(a.budget_name||"")}</p><div class="price">Starting ₹${Number(a.price||0).toLocaleString("en-IN")}</div><div class="card-actions"><a href="https://wa.me/919691683699?text=${encodeURIComponent("Hi VIP Celebrations, I am interested in "+a.title+" (Starting ₹"+a.price+").")}">Enquire →</a>${shareButton(a.title,url)}</div></div></article>`
}
function photoCard(p){return `<article class="photo-card"><a href="/album/${encodeURIComponent(p.slug)}"><img src="${esc(p.url)}" alt="${esc(p.alt_text||p.title||"VIP Celebrations decoration")}"></a><div><b>${esc(p.album_title)}</b><small>${esc(p.program_name||"")}</small>${shareButton(p.album_title,`${location.origin}/album/${encodeURIComponent(p.slug)}`)}</div></article>`}

async function loadGallery(reset=false){
 if(reset)offset=0; $("#galleryGrid").innerHTML=skeleton(6);
 const params=new URLSearchParams({view,limit:12,offset,program:$("#program").value,budget:$("#budget").value,sort:$("#sort").value});
 try{const d=await get("/api/gallery?"+params);$("#galleryGrid").innerHTML=(view==="albums"?d.items.map(albumCard).join(""):d.items.map(photoCard).join(""))||`<div class="empty">No matching decorations found.</div>`;$("#galleryMore").classList.toggle("hidden",!d.hasMore);$("#loadMore").onclick=()=>{offset+=12;loadGallery(false)}}catch(e){$("#galleryGrid").innerHTML='<div class="empty">Gallery is temporarily unavailable.</div>'}
}

async function loadVideos(){
 $("#videosGrid").innerHTML=skeleton(6);
 try{const d=await get("/api/videos?limit=9");$("#videosGrid").innerHTML=d.items.map(v=>`<article class="video"><a href="https://www.youtube.com/watch?v=${esc(v.youtube_id)}" target="_blank" rel="noopener"><div class="thumb"><img loading="lazy" src="https://i.ytimg.com/vi/${esc(v.youtube_id)}/hqdefault.jpg" alt=""></div></a><div class="video-info"><h3>${esc(v.title)}</h3><p>${esc(v.description||"")}</p>${shareButton(v.title,"https://www.youtube.com/watch?v="+v.youtube_id)}</div></article>`).join("")||'<div class="empty">Latest channel videos will appear here after YouTube sync is configured.</div>'}catch(e){$("#videosGrid").innerHTML='<div class="empty">Videos are temporarily unavailable.</div>'}
}

async function loadPosts(){
 $("#postsGrid").innerHTML=skeleton(3);
 try{const d=await get("/api/posts?limit=6");$("#postsGrid").innerHTML=d.items.map(p=>`<article class="post"><div class="post-cover">${p.image_url?`<img src="${esc(p.image_url)}" alt="${esc(p.title)}">`:"<span>VIP CELEBRATIONS</span>"}</div><div class="post-body"><small>${new Date(p.created_at).toLocaleDateString("en-IN")}</small><h3>${esc(p.title)}</h3><p>${esc(p.excerpt||p.content||"")}</p><div class="card-actions"><a href="/post/${encodeURIComponent(p.slug)}">Read more →</a>${shareButton(p.title,`${location.origin}/post/${encodeURIComponent(p.slug)}`)}</div></div></article>`).join("")||'<div class="empty">No posts yet.</div>'}catch(e){$("#postsGrid").innerHTML='<div class="empty">Posts are temporarily unavailable.</div>'}
}

async function loadReviews(){
 $("#reviewsGrid").innerHTML=skeleton(3);
 try{const d=await get("/api/reviews");if(d.rating)$("#reviewSummary").innerHTML=`<strong>★ ${d.rating}</strong><span>${d.total||0} Google reviews</span>`;$("#reviewsGrid").innerHTML=(d.items||[]).map(r=>`<article><div class="stars">★★★★★</div><h3>${esc(r.author_name||"Google Customer")}</h3><small>${esc(r.relative_time_description||"")}</small><p>${esc(r.text||"")}</p></article>`).join("")||'<div class="empty">Connect Google Places API in Cloudflare to show live reviews.</div>'}catch(e){$("#reviewsGrid").innerHTML='<div class="empty">Live Google reviews are not configured yet.</div>'}
}

async function searchSite(){
 const q=$("#search").value.trim();if(!q){$("#searchResults").classList.add("hidden");return}
 $("#searchResults").classList.remove("hidden");$("#searchResults").innerHTML='<div class="search-loading">Searching albums, posts and VIP CELEBRATIONS videos…</div>';
 try{const d=await get("/api/search?q="+encodeURIComponent(q));$("#searchResults").innerHTML=`
 <div class="search-group"><h3>Albums & Photos</h3>${d.albums.map(a=>`<a class="search-item" href="/album/${encodeURIComponent(a.slug)}"><b>${esc(a.title)}</b><span>${esc(a.program_name||"")} • ₹${Number(a.price||0).toLocaleString("en-IN")}</span></a>`).join("")||"<p>No matching albums.</p>"}</div>
 <div class="search-group"><h3>Website Posts</h3>${d.posts.map(p=>`<a class="search-item" href="/post/${encodeURIComponent(p.slug)}"><b>${esc(p.title)}</b><span>${esc(p.excerpt||"")}</span></a>`).join("")||"<p>No matching posts.</p>"}</div>
 <div class="search-group"><h3>VIP CELEBRATIONS YouTube Videos</h3>${d.videos.map(v=>`<a class="search-item" target="_blank" href="https://www.youtube.com/watch?v=${esc(v.youtube_id)}"><b>${esc(v.title)}</b><span>YouTube • Official channel</span></a>`).join("")||"<p>No matching channel videos.</p>"}</div>`}catch(e){$("#searchResults").innerHTML="<p>Search unavailable.</p>"}
}
$("#searchBtn").onclick=searchSite;$("#search").onkeydown=e=>{if(e.key==="Enter")searchSite()};
$("#form").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);location.href="https://wa.me/919691683699?text="+encodeURIComponent(`Hi VIP Celebrations,\nName: ${f.get("name")}\nMobile: ${f.get("mobile")}\nEvent: ${f.get("event")}\nBudget: ${f.get("budget")}\nMessage: ${f.get("message")}`)};
$("#navToggle").onclick=()=>$("#nav").classList.toggle("open");
initFilters();loadGallery(true);loadVideos();loadPosts();loadReviews();