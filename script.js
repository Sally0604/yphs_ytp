document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".nav-item");
  const pages = document.querySelectorAll(".page");
  const pageTitle = document.getElementById("pageTitle");
  const avatar = document.querySelector(".main-avatar");
  const panelTitleEl = document.getElementById("panelTitle");
  const dayCard = document.querySelector(".itinerary-card-day");
  const selectedCard = document.querySelector(".itinerary-card-selected");
  const selectedList = document.getElementById("selectedSpots");
  const selectedEmpty = document.querySelector(".selected-empty");

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
  const spotsGallery = document.getElementById("spotsGallery");
  const spotsGalleryWrapper = document.querySelector(".spots-gallery-wrapper");
  const spotsSearchInput = document.querySelector(".spots-search-input");
  const spotsSearchButton = document.querySelector(".spots-search-button");

  const selectedMap = new Map();
  let homePageHeight = 0;

  const titles = {
    home: "主頁",
    spots: "景點、活動",
    final: "最終行程",
    notifications: "通知",
    profile: "個人檔案",
  };

  function syncPagesMinHeightFromHome() {
    const homePage = document.querySelector(".page-home");
    if (!homePage || !pages.length) return;

    const height = homePage.getBoundingClientRect().height;
    if (!height) return;

    homePageHeight = height;

    pages.forEach((page) => {
      page.style.minHeight = `${height}px`;
    });
  }

  window.addEventListener("load", syncPagesMinHeightFromHome);

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

      if (panelTitleEl && dayCard && selectedCard) {
        if (target === "spots") {
          panelTitleEl.textContent = "目前所選行程";
          dayCard.classList.add("is-hidden");
          selectedCard.classList.remove("is-hidden");
        } else {
          panelTitleEl.textContent = "當日行程";
          dayCard.classList.remove("is-hidden");
          selectedCard.classList.add("is-hidden");
        }
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

  function updateSelectedEmptyState() {
    if (!selectedEmpty) return;
    const hasItem = selectedList && selectedList.children.length > 0;
    selectedEmpty.classList.toggle("is-hidden", hasItem);
  }

  function addSelectedSpot(src) {
    if (!selectedList || selectedMap.has(src)) return;

    const li = document.createElement("li");
    li.className = "selected-item";

    const img = document.createElement("img");
    img.className = "selected-thumb";
    img.src = src;
    img.alt = "已選擇景點";

    const info = document.createElement("div");
    info.className = "selected-info";

    const nameEl = document.createElement("div");
    nameEl.className = "selected-name";
    nameEl.textContent = src.split("/").pop() || src;

    info.appendChild(nameEl);
    li.appendChild(img);
    li.appendChild(info);

    selectedList.appendChild(li);
    selectedMap.set(src, li);
    updateSelectedEmptyState();
  }

  function removeSelectedSpot(src) {
    const li = selectedMap.get(src);
    if (!li || !selectedList) return;
    selectedList.removeChild(li);
    selectedMap.delete(src);
    updateSelectedEmptyState();
  }

  if (spotsGallery && templateImages.length > 0) {
    templateImages.forEach((src, index) => {
      const card = document.createElement("div");
      card.className = "spot-card";

      const img = document.createElement("img");
      img.className = "spot-image";
      img.src = src;
      img.alt = `景點圖片 ${index + 1}`;

      const starBtn = document.createElement("button");
      starBtn.type = "button";
      starBtn.className = "spot-star";
      starBtn.setAttribute("aria-label", "加入或移除行程");
      starBtn.innerHTML = `
        <svg viewBox="0 0 24 24" class="spot-star-icon" aria-hidden="true">
          <path d="M12 3.4l2.3 4.7 5.2.8-3.8 3.7.9 5.2L12 15.9 7.4 17.8l.9-5.2-3.8-3.7 5.2-.8L12 3.4z"></path>
        </svg>
      `;

      starBtn.addEventListener("click", () => {
        const isActive = starBtn.classList.toggle("is-active");
        if (isActive) {
          addSelectedSpot(src);
        } else {
          removeSelectedSpot(src);
        }
      });

      card.appendChild(img);
      card.appendChild(starBtn);
      spotsGallery.appendChild(card);
    });

    updateSelectedEmptyState();

    const resizeSpotsWrapper = () => {
      if (!spotsGalleryWrapper) return;
      const firstCard = spotsGallery.querySelector(".spot-card");
      if (!firstCard) return;

      let targetHeight = 0;

      if (homePageHeight) {
        // 以主頁高度為基準，預留標題與搜尋列空間
        targetHeight = Math.max(240, homePageHeight - 160);
      } else {
        const cardHeight = firstCard.getBoundingClientRect().height;
        if (!cardHeight) return;
        targetHeight = cardHeight * 2.4;
      }

      spotsGalleryWrapper.style.maxHeight = `${targetHeight}px`;
    };

    resizeSpotsWrapper();
    window.addEventListener("resize", resizeSpotsWrapper);
  }

  function applySpotsSearch() {
    if (!spotsGallery) return;
    const keyword = (spotsSearchInput?.value || "").trim().toLowerCase();
    const cards = spotsGallery.querySelectorAll(".spot-card");

    cards.forEach((card) => {
      const img = card.querySelector("img");
      if (!img) return;
      const src = img.getAttribute("src") || "";
      const fileName = src.split("/").pop() || src;
      const match =
        !keyword || fileName.toLowerCase().includes(keyword);
      card.style.display = match ? "" : "none";
    });
  }

  if (spotsSearchButton) {
    spotsSearchButton.addEventListener("click", applySpotsSearch);
  }

  if (spotsSearchInput) {
    spotsSearchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        applySpotsSearch();
      }
    });
  }

  // if (spotsGalleryWrapper) {
  //   spotsGalleryWrapper.addEventListener(
  //     "wheel",
  //     (event) => {
  //       const maxScroll =
  //         spotsGalleryWrapper.scrollHeight - spotsGalleryWrapper.clientHeight;
  //       if (maxScroll <= 0) return;

  //       spotsGalleryWrapper.scrollTop += event.deltaY;
  //       event.preventDefault();
  //     },
  //     { passive: false }
  //   );
  // }
});

