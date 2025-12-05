// form-preview.js (mejorado)
document.addEventListener('DOMContentLoaded', ()=> {
  const fileInputs = document.querySelectorAll('input[type="file"].img-preview');
  fileInputs.forEach(input => {
    const previewSelector = input.dataset.preview;
    const previewContainer = document.querySelector(previewSelector);
    input.addEventListener('change', e => {
      const file = e.target.files[0];
      if(!file){ previewContainer.innerHTML = '<span>Sin imagen</span>'; return; }
      // limitar tamaño de imagen para preview (visual only)
      const img = document.createElement('img');
      img.alt = 'preview';
      const reader = new FileReader();
      reader.onload = () => {
        previewContainer.innerHTML = '';
        img.src = reader.result;
        img.style.maxWidth = '100%';
        img.style.maxHeight = '140px';
        img.style.objectFit = 'cover';
        previewContainer.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  });
});
