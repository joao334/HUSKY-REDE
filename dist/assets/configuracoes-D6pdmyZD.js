import"./responsive-DLDRbQL4.js";import{r as o,a,i as n,t as e}from"./utils-CCU120BG.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";async function s(){await o(),a("perfil",`
    <section class="card pad">
      <h1>Configuracoes</h1>
      <div class="tool-grid" style="margin-top:16px">
        <button class="btn secondary" id="theme">Alterar tema</button>
        <button class="btn secondary">Conta privada</button>
        <button class="btn secondary">Bloquear usuarios</button>
        <button class="btn secondary">Posts salvos</button>
        <button class="btn secondary">Seguranca</button>
        <button class="btn danger">Excluir conta</button>
      </div>
    </section>`),document.querySelector("#theme").onclick=n,document.querySelectorAll(".btn:not(#theme)").forEach(t=>t.onclick=()=>e("Configuracao atualizada."))}document.body.dataset.page==="configuracoes"&&s();
