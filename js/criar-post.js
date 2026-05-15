import { appShell, $, requireUser, toast } from './utils.js';
import { createPost, uploadMedia } from './posts.js';

async function renderCreatePost() {
  await requireUser();
  appShell('criar', `
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
    </div>`);
  const edited = sessionStorage.getItem('edited-image');
  if (edited) $('#preview').innerHTML = `<img src="${edited}" alt="Foto editada" style="max-height:72vh">`;
  $('#post-file').onchange = (event) => {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    $('#preview').innerHTML = file.type.startsWith('video/') ? `<video src="${url}" controls style="max-height:72vh"></video>` : `<img src="${url}" style="max-height:72vh">`;
  };
  $('#post-form').onsubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const file = $('#post-file').files[0];
    let mediaUrl = edited;
    if (!mediaUrl && file) mediaUrl = await uploadMedia(file, 'posts');
    if (!mediaUrl) return toast('Escolha uma midia ou salve uma edicao.', 'error');
    await createPost({ file, mediaUrl, mediaType: file?.type?.startsWith('video/') ? 'video' : 'image', caption: form.get('caption'), location: form.get('location'), visibility: form.get('visibility') });
    sessionStorage.removeItem('edited-image');
    toast('Post publicado.');
    location.href = '/home.html';
  };
}

if (document.body.dataset.page === 'criar') renderCreatePost();
