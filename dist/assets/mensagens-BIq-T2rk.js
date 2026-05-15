import"./responsive-DLDRbQL4.js";import{r as t,a as r,d as s,t as n}from"./utils-CCU120BG.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";async function o(){await t(),r("mensagens",`
    <section class="card message-layout">
      <aside class="conversation-list pad">
        <h2>Mensagens</h2>
        <input class="input" placeholder="Buscar usuario">
        ${s.slice(1).map(e=>`<button class="nav-link convo" data-user="${e.username}"><img class="avatar" src="${e.avatar_url}"><span><strong>${e.username}</strong><br><small class="muted">Toque para conversar</small></span></button>`).join("")}
      </aside>
      <div class="chat-window">
        <header class="pad row"><img class="avatar" src="${s[1].avatar_url}"><strong id="chat-name">${s[1].username}</strong></header>
        <div class="chat-messages" id="messages"><div class="bubble">Oi! Gostei do seu post.</div><div class="bubble me">Valeu! ✨</div></div>
        <form class="row pad" id="message-form"><input class="input" name="message" placeholder="Mensagem..."><button class="btn">Enviar</button></form>
      </div>
    </section>`),document.querySelectorAll(".convo").forEach(e=>e.onclick=()=>{document.querySelector("#chat-name").textContent=e.dataset.user,n("Conversa aberta.")}),document.querySelector("#message-form").onsubmit=e=>{e.preventDefault();const a=new FormData(e.currentTarget).get("message");a&&(document.querySelector("#messages").insertAdjacentHTML("beforeend",`<div class="bubble me">${a}</div>`),e.currentTarget.reset())}}document.body.dataset.page==="mensagens"&&o();
