/* Small progressive enhancements; project content and links work without JS. */
'use strict';
document.documentElement.classList.add('js');

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.getElementById('navigation');
function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
}
menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  navigation.classList.toggle('is-open', isOpen);
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuToggle.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
window.matchMedia('(min-width: 561px)').addEventListener('change', closeMenu);

const stages = [
  {label: 'SOURCE', description: 'Fetch research abstracts from PubMed and retain the paper metadata needed to trace each source.'},
  {label: 'REPRESENT', description: 'Encode titles and abstracts with all-MiniLM-L6-v2. Persist the embeddings and paper metadata in ChromaDB.'},
  {label: 'FIND', description: 'Embed a question and retrieve nearby abstracts with cosine similarity, keeping the title, PMID, and source URL.'},
  {label: 'GENERATE', description: 'Pass retrieved abstracts to Mistral as context. Research mode prompts for numbered citations to the source papers.'}
];
const stageButtons = Array.from(document.querySelectorAll('[data-stage]'));
stageButtons.forEach(button => button.addEventListener('click', () => {
  const stage = stages[Number(button.dataset.stage)];
  stageButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  document.getElementById('stage-index').textContent = stage.label;
  document.getElementById('stage-description').textContent = stage.description;
}));

const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
const projectCards = Array.from(document.querySelectorAll('[data-category]'));
filterButtons.forEach(button => button.addEventListener('click', () => {
  const selected = button.dataset.filter;
  filterButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  let count = 0;
  projectCards.forEach(card => {
    card.hidden = selected !== 'all' && card.dataset.category !== selected;
    if (!card.hidden) count += 1;
  });
  document.getElementById('project-count').textContent = `${count} ${count === 1 ? 'project' : 'projects'}`;
}));

async function copyText(value, feedbackId, successMessage, fallback) {
  const feedback = document.getElementById(feedbackId);
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(value);
    feedback.textContent = successMessage;
  } catch {
    feedback.textContent = fallback;
    if (feedbackId === 'citation-feedback') document.querySelector('.citation-details').open = true;
  }
}
document.getElementById('copy-citation').addEventListener('click', () => {
  const source = document.getElementById('citation-text');
  const citation = `${source.textContent} doi: ${source.dataset.doi}.`;
  copyText(citation, 'citation-feedback', 'Citation copied.', 'Select and copy the citation below.');
});
document.getElementById('copy-email').addEventListener('click', () => {
  copyText('venna16042003@gmail.com', 'email-feedback', 'Email address copied.', 'Select the email address above to copy it.');
});
