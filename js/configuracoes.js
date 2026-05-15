import { appShell, requireUser, toggleTheme, toast } from './utils.js';

async function renderSettings() {
  await requireUser();
  appShell('perfil', `
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
    </section>`);
  document.querySelector('#theme').onclick = toggleTheme;
  document.querySelectorAll('.btn:not(#theme)').forEach((button) => button.onclick = () => toast('Configuracao atualizada.'));
}

if (document.body.dataset.page === 'configuracoes') renderSettings();
