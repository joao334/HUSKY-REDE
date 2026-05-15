import"./responsive-DLDRbQL4.js";import{r as i,a as o,s as l,c as d}from"./utils-CCU120BG.js";import{f as r}from"./posts-DrzGK5Ew.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";async function c(){await i(),o("explorar",`
    <div class="card pad">
      <h1>Explorar</h1>
      <input class="input" id="search" placeholder="Pesquisar usuarios, posts, hashtags e locais">
      <div class="ratio-grid" style="margin-top:12px">
        ${["Fotos","Videos","Reels","Pessoas","Hashtags","Loja"].map(e=>`<button class="chip filter">${e}</button>`).join("")}
      </div>
    </div>
    <div id="results" class="grid-explore" style="margin-top:14px">${l(6)}</div>`);const s=await r();t(s),document.querySelector("#search").oninput=async e=>{const a=await r({query:e.target.value});t(a.length?a:d)}}function t(s){document.querySelector("#results").innerHTML=s.map(e=>`<a class="tile" href="/home.html?post=${e.id}">${e.media_type==="video"?`<video src="${e.media_url}"></video>`:`<img src="${e.media_url}" alt="">`}</a>`).join("")}document.body.dataset.page==="explorar"&&c();
