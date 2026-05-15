import"./responsive-DLDRbQL4.js";import{r as e,a as n,d as o,c as r,t as i}from"./utils-CCU120BG.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";async function d(){await e();const a=[{id:"r1",target_type:"post",reason:"Spam",status:"pending"},{id:"r2",target_type:"profile",reason:"Golpe",status:"pending"}];n("admin",`
    <div class="card pad">
      <h1>Painel administrativo</h1>
      <div class="grid-explore" style="grid-template-columns:repeat(5,1fr);gap:12px">
        ${[["Usuarios",o.length],["Posts",r.length],["Stories",3],["Comentarios",58],["Denuncias",a.length]].map(([s,t])=>`<div class="card pad"><strong style="font-size:28px">${t}</strong><br><span class="muted">${s}</span></div>`).join("")}
      </div>
    </div>
    <div class="card pad" style="margin-top:16px">
      <h2>Denuncias pendentes</h2>
      ${a.map(s=>`<div class="between" style="padding:12px 0;border-bottom:1px solid var(--line)"><span><strong>${s.target_type}</strong><br><small>${s.reason}</small></span><span class="row"><button class="btn secondary">Remover post</button><button class="btn danger">Suspender usuario</button></span></div>`).join("")}
    </div>`),document.querySelectorAll(".btn").forEach(s=>s.onclick=()=>i("Acao de moderacao registrada."))}document.body.dataset.page==="admin"&&d();
