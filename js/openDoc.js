function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

function openViewer(type, name, src) {
  const body = document.getElementById('viewerBody');
  const overlay = document.getElementById('noSaveOverlay');

  document.getElementById('viewerTitle').textContent = name;
  body.querySelectorAll('iframe, img').forEach(e => e.remove());

  if (type === 'pdf') {
    const iframe = document.createElement('iframe');
    // #toolbar=0 hides the PDF download toolbar in Chrome
    iframe.src = src + '#toolbar=0&navpanes=0&scrollbar=1';
    body.insertBefore(iframe, overlay);
  } else {
    const img = document.createElement('img');
    img.src = src;
    img.draggable = false;
    body.insertBefore(img, overlay);
  }

  // block right-click on overlay
  overlay.oncontextmenu = (e) => {
    e.preventDefault();
    showToast('Saving is disabled');
  };

  document.getElementById('viewerBackdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeViewer() {
  document.getElementById('viewerBackdrop').classList.remove('open');
  document.body.style.overflow = '';
}

// Block Ctrl+S, Ctrl+P when viewer is open
document.addEventListener('keydown', e => {
  const open = document.getElementById('viewerBackdrop').classList.contains('open');
  if (!open) return;
  if (e.key === 'Escape') { closeViewer(); return; }
  if ((e.ctrlKey || e.metaKey) && ['s','p','u'].includes(e.key.toLowerCase())) {
    e.preventDefault();
    showToast('Action not allowed');
  }
});