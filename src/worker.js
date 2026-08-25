const json = (data, status=200, extra={}) =>
  new Response(JSON.stringify(data), {status, headers: {"content-type":"application/json; charset=utf-8", ...extra}});

function slugify(s) {
  return String(s||"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
}
function youtubeId(url) {
  const s = String(url||"");
  const m = s.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : null;
}
async function auth(req, env) {
  const key = req.headers.get("x-admin-key") || new URL(req.url).searchParams.get("key");
  return !!env.ADMIN_KEY && key === env.ADMIN_KEY;
}
async function api(req, env) {
  const u = new URL(req.url);
  if (u.pathname === "/api/health") return json({ok:true, d1:!!env.DB, r2:!!env.PHOTOS});
  if (u.pathname === "/api/settings") {
    const r = await env.DB.prepare("SELECT setting_key,setting_value FROM settings").all();
    return json(Object.fromEntries(r.results.map(x=>[x.setting_key,x.setting_value])));
  }
  if (u.pathname === "/api/programs") return json((await env.DB.prepare("SELECT * FROM programs WHERE is_active=1 ORDER BY sort_order").all()).results);
  if (u.pathname === "/api/budgets") return json((await env.DB.prepare("SELECT * FROM budgets WHERE is_active=1 ORDER BY sort_order").all()).results);

  if (u.pathname === "/api/albums") {
    const q=(u.searchParams.get("q")||"").trim(), program=u.searchParams.get("program"), budget=u.searchParams.get("budget");
    const sort=u.searchParams.get("sort")==="desc" ? "DESC" : "ASC";
    let sql=`SELECT a.*,p.name program_name,b.name budget_name,
      (SELECT COUNT(*) FROM photos ph WHERE ph.album_id=a.id) photo_count
      FROM albums a LEFT JOIN programs p ON p.id=a.program_id LEFT JOIN budgets b ON b.id=a.budget_id
      WHERE a.is_published=1`;
    const binds=[];
    if(q){sql += " AND (a.title LIKE ? OR a.description LIKE ? OR a.keywords LIKE ? OR p.name LIKE ? OR b.name LIKE ?)"; const x=`%${q}%`; binds.push(x,x,x,x,x);}
    if(program){sql += " AND a.program_id=?"; binds.push(Number(program));}
    if(budget){sql += " AND a.budget_id=?"; binds.push(Number(budget));}
    sql += ` ORDER BY a.price ${sort}, a.id DESC`;
    return json((await env.DB.prepare(sql).bind(...binds).all()).results);
  }
  if (u.pathname.startsWith("/api/albums/")) {
    const id=Number(u.pathname.split("/").pop());
    const a=await env.DB.prepare(`SELECT a.*,p.name program_name,b.name budget_name FROM albums a
      LEFT JOIN programs p ON p.id=a.program_id LEFT JOIN budgets b ON b.id=a.budget_id WHERE a.id=?`).bind(id).first();
    if(!a) return json({error:"Not found"},404);
    const ph=(await env.DB.prepare("SELECT * FROM photos WHERE album_id=? ORDER BY sort_order,id").bind(id).all()).results;
    return json({...a,photos:ph.map(x=>({...x,url:`/media/${encodeURIComponent(x.object_key)}`}))});
  }
  if (u.pathname === "/api/videos") return json((await env.DB.prepare("SELECT * FROM videos WHERE is_published=1 ORDER BY published_at DESC, id DESC LIMIT 10").all()).results);

  if (!(await auth(req,env))) return json({error:"Admin authorization required"},401);

  if (u.pathname === "/api/admin/album" && req.method==="POST") {
    const b=await req.json(); const title=String(b.title||"").trim(); if(!title) return json({error:"Title required"},400);
    const slug=slugify(b.slug||title)+"-"+Date.now().toString(36);
    const r=await env.DB.prepare(`INSERT INTO albums(title,slug,description,program_id,budget_id,price,cover_key,youtube_url,keywords,is_featured)
      VALUES(?,?,?,?,?,?,?,?,?,?)`).bind(title,slug,b.description||"",b.program_id?Number(b.program_id):null,b.budget_id?Number(b.budget_id):null,Math.max(1000,Number(b.price)||1000),b.cover_key||null,b.youtube_url||"",b.keywords||"",b.is_featured?1:0).run();
    return json({ok:true,id:r.meta.last_row_id});
  }
  if (u.pathname === "/api/admin/setting" && req.method==="POST") {
    const b=await req.json(); await env.DB.prepare("INSERT INTO settings(setting_key,setting_value) VALUES(?,?) ON CONFLICT(setting_key) DO UPDATE SET setting_value=excluded.setting_value").bind(b.key,String(b.value||"")).run(); return json({ok:true});
  }
  if (u.pathname === "/api/admin/video" && req.method==="POST") {
    const b=await req.json(), id=youtubeId(b.url||b.youtube_id); if(!id) return json({error:"Invalid YouTube URL"},400);
    await env.DB.prepare(`INSERT INTO videos(youtube_id,title,description,published_at,thumbnail_url) VALUES(?,?,?,?,?)
      ON CONFLICT(youtube_id) DO UPDATE SET title=excluded.title,description=excluded.description`).bind(id,b.title||id,b.description||"",b.published_at||new Date().toISOString(),`https://i.ytimg.com/vi/${id}/hqdefault.jpg`).run();
    return json({ok:true,youtube_id:id});
  }
  if (u.pathname === "/api/admin/photo-upload" && req.method==="POST") {
    if(!env.PHOTOS) return json({error:"R2 binding missing"},500);
    const ct=req.headers.get("content-type")||"";
    if(!ct.includes("multipart/form-data")) return json({error:"Use multipart/form-data"},400);
    const form=await req.formData(), albumId=Number(form.get("album_id")), file=form.get("file");
    if(!albumId || !file || typeof file.arrayBuffer!=="function") return json({error:"album_id and file required"},400);
    const ext=(file.name||"jpg").split(".").pop().replace(/[^a-z0-9]/gi,"").slice(0,5)||"jpg";
    const key=`albums/${albumId}/${crypto.randomUUID()}.${ext}`;
    await env.PHOTOS.put(key, file.stream(), {httpMetadata:{contentType:file.type||"image/jpeg"}});
    await env.DB.prepare("INSERT INTO photos(album_id,object_key,alt_text,sort_order) VALUES(?,?,?,COALESCE((SELECT MAX(sort_order)+1 FROM photos WHERE album_id=?),0))").bind(albumId,key,form.get("alt_text")||"",albumId).run();
    return json({ok:true,key,url:`/media/${encodeURIComponent(key)}`});
  }
  return json({error:"Unknown API route"},404);
}

export default {
  async fetch(req, env, ctx) {
    const u=new URL(req.url);
    try {
      if(u.pathname.startsWith("/api/")) return await api(req,env);
      if(u.pathname.startsWith("/media/")) {
        if(!env.PHOTOS) return new Response("R2 not configured",{status:500});
        const key=decodeURIComponent(u.pathname.slice("/media/".length));
        const obj=await env.PHOTOS.get(key);
        if(!obj) return new Response("Not found",{status:404});
        return new Response(obj.body,{headers:{"content-type":obj.httpMetadata?.contentType||"image/jpeg","cache-control":"public,max-age=31536000,immutable"}});
      }
      return env.ASSETS.fetch(req);
    } catch(e) { return json({error:e.message},500); }
  }
};
