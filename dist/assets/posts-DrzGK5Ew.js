import{c as m,d as p,e as c,A as _,f as b,l as y,g as f,t as v,h as d}from"./utils-CCU120BG.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";async function g(t,e="posts"){return t?URL.createObjectURL(t):null}async function q({query:t="",hashtag:e=""}={}){return m}async function P({file:t,caption:e,location:a,visibility:o="public",mediaUrl:i,mediaType:r}){var n;await d();const l=i||await g(t,"posts"),u=r||((n=t==null?void 0:t.type)!=null&&n.startsWith("video/")?"video":"image");{const s=p[0];return m.unshift({id:crypto.randomUUID(),user_id:s.id,profile:s,media_url:l,media_type:u,caption:e,location:a,visibility:o,likes_count:0,comments_count:0,saves_count:0,created_at:new Date().toISOString()}),m[0]}}async function k(t){return await d(),t.__liked=!t.__liked,t.likes_count+=t.__liked?1:-1,t.__liked}async function h(t){return await d(),t.__saved=!t.__saved,v(t.__saved?"Post salvo.":"Post removido dos salvos."),t.__saved}async function $(t,e){if(await d(),!!e.trim()){t.comments_count+=1,v("Comentario publicado.");return}}function E(t){const e=t.profile||p.find(o=>o.id===t.user_id)||p[0],a=t.media_type==="video"?`<video class="post-media" src="${t.media_url}" controls playsinline></video>`:`<img class="post-media" src="${t.media_url}" alt="${c(t.caption||"Post")}">`;return`
    <article class="card post" data-post="${t.id}">
      <div class="between pad">
        <a class="row" href="/perfil.html?u=${e.username}">
          <img class="avatar story-ring" src="${e.avatar_url||_.defaultAvatar}" alt="${c(e.username||"")}">
          <span><strong>${c(e.username||e.full_name||"usuario")}</strong><br><span class="tiny muted">${c(t.location||"Feed")} · ${b(t.created_at)}</span></span>
        </a>
        <button class="icon-btn report-post">⋯</button>
      </div>
      ${a}
      <div class="post-actions">
        <div class="icon-actions">
          <button class="icon-btn like-post">♡</button>
          <button class="icon-btn comment-post">◌</button>
          <button class="icon-btn share-post">↗</button>
        </div>
        <button class="icon-btn save-post">▱</button>
      </div>
      <div class="caption">
        <p><strong class="likes-count">${t.likes_count||0}</strong> curtidas</p>
        <p><strong>${c(e.username||"usuario")}</strong> ${y(t.caption||"")}</p>
        <button class="icon-btn tiny muted comment-post">Ver ${t.comments_count||0} comentarios</button>
      </div>
    </article>`}function A(t,e){t.querySelectorAll(".post").forEach(a=>{var i,r,l,u;const o=e.find(n=>n.id===a.dataset.post);(i=a.querySelector(".like-post"))==null||i.addEventListener("click",async n=>{const s=await k(o);n.currentTarget.classList.toggle("active",s),a.querySelector(".likes-count").textContent=o.likes_count||0}),(r=a.querySelector(".save-post"))==null||r.addEventListener("click",async n=>{const s=await h(o);n.currentTarget.classList.toggle("active",s)}),a.querySelectorAll(".comment-post").forEach(n=>n.addEventListener("click",()=>w(o))),(l=a.querySelector(".share-post"))==null||l.addEventListener("click",()=>f(`${location.origin}/home.html?post=${o.id}`)),(u=a.querySelector(".report-post"))==null||u.addEventListener("click",()=>v("Denuncia enviada para moderacao."))})}function w(t){const e=document.createElement("div");e.className="modal-backdrop",e.innerHTML='<div class="modal pad"><div class="between"><h2>Comentarios</h2><button class="icon-btn close">×</button></div><div class="comments"></div><form class="row"><input class="input" name="comment" placeholder="Adicionar comentario..."><button class="btn">Enviar</button></form></div>',document.body.appendChild(e),e.querySelector(".close").onclick=()=>e.remove(),e.querySelector("form").onsubmit=async a=>{a.preventDefault(),await $(t,new FormData(a.currentTarget).get("comment")),e.remove()}}export{P as c,q as f,E as p,g as u,A as w};
