const withFadeIn = document.querySelectorAll('[data-fadein]');

withFadeIn.forEach((node) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        node.classList.remove('hidden');
        node.setAttribute('data-shown', 'true')
      } else if (!node.hasAttribute('data-shown')) {
        node.classList.add('hidden');
      }
    })
  })

  observer.observe(node);
})
