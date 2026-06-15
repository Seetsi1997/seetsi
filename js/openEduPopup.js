function openEduPopup(id) {
  if (typeof closeCertPanel === 'function') closeCertPanel();
  if (typeof closeViewer === 'function') closeViewer();

  document.querySelectorAll('.edu-popup').forEach(p => p.classList.remove('active'));
  
  const popup = document.getElementById('popup-' + id);
  if (popup) popup.classList.add('active');
  
  const overlay = document.getElementById('eduOverlay');
  if (overlay) overlay.classList.add('active');
  
  document.body.style.overflow = 'hidden';
}

function closeEduPopup() {
  document.querySelectorAll('.edu-popup').forEach(p => p.classList.remove('active'));
  document.getElementById('eduOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeEduPopup();
    if (typeof closeCertPanel === 'function') closeCertPanel();
    if (typeof closeViewer    === 'function') closeViewer();
  }
});