import"./responsive-DLDRbQL4.js";import{r as d,a as u,s as p,d as m,t as r,e as v,b as f}from"./utils-CCU120BG.js";import{f as g,p as c,w as n,u as w,c as y}from"./posts-DrzGK5Ew.js";import{r as h,w as b}from"./stories-Cs9bmFyN.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";async function q(){await d(),u("home",`
    <div class="feed-layout">
      <section id="feed-column">
        <div class="card">${h(f)}</div>
        <form class="card composer pad" id="quick-post" style="margin-top:14px">
          <div class="row">
            <img class="avatar" src="/assets/default-avatar.png" alt="Avatar">
            <textarea name="caption" placeholder="No que voce esta pensando? Use #hashtags e @mencoes"></textarea>
          </div>
          <div id="quick-preview"></div>
          <div class="between" style="margin-top:12px">
            <input id="quick-file" type="file" accept="image/*,video/*">
            <button class="btn">Publicar</button>
          </div>
        </form>
        <div id="feed-list" style="margin-top:14px">${p(3)}</div>
      </section>
      <aside class="right-rail">
        <div class="card pad">
          <h3>Sugestoes para seguir</h3>
          ${m.slice(1).map(e=>`<div class="between" style="margin-top:12px"><span class="row"><img class="avatar" src="${e.avatar_url}"><strong>${e.username}</strong></span><button class="btn secondary follow-btn">Seguir</button></div>`).join("")}
        </div>
        <a class="shop-cta" href="/explorar.html?filter=shop">🛍️ Ir para a loja</a>
      </aside>
    </div>`),b(),document.querySelectorAll(".follow-btn").forEach(e=>e.addEventListener("click",()=>{e.textContent="Seguindo",r("Usuario seguido.")}));const s=await g(),i=document.querySelector("#feed-list");i.innerHTML=s.map(c).join(""),n(i,s),document.querySelector("#quick-file").addEventListener("change",e=>{const a=e.target.files[0];if(!a)return;const t=URL.createObjectURL(a);document.querySelector("#quick-preview").innerHTML=a.type.startsWith("video/")?`<video class="post-media" src="${t}" controls></video>`:`<img class="post-media" src="${t}" alt="Preview">`}),document.querySelector("#quick-post").addEventListener("submit",async e=>{e.preventDefault();const a=new FormData(e.currentTarget),t=document.querySelector("#quick-file").files[0];if(!t&&!a.get("caption"))return r("Escolha uma midia ou escreva uma legenda.","error");const l=t?await w(t,"posts"):"",o=await y({file:t,mediaUrl:l,caption:v(a.get("caption")),location:"Feed",visibility:"public"});s.unshift(o),i.insertAdjacentHTML("afterbegin",c(o)),n(i,s),e.currentTarget.reset(),document.querySelector("#quick-preview").innerHTML="",r("Post publicado.")})}document.body.dataset.page==="home"&&q();
