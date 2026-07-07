//
// For guidance on how to add JavaScript see:
// https://prototype-kit.service.gov.uk/docs/adding-css-javascript-and-images
//

window.GOVUKPrototypeKit.documentReady(() => {
  // Add JavaScript here


  const toggle = document.getElementById('toggle-filters');
  const content = document.getElementById('filters-content');

  toggle.addEventListener('click', function (e) {
    e.preventDefault();

    const isHidden = content.style.display === 'none';

    if (isHidden) {
      content.style.display = '';
      toggle.textContent = 'Hide filters';
      toggle.setAttribute('aria-expanded', 'true');
    } else {
      content.style.display = 'none';
      toggle.textContent = 'Show filters';
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

})

