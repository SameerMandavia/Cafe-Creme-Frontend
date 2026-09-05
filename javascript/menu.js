const menuContainer = document.querySelector("#menu-categories");

function renderMenuPage() {
  const groups = getMenuItems().filter((item) => item.isAvailable).reduce((result, item) => {
    result[item.category] ||= [];
    result[item.category].push(item);
    return result;
  }, {});

  menuContainer.innerHTML = Object.entries(groups).map(([category, items]) => `
    <div class="col-lg-6">
      <section class="menu-group">
        <div class="menu-group-heading"><h2>${category}</h2><span>Fresh today</span></div>
        ${items.map((item) => `
          <div class="menu-item">
            <div><h3>${item.name}</h3><p>${item.description}</p></div>
            <strong>${formatCurrency(item.price)}</strong>
          </div>
        `).join("")}
      </section>
    </div>
  `).join("");
}

renderMenuPage();
