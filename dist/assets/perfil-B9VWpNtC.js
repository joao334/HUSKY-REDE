import"./responsive-DLDRbQL4.js";import{r as n,h as l,d as o,c as d,a as c,A as p,e,t as m}from"./utils-CCU120BG.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";async function u(){await n();const i=new URLSearchParams(location.search).get("u"),t=await l(),s=o.find(a=>a.username===i)||o[0],r=d.filter(a=>a.user_id===s.id||!i);c("perfil",`
    <section class="profile-head">
      <div class="profile-banner"></div>
      <div class="profile-info">
        <img class="avatar" src="${s.avatar_url||p.defaultAvatar}" alt="${e(s.username)}">
        <div>
          <div class="between" style="align-items:flex-start">
            <h1>${e(s.full_name||s.username)} ${s.is_verified?"✓":""}</h1>
            <div class="row">
              <button class="btn secondary" id="edit-profile">${s.id==="demo-me"||s.id===(t==null?void 0:t.id)?"Editar perfil":"Seguir"}</button>
              <a class="btn secondary" href="/mensagens.html">Mensagem</a>
            </div>
          </div>
          <div class="stats"><span class="stat"><strong>${r.length}</strong> posts</span><span class="stat"><strong>12,8k</strong> seguidores</span><span class="stat"><strong>340</strong> seguindo</span></div>
          <p><strong>@${e(s.username)}</strong></p>
          <p>${e(s.bio||"")}</p>
          <p class="muted">${e(s.location||"Brasil")} · <a href="#">${e(s.website||"site.example")}</a></p>
        </div>
      </div>
      <div class="tabs"><button class="tab active">Posts</button><button class="tab">Reels</button><button class="tab">Salvos</button><button class="tab">Marcados</button></div>
    </section>
    <div class="grid-explore" style="margin-top:4px">${r.map(a=>`<a class="tile" href="/home.html?post=${a.id}">${a.media_type==="video"?`<video src="${a.media_url}"></video>`:`<img src="${a.media_url}">`}</a>`).join("")}</div>`),document.querySelector("#edit-profile").onclick=()=>m(s.id==="demo-me"?"Abra configuracoes para editar perfil.":"Solicitacao registrada.")}document.body.dataset.page==="perfil"&&u();
