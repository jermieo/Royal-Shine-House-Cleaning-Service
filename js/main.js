(function () {
  const header = document.getElementById("header");
  const nav = document.getElementById("siteNav");
  const toggle = document.getElementById("navToggle");
  const backdrop = document.getElementById("navBackdrop");
  const slides = Array.from(document.querySelectorAll(".slide"));
  const dotsWrap = document.getElementById("sliderDots");
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  const year = document.getElementById("year");
  let index = 0;
  let timer;

  if (year) year.textContent = new Date().getFullYear();

  let lastScrollY = window.scrollY;
  let scrollTicking = false;
  const mobileHeaderQuery = window.matchMedia("(max-width: 860px)");

  function updateHeaderOnScroll() {
    if (!header) return;

    const currentScrollY = window.scrollY;
    header.classList.toggle("is-scrolled", currentScrollY > 24);

    if (!mobileHeaderQuery.matches || (nav && nav.classList.contains("is-open"))) {
      header.classList.remove("is-header-hidden");
      lastScrollY = currentScrollY;
      scrollTicking = false;
      return;
    }

    if (currentScrollY <= 12) {
      header.classList.remove("is-header-hidden");
    } else if (currentScrollY > lastScrollY + 6) {
      header.classList.add("is-header-hidden");
    } else if (currentScrollY < lastScrollY - 6) {
      header.classList.remove("is-header-hidden");
    }

    lastScrollY = currentScrollY;
    scrollTicking = false;
  }

  window.addEventListener("scroll", function () {
    if (!scrollTicking) {
      window.requestAnimationFrame(updateHeaderOnScroll);
      scrollTicking = true;
    }
  }, { passive: true });

  if (mobileHeaderQuery.addEventListener) {
    mobileHeaderQuery.addEventListener("change", function () {
      if (!mobileHeaderQuery.matches && header) {
        header.classList.remove("is-header-hidden");
      }
    });
  }

  function setNavOpen(open) {
    if (!nav) return;
    nav.classList.toggle("is-open", open);
    if (toggle) {
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    if (backdrop) backdrop.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    if (!open) {
      document.querySelectorAll(".nav-drop").forEach(function (drop) {
        drop.classList.remove("is-open");
        const trigger = drop.querySelector(".nav-drop-toggle");
        if (trigger) trigger.setAttribute("aria-expanded", "false");
      });
      document.querySelectorAll(".nav-subdrop").forEach(function (sub) {
        sub.classList.remove("is-open");
      });
    }
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNavOpen(!nav.classList.contains("is-open"));
    });
  }

  const drawerClose = document.getElementById("navDrawerClose");
  if (drawerClose) {
    drawerClose.addEventListener("click", function () {
      setNavOpen(false);
    });
  }

  if (backdrop) {
    backdrop.addEventListener("click", function () {
      setNavOpen(false);
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setNavOpen(false);
  });

  const servicesDrop = document.getElementById("servicesDrop");
  const servicesToggle = document.querySelector(".nav-drop-toggle");

  if (nav) {
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function (event) {
        if (link.classList.contains("nav-drop-toggle")) {
          event.preventDefault();
          const drop = link.closest(".nav-drop");
          const open = drop.classList.toggle("is-open");
          link.setAttribute("aria-expanded", open ? "true" : "false");
          return;
        }
        if (link.classList.contains("nav-subdrop-toggle") && window.matchMedia("(max-width: 860px)").matches) {
          event.preventDefault();
          const sub = link.closest(".nav-subdrop");
          const open = sub.classList.toggle("is-open");
          link.setAttribute("aria-expanded", open ? "true" : "false");
          return;
        }
        setNavOpen(false);
      });
    });
  }

  document.addEventListener("click", function (event) {
    if (servicesDrop && !servicesDrop.contains(event.target)) {
      servicesDrop.classList.remove("is-open");
      if (servicesToggle) servicesToggle.setAttribute("aria-expanded", "false");
    }
  });

  if (slides.length && dotsWrap) {
    slides.forEach(function (_, i) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Go to slide " + (i + 1));
      if (i === 0) dot.classList.add("is-active");
      dot.addEventListener("click", function () {
        showSlide(i);
        startSlider();
      });
      dotsWrap.appendChild(dot);
    });

    const dots = Array.from(dotsWrap.children);

    function showSlide(next) {
      slides[index].classList.remove("is-active");
      dots[index].classList.remove("is-active");
      index = (next + slides.length) % slides.length;
      slides[index].classList.add("is-active");
      dots[index].classList.add("is-active");
    }

    function startSlider() {
      clearInterval(timer);
      timer = setInterval(function () {
        showSlide(index + 1);
      }, 5500);
    }

    const prevSlide = document.getElementById("prevSlide");
    const nextSlide = document.getElementById("nextSlide");
    if (prevSlide) {
      prevSlide.addEventListener("click", function () {
        showSlide(index - 1);
        startSlider();
      });
    }
    if (nextSlide) {
      nextSlide.addEventListener("click", function () {
        showSlide(index + 1);
        startSlider();
      });
    }

    startSlider();
  }

  const serviceTrack = document.getElementById("serviceTrack");
  const serviceSlider = document.querySelector(".service-slider");
  const serviceCards = serviceTrack ? Array.from(serviceTrack.children) : [];
  const servicePrev = document.getElementById("servicePrev");
  const serviceNext = document.getElementById("serviceNext");
  const serviceDots = document.getElementById("serviceDots");
  let serviceIndex = 0;

  function serviceVisible() {
    if (window.innerWidth <= 900) return 1;
    return 3;
  }

  function serviceMax() {
    return Math.max(0, serviceCards.length - serviceVisible());
  }

  function goService(next) {
    if (!serviceTrack || !serviceSlider || !serviceCards.length) return;
    const max = serviceMax();
    if (next < 0) serviceIndex = max;
    else if (next > max) serviceIndex = 0;
    else serviceIndex = next;

    serviceSlider.style.setProperty("--visible", String(serviceVisible()));
    void serviceTrack.offsetWidth;
    const gap = parseFloat(getComputedStyle(serviceTrack).gap) || 0;
    const cardWidth = serviceCards[0].getBoundingClientRect().width;
    serviceTrack.style.transform = "translateX(" + (-serviceIndex * (cardWidth + gap)) + "px)";

    const center = serviceIndex + Math.floor((serviceVisible() - 1) / 2);
    serviceCards.forEach(function (card, i) {
      card.classList.toggle("is-active", i === center);
    });

    if (serviceDots) {
      Array.from(serviceDots.children).forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === serviceIndex);
      });
    }
  }

  function renderServiceDots() {
    if (!serviceDots) return;
    serviceDots.innerHTML = "";
    const pages = serviceMax() + 1;
    for (let i = 0; i < pages; i += 1) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Show services " + (i + 1));
      if (i === serviceIndex) dot.classList.add("is-active");
      dot.addEventListener("click", function () {
        goService(i);
      });
      serviceDots.appendChild(dot);
    }
  }

  if (serviceTrack && servicePrev && serviceNext && serviceDots) {
    servicePrev.addEventListener("click", function () {
      goService(serviceIndex - 1);
    });

    serviceNext.addEventListener("click", function () {
      goService(serviceIndex + 1);
    });

    window.addEventListener("resize", function () {
      if (serviceIndex > serviceMax()) serviceIndex = serviceMax();
      renderServiceDots();
      goService(serviceIndex);
    });

    renderServiceDots();
    goService(0);
  }

  document.querySelectorAll(".nav-drop-menu a[data-service]").forEach(function (link) {
    link.addEventListener("click", function () {
      goService(Number(link.getAttribute("data-service")));
    });
  });

  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".site-nav > a, .nav-drop-toggle");
  const currentPage = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();

  function setActiveNav() {
    if (currentPage !== "index.html" && currentPage !== "") {
      navLinks.forEach(function (link) {
        const href = (link.getAttribute("href") || "").toLowerCase();
        link.classList.toggle("active", href.endsWith(currentPage) && !link.classList.contains("nav-drop-toggle"));
      });
      return;
    }
    let current = "home";
    sections.forEach(function (section) {
      if (window.scrollY >= section.offsetTop - 140) current = section.id;
    });
    navLinks.forEach(function (link) {
      const href = link.getAttribute("href");
      const isServices = link.classList.contains("nav-drop-toggle") && current === "services";
      link.classList.toggle("active", href === "#" + current || isServices);
    });
  }

  window.addEventListener("scroll", setActiveNav);
  setActiveNav();

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach(function (el) {
    observer.observe(el);
  });

  function animateCount(el) {
    const target = Number(el.getAttribute("data-count")) || 0;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = String(target);
      return;
    }
    const duration = 1200;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = String(Math.round(target * progress));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const countObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll(".count-up").forEach(animateCount);
        countObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  const statsSection = document.getElementById("project-completed");
  if (statsSection) countObserver.observe(statsSection);

  if (form && note) {
    form.addEventListener("submit", function (event) {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const email = String(data.get("email") || "").trim();
    const service = String(data.get("service") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !phone || !service) {
      note.textContent = "Please fill your name, phone and service.";
      note.className = "form-note error";
      return;
    }

    const body = [
      "Hello Royal Shine,",
      "",
      "I would like to book a cleaning service.",
      "Name: " + name,
      "Phone: " + phone,
      email ? "Email: " + email : "",
      "Service: " + service,
      message ? "Message: " + message : ""
    ].filter(Boolean).join("\n");

    const whatsapp = "https://wa.me/919952630415?text=" + encodeURIComponent(body);
    window.open(whatsapp, "_blank", "noopener");

    const mailto = "mailto:royalshinehomecleaning@gmail.com?subject=" +
      encodeURIComponent("Cleaning enquiry: " + service) +
      "&body=" + encodeURIComponent(body);

    note.innerHTML = 'Enquiry opened in WhatsApp. You can also <a href="' + mailto + '">email us</a>.';
    note.className = "form-note success";
    form.reset();
  });
  }

  const packageTabs = document.querySelectorAll("[data-package-tab]");
  const packagePanels = document.querySelectorAll("[data-package-panel]");
  const packagePricingWraps = document.querySelectorAll("[data-package-pricing]");
  if (packageTabs.length && packagePanels.length) {
    function setPackageTier(tier) {
      packageTabs.forEach(function (item) {
        const active = item.getAttribute("data-package-tab") === tier;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", active ? "true" : "false");
      });
      packagePanels.forEach(function (panel) {
        const active = panel.getAttribute("data-package-panel") === tier;
        panel.classList.toggle("is-active", active);
        panel.hidden = !active;
      });
      packagePricingWraps.forEach(function (wrap) {
        wrap.setAttribute("data-package-pricing", tier);
      });
      document.querySelectorAll(".price-tier-table-wrap").forEach(function (wrap) {
        wrap.setAttribute("data-package-pricing", tier);
      });
      document.querySelectorAll("[data-price-tier]").forEach(function (cell) {
        cell.classList.toggle("is-tier-active", cell.getAttribute("data-price-tier") === tier);
      });
    }

    packageTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        setPackageTier(tab.getAttribute("data-package-tab"));
      });
    });

    const activePackageTab = document.querySelector(".package-tab.is-active");
    setPackageTier(
      (activePackageTab && activePackageTab.getAttribute("data-package-tab")) || "basic"
    );
  }

  // If a service page "View" button sends a tier to pricing.html,
  // pre-select that tier by updating the relevant pricing section only.
  // Example: pricing.html?tier=premium#price-01
  const urlTier = new URLSearchParams(window.location.search).get("tier");
  if (urlTier) {
    const sectionIdFromHash = (window.location.hash || "").replace("#", "");
    const sectionScope = sectionIdFromHash && document.getElementById(sectionIdFromHash)
      ? document.getElementById(sectionIdFromHash)
      : document;

    sectionScope.querySelectorAll(".price-tier-table-wrap").forEach(function (wrap) {
      wrap.setAttribute("data-package-pricing", urlTier);
    });
    sectionScope.querySelectorAll("[data-price-tier]").forEach(function (cell) {
      cell.classList.toggle("is-tier-active", cell.getAttribute("data-price-tier") === urlTier);
    });
  }

})();
