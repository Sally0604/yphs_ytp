document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".nav-item");
  const pages = document.querySelectorAll(".page");
  const pageTitle = document.getElementById("pageTitle");

  const titles = {
    home: "主頁",
    spots: "景點、活動",
    final: "最終行程",
    notifications: "通知",
    profile: "個人檔案",
  };

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      const target = item.getAttribute("data-page");
      if (!target) return;

      navItems.forEach((btn) => btn.classList.remove("active"));
      item.classList.add("active");

      pages.forEach((page) => {
        const id = page.getAttribute("data-page-id");
        page.classList.toggle("active-page", id === target);
      });

      if (titles[target] && pageTitle) {
        pageTitle.textContent = titles[target];
      }
    });
  });
});

