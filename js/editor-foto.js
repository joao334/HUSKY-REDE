import { appShell, $, requireUser, toast } from './utils.js';

const state = {
  img: null,
  scale: 1,
  rotate: 0,
  flipX: 1,
  flipY: 1,
  x: 0,
  y: 0,
  ratio: 1,
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  temperature: 0,
  text: '',
  sticker: '',
  filter: 'none',
};

const filters = {
  Original: 'none',
  Vintage: 'sepia(.35) contrast(1.05)',
  Cinema: 'contrast(1.2) saturate(.85)',
  Retro: 'sepia(.5) saturate(1.25)',
  'P&B': 'grayscale(1)',
  Quente: 'sepia(.18) saturate(1.2)',
  Frio: 'hue-rotate(190deg) saturate(1.08)',
  Vibrante: 'saturate(1.55) contrast(1.08)',
  Suave: 'brightness(1.06) saturate(.85)',
  Dramatico: 'contrast(1.35) brightness(.9)',
  Matte: 'contrast(.92) brightness(1.05) saturate(.9)',
  Clarendon: 'contrast(1.22) saturate(1.25)',
  Lark: 'brightness(1.08) saturate(1.15)',
  Juno: 'contrast(1.12) sepia(.12) saturate(1.28)',
  Valencia: 'sepia(.25) brightness(1.06) contrast(.96)',
};

function canvas() { return $('#photo-canvas'); }
function ctx() { return canvas().getContext('2d'); }

function draw() {
  const c = canvas();
  const context = ctx();
  const w = 1200;
  const h = Math.round(w / state.ratio);
  c.width = w;
  c.height = h;
  context.save();
  context.clearRect(0, 0, w, h);
  context.fillStyle = '#000';
  context.fillRect(0, 0, w, h);
  context.filter = `${state.filter} brightness(${state.brightness}%) contrast(${state.contrast}%) saturate(${state.saturation}%) blur(${state.blur}px)`;
  if (state.temperature) context.filter += ` sepia(${Math.max(state.temperature, 0) / 100}) hue-rotate(${state.temperature < 0 ? -12 : 8}deg)`;
  if (state.img) {
    const base = Math.max(w / state.img.width, h / state.img.height) * state.scale;
    const iw = state.img.width * base;
    const ih = state.img.height * base;
    context.translate(w / 2 + state.x, h / 2 + state.y);
    context.rotate((state.rotate * Math.PI) / 180);
    context.scale(state.flipX, state.flipY);
    context.drawImage(state.img, -iw / 2, -ih / 2, iw, ih);
  }
  context.restore();
  context.filter = 'none';
  if (state.text) {
    context.font = '800 64px Inter, sans-serif';
    context.fillStyle = $('#text-color')?.value || '#ffffff';
    context.textAlign = 'center';
    context.fillText(state.text, w / 2, h - 110);
  }
  if (state.sticker) {
    context.font = '96px serif';
    context.fillText(state.sticker, w - 130, 130);
  }
}

function setRange(name, value) {
  state[name] = Number(value);
  draw();
}

export async function renderEditor() {
  await requireUser();
  appShell('criar', `
    <div class="editor-page">
      <section class="editor-stage"><canvas id="photo-canvas"></canvas></section>
      <aside class="editor-panel">
        <h1>Editor de foto</h1>
        <input class="input" id="photo-file" type="file" accept="image/*">
        <div class="ratio-grid">
          ${[['1:1', 1], ['4:5', .8], ['16:9', 1.777], ['9:16', .5625], ['Livre', 1.333]].map(([label, value]) => `<button class="chip ratio" data-ratio="${value}">${label}</button>`).join('')}
        </div>
        <div class="tool-grid">
          <button class="btn secondary" id="left">Girar esquerda</button>
          <button class="btn secondary" id="right">Girar direita</button>
          <button class="btn secondary" id="flip-x">Espelhar H</button>
          <button class="btn secondary" id="flip-y">Espelhar V</button>
        </div>
        ${['scale:Zoom:1:3:.01', 'x:Horizontal:-500:500:1', 'y:Vertical:-500:500:1', 'brightness:Brilho:0:200:1', 'contrast:Contraste:0:200:1', 'saturation:Saturacao:0:250:1', 'temperature:Temperatura:-100:100:1', 'blur:Desfoque:0:8:.1'].map((raw) => {
          const [name, label, min, max, step] = raw.split(':');
          return `<label class="range-row"><span>${label}</span><input data-range="${name}" type="range" min="${min}" max="${max}" step="${step}" value="${state[name]}"></label>`;
        }).join('')}
        <div class="filter-grid">${Object.keys(filters).map((name) => `<button class="chip filter" data-filter="${name}">${name}</button>`).join('')}</div>
        <label class="label">Texto sobre a imagem<input class="input" id="overlay-text"></label>
        <label class="label">Cor do texto<input class="input" id="text-color" type="color" value="#ffffff"></label>
        <label class="label">Sticker/emoji<input class="input" id="sticker" placeholder="✨"></label>
        <button class="btn secondary" id="reset">Remover alteracoes</button>
        <button class="btn" id="download">Baixar imagem editada</button>
        <button class="btn" id="continue">Salvar e continuar postagem</button>
      </aside>
    </div>`);
  draw();
  $('#photo-file').onchange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => { state.img = img; draw(); };
    img.src = URL.createObjectURL(file);
  };
  document.querySelectorAll('[data-range]').forEach((input) => input.oninput = () => setRange(input.dataset.range, input.value));
  document.querySelectorAll('.ratio').forEach((button) => button.onclick = () => { state.ratio = Number(button.dataset.ratio); draw(); });
  document.querySelectorAll('.filter').forEach((button) => button.onclick = () => { state.filter = filters[button.dataset.filter]; draw(); });
  $('#left').onclick = () => { state.rotate -= 90; draw(); };
  $('#right').onclick = () => { state.rotate += 90; draw(); };
  $('#flip-x').onclick = () => { state.flipX *= -1; draw(); };
  $('#flip-y').onclick = () => { state.flipY *= -1; draw(); };
  $('#overlay-text').oninput = (e) => { state.text = e.target.value; draw(); };
  $('#text-color').oninput = draw;
  $('#sticker').oninput = (e) => { state.sticker = e.target.value; draw(); };
  $('#reset').onclick = () => location.reload();
  $('#download').onclick = () => {
    const a = document.createElement('a');
    a.href = canvas().toDataURL('image/webp', .92);
    a.download = 'foto-editada.webp';
    a.click();
  };
  $('#continue').onclick = () => {
    sessionStorage.setItem('edited-image', canvas().toDataURL('image/webp', .9));
    toast('Edicao salva.');
    location.href = '/criar-post.html';
  };
}

if (document.body.dataset.page === 'editor') renderEditor();
