import{r as n,a as d,t as o,b as l,e as i}from"./utils-CCU120BG.js";import{u as p}from"./posts-DrzGK5Ew.js";function v(a=l){return`<div class="story-row">
    <a class="story-item" href="/stories.html"><span class="story-ring"><img src="/assets/default-avatar.png" alt="Seu story"></span><span>Seu story</span></a>
    ${a.map(e=>{var t,s,r;return`<button class="story-item open-story" data-story="${e.id}"><span class="story-ring"><img src="${((t=e.profile)==null?void 0:t.avatar_url)||e.media_url}" alt="${i(((s=e.profile)==null?void 0:s.username)||"story")}"></span><span>${i(((r=e.profile)==null?void 0:r.username)||e.text_content||"story")}</span></button>`}).join("")}
  </div>`}function b(){document.querySelectorAll(".open-story").forEach(a=>a.addEventListener("click",()=>{var s,r;const e=l.find(c=>c.id===a.dataset.story);if(!e)return;const t=document.createElement("div");t.className="modal-backdrop",t.innerHTML=`<div class="modal" style="max-width:420px;background:#000;color:white"><div style="height:4px;background:white;margin:14px;border-radius:9px"></div><div class="row pad"><img class="avatar" src="${((s=e.profile)==null?void 0:s.avatar_url)||"/assets/default-avatar.png"}"><strong>${((r=e.profile)==null?void 0:r.username)||"story"}</strong><button class="icon-btn close" style="margin-left:auto;color:white">×</button></div>${e.media_type==="video"?`<video src="${e.media_url}" autoplay controls style="width:100%;aspect-ratio:9/16;object-fit:cover"></video>`:`<img src="${e.media_url}" style="width:100%;aspect-ratio:9/16;object-fit:cover">`}<div class="pad"><p>${i(e.text_content||"")}</p><button class="btn secondary reply">Responder</button><button class="btn ghost like" style="color:white">♡ Curtir</button></div></div>`,document.body.appendChild(t),t.querySelector(".close").onclick=()=>t.remove(),t.querySelector(".reply").onclick=()=>o("Resposta enviada."),t.querySelector(".like").onclick=()=>o("Story curtido.")}))}async function u(){await n(),d("criar",`
    <div class="card pad">
      <h1>Publicar story</h1>
      <p class="muted">Stories expiram automaticamente em 24 horas.</p>
      <form id="story-form" class="editor-page" style="grid-template-columns:minmax(0,1fr) 320px">
        <div class="editor-stage"><div id="story-preview" class="muted">Escolha foto ou video</div></div>
        <div class="editor-panel">
          <label class="label">Midia<input class="input" id="story-file" type="file" accept="image/*,video/*" required></label>
          <label class="label">Texto<textarea class="textarea" name="text_content"></textarea></label>
          <label class="label">Sticker/emoji<input class="input" name="sticker" placeholder="✨"></label>
          <label class="label">Link<input class="input" name="link" placeholder="https://"></label>
          <button class="btn">Publicar story</button>
        </div>
      </form>
    </div>`);const a=document.querySelector("#story-file");a.addEventListener("change",()=>{const e=a.files[0],t=URL.createObjectURL(e);document.querySelector("#story-preview").innerHTML=e.type.startsWith("video/")?`<video src="${t}" controls style="max-height:70vh"></video>`:`<img src="${t}" style="max-height:70vh">`}),document.querySelector("#story-form").onsubmit=async e=>{e.preventDefault(),await p(a.files[0],"stories"),o("Story publicado."),location.href="/home.html"}}document.body.dataset.page==="stories"&&u();export{v as r,b as w};
