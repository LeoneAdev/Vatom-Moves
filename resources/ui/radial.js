/* radial.js */

// Define categories and menu items in the specified order.
const categories = [
    {
      name: "Basic",
      items: [
        { key: "wave", label: "Wave" },
        { key: "cheer", label: "Cheer" },
        { key: "thumbsdown", label: "Thumbs Down" },
        { key: "followme", label: "Follow Me" },
        { key: "shrug", label: "Shrug" },
        { key: "overhere", label: "Over Here" },
        { key: "thumbsup", label: "Thumbs Up" },
        { key: "clapping", label: "Clap" }
      ]
    },
    {
      name: "Gestures",
      items: [
        { key: "pointstraight", label: "Point" },
        { key: "pointright", label: "Point Right" },
        { key: "backflip", label: "Flip" },
        { key: "swimming", label: "Swim" },
        { key: "rockon", label: "Rock On" },
        { key: "guitar", label: "Jam Out" },
        { key: "doublethumbs", label: "Two Thumbs Up" },
        { key: "pointleft", label: "Point Left" }
      ]
    },
    {
      name: "Dance",
      items: [
        { key: "hiphop", label: "Hip Hop 01" },
        { key: "hiphop02", label: "Hip Hop 02" },
        { key: "chickendance", label: "Chicken Dance" },
        { key: "wavedance", label: "Wave Dance" },
        { key: "robotdance", label: "Robot" },
        { key: "sambadance", label: "Samba" },
        { key: "cabbagedance", label: "Cabbage Patch" }
      ]
    }
  ];
  
  let currentCategoryIndex = 0;
  const menuList = document.getElementById('menuList');
  const tabs = document.querySelectorAll('.tab');
  const containerSize = 400;
  const centerX = containerSize / 2;
  const centerY = containerSize / 2;
  const radius = 140; // Adjust as needed
  
  function renderMenu() {
    menuList.innerHTML = '';
    const category = categories[currentCategoryIndex];
    const items = category.items;
    const count = items.length;
    for (let i = 0; i < count; i++) {
      const item = items[i];
      // Offset angle so that first item is at 12 o'clock.
      const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      const li = document.createElement('li');
      li.className = 'radial-menu__menu-item';
      li.textContent = item.label;
      li.style.left = x + 'px';
      li.style.top = y + 'px';
      li.setAttribute('data-key', item.key);
      li.addEventListener('click', () => {
        li.style.background = '#fff';
        li.style.color = '#666';
        setTimeout(() => {
          window.parent.postMessage({ action: 'radialSelect', option: item.key }, '*');
        }, 100);
      });
      menuList.appendChild(li);
    }
  }
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      currentCategoryIndex = parseInt(tab.getAttribute('data-category'));
      updateTabs();
      renderMenu();
    });
  });
  
  function updateTabs() {
    tabs.forEach(tab => {
      if (parseInt(tab.getAttribute('data-category')) === currentCategoryIndex) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  }
  
  // Initial render.
  updateTabs();
  renderMenu();
  