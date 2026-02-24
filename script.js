document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".nav-item");
  const pages = document.querySelectorAll(".page");
  const pageTitle = document.getElementById("pageTitle");
  const avatar = document.querySelector(".main-avatar");

  // 可依實際檔名調整此陣列
  const templateImages = [
    "assets/template/template-1.jpg",
    "assets/template/template-2.jpg",
    "assets/template/template-3.jpg",
    "assets/template/template-4.jpg",
    "assets/template/template-5.jpg",
    "assets/template/template-6.jpg",
    "assets/template/template-7.jpg",
  ];

  const photoImgs = document.querySelectorAll(".js-photo");
  const arrows = document.querySelectorAll(".gallery-arrow");

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

  if (avatar) {
    avatar.addEventListener("click", () => {
      const profileNav = document.querySelector('.nav-item[data-page="profile"]');
      if (profileNav) {
        profileNav.click();
      }
    });
  }

  const hasGallery = photoImgs.length > 0 && templateImages.length > 0;

  if (hasGallery) {
    const total = templateImages.length;
    const photoIndexes = Array.from({ length: photoImgs.length }, (_, i) => i % total);

    function updatePhoto(photoIdx) {
      const img = photoImgs[photoIdx];
      if (!img) return;
      const safeIndex =
        ((photoIndexes[photoIdx] % total) + total) % total;
      img.src = templateImages[safeIndex];
    }

    photoImgs.forEach((_, i) => updatePhoto(i));

    arrows.forEach((btn) => {
      btn.addEventListener("click", () => {
        const indexAttr = btn.getAttribute("data-photo-index");
        const photoIdx = indexAttr ? Number(indexAttr) : 0;
        if (Number.isNaN(photoIdx)) return;

        const isNext = btn.classList.contains("gallery-arrow-right");
        const delta = isNext ? 1 : -1;
        photoIndexes[photoIdx] += delta;
        updatePhoto(photoIdx);
      });
    });
  }
});

