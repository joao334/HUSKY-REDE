import { appShell, demoPosts, requireUser, skeleton } from './utils.js';
import { fetchPosts } from './posts.js';

async function renderExplore() {
  await requireUser();
  appShell('explorar', `
    <div class="card pad">
      <h1>Explorar</h1>
      <input class="input" id="search" placeholder="Pesquisar usuarios, posts, hashtags e locais">
      <div class="ratio-grid" style="margin-top:12px">
        ${['Fotos','Videos','Reels','Pessoas','Hashtags','Loja'].map((item) => `<button class="chip filter">${item}</button>`).join('')}
      </div>
    </div>
    <div id="results" class="grid-explore" style="margin-top:14px">${skeleton(6)}</div>`);
  const posts = await fetchPosts();
  renderGrid(posts);
  document.querySelector('#search').oninput = async (event) => {
    const rows = await fetchPosts({ query: event.target.value });
    renderGrid(rows.length ? rows : demoPosts);
  };
}

function renderGrid(posts) {
  document.querySelector('#results').innerHTML = posts.map((post) => `<a class="tile" href="/home.html?post=${post.id}">${post.media_type === 'video' ? `<video src="${post.media_url}"></video>` : `<img src="${post.media_url}" alt="">`}</a>`).join('');
}

if (document.body.dataset.page === 'explorar') renderExplore();
