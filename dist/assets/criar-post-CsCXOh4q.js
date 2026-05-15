import"./responsive-DLDRbQL4.js";/* empty css               */import{r as c,a as d,$ as i,t as r}from"./utils-CCU120BG.js";import{u as n,c as p}from"./posts-DrzGK5Ew.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";async function m(){await c(),d("criar",`
    <div class="card pad">
      <div class="between"><div><h1>Criar post</h1><p class="muted">Escolha uma midia, edite, adicione legenda e publique.</p></div><a class="btn secondary" href="/editor-foto.html">Abrir editor</a></div>
      <form id="post-form" class="editor-page" style="margin-top:16px">
        <div class="editor-stage"><div id="preview" class="muted">Preview da foto ou video</div></div>
        <div class="editor-panel">
          <label class="label">Midia<input class="input" id="post-file" type="file" accept="image/*,video/*"></label>
          <label class="label">Legenda<textarea class="textarea" name="caption" placeholder="Escreva legenda com #hashtags e @mencoes"></textarea></label>
          <label class="label">Localizacao<input class="input" name="location" placeholder="Ex.: Sao Paulo"></label>
          <label class="label">Marcar pessoas<input class="input" name="mentions" placeholder="@usuario"></label>
          <label class="label">Visibilidade<select class="select" name="visibility"><option value="public">Publico</option><option value="followers">Apenas seguidores</option><option value="private">Privado</option></select></label>
          <button class="btn">Publicar</button>
        </div>
      </form>
    </div>`);const s=sessionStorage.getItem("edited-image");s&&(i("#preview").innerHTML=`<img src="${s}" alt="Foto editada" style="max-height:72vh">`),i("#post-file").onchange=t=>{const a=t.target.files[0],e=URL.createObjectURL(a);i("#preview").innerHTML=a.type.startsWith("video/")?`<video src="${e}" controls style="max-height:72vh"></video>`:`<img src="${e}" style="max-height:72vh">`},i("#post-form").onsubmit=async t=>{var l;t.preventDefault();const a=new FormData(t.currentTarget),e=i("#post-file").files[0];let o=s;if(!o&&e&&(o=await n(e,"posts")),!o)return r("Escolha uma midia ou salve uma edicao.","error");await p({file:e,mediaUrl:o,mediaType:(l=e==null?void 0:e.type)!=null&&l.startsWith("video/")?"video":"image",caption:a.get("caption"),location:a.get("location"),visibility:a.get("visibility")}),sessionStorage.removeItem("edited-image"),r("Post publicado."),location.href="/home.html"}}document.body.dataset.page==="criar"&&m();
