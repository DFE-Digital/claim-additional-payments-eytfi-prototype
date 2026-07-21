//
// For guidance on how to add JavaScript see:
// https://prototype-kit.service.gov.uk/docs/adding-css-javascript-and-images
//

window.GOVUKPrototypeKit.documentReady(() => {
  // Add JavaScript here


  const toggle = document.getElementById('toggle-filters');
  const content = document.getElementById('filters-content');

  if (toggle && content) {
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
}

  const selectEl = document.querySelector('.schoolSelecter');

  if (selectEl) {

    accessibleAutocomplete.enhanceSelectElement({
      autoselect: true,
      confirmOnBlur: true,
      defaultValue: "",
      minLength: 3,
      selectElement: selectEl
    });

    const queryStringParameters = window.location.search;
    const previouslySubmitted = queryStringParameters.length > 0;

    if (previouslySubmitted) {
      const submittedEl = document.querySelector('.submitted');

      if (submittedEl) {
        submittedEl.classList.remove('submitted--hidden');

        const params = new URLSearchParams(window.location.search);

        const hideSchool = document.querySelector('.submitted__hide-school');
        if (hideSchool) {
          hideSchool.textContent = params.get('hide-school');
        }
      }
    }

  }

})

