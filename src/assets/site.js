(function () {
  var MOBILE_NAV_MEDIA = window.matchMedia("(max-width: 991px)");
  var THEME_STORAGE_KEY = "cta-theme";
  var SAVED_PAGES_STORAGE_KEY = "cta-saved-pages";
  var RECENT_PAGES_STORAGE_KEY = "cta-recent-pages";
  var MAX_SAVED_PAGES = 40;
  var MAX_RECENT_PAGES = 8;
  var mobileNavToggle = document.querySelector(".site-nav__toggle");
  var mobileNavPanel = document.querySelector("#site-primary-nav");
  var mobileNavBackdrop = document.querySelector("[data-nav-backdrop]");
  var themeToggle = document.querySelector("[data-theme-toggle]");
  var savedPagesLink = document.querySelector("[data-saved-pages-link]");
  var bootScript = document.currentScript || document.querySelector('script[src="/assets/site.js"]');
  var assistantScriptSrc = bootScript && bootScript.dataset ? bootScript.dataset.assistantSrc : "";
  var saveButton = null;
  var currentPageMeta = null;
  var resizeFrame = 0;
  var assistantLoadStarted = false;

  function getStoredTheme() {
    try {
      return window.localStorage.getItem(THEME_STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function persistTheme(theme) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {}
  }

  function readStoredList(key) {
    try {
      var value = window.localStorage.getItem(key);
      if (!value) {
        return [];
      }

      var parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function writeStoredList(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {}
  }

  function sanitizeText(value) {
    return (value || "").replace(/\s+/g, " ").trim();
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getCanonicalPath() {
    var canonicalLink = document.querySelector('link[rel="canonical"]');
    var rawValue = canonicalLink ? canonicalLink.getAttribute("href") : window.location.pathname;

    try {
      return new URL(rawValue, window.location.origin).pathname;
    } catch (error) {
      return window.location.pathname;
    }
  }

  function getPageHeading() {
    return document.querySelector("main h1") || document.querySelector(".page-header") || document.querySelector("h1");
  }

  function classifyPage(pathname) {
    if (!pathname || pathname === "/") {
      return "home";
    }
    if (pathname === "/saved/") {
      return "listing";
    }
    if (pathname.indexOf("/wiki/") === 0) {
      return "wiki";
    }
    if (pathname.indexOf("/blog/") === 0) {
      return pathname === "/blog/" || pathname === "/blog/community/" ? "listing" : "blog";
    }
    if (pathname.indexOf("/podcast/") === 0) {
      return pathname === "/podcast/" ? "listing" : "podcast";
    }
    if (pathname.indexOf("/books/") === 0) {
      return pathname === "/books/" ? "listing" : "book";
    }
    if (pathname.indexOf("/conference/") === 0) {
      return "conference";
    }
    if (
      pathname === "/videos/" ||
      pathname === "/press/" ||
      pathname === "/quotes/" ||
      pathname === "/beliefs/" ||
      pathname === "/beliefs/compare/" ||
      pathname === "/explore/" ||
      pathname === "/connect/" ||
      pathname === "/join/" ||
      pathname === "/board/" ||
      pathname === "/wiki/"
    ) {
      return "listing";
    }

    return "page";
  }

  function shouldEnablePersonalization(pageMeta) {
    if (!pageMeta || !pageMeta.title || !pageMeta.url) {
      return false;
    }

    return pageMeta.type !== "home" && pageMeta.type !== "listing";
  }

  function getCurrentPageMeta() {
    var heading = getPageHeading();
    var title = sanitizeText(heading ? heading.textContent : document.title.replace(/\s+\|.+$/, ""));
    var url = getCanonicalPath();
    var type = classifyPage(url);

    if (!title) {
      return null;
    }

    return {
      title: title,
      url: url,
      type: type
    };
  }

  function formatTypeLabel(type) {
    switch (type) {
      case "wiki":
        return "Wiki";
      case "blog":
        return "Blog";
      case "podcast":
        return "Podcast";
      case "book":
        return "Book";
      case "conference":
        return "Conference";
      default:
        return "Page";
    }
  }

  function getSavedPages() {
    return readStoredList(SAVED_PAGES_STORAGE_KEY);
  }

  function persistSavedPages(items) {
    writeStoredList(SAVED_PAGES_STORAGE_KEY, items.slice(0, MAX_SAVED_PAGES));
  }

  function getRecentPages() {
    return readStoredList(RECENT_PAGES_STORAGE_KEY);
  }

  function persistRecentPages(items) {
    writeStoredList(RECENT_PAGES_STORAGE_KEY, items.slice(0, MAX_RECENT_PAGES));
  }

  function findPageIndex(items, url) {
    return items.findIndex(function (item) {
      return item && item.url === url;
    });
  }

  function isPageSaved(url) {
    return findPageIndex(getSavedPages(), url) !== -1;
  }

  function createItemMarkup(item, emptyLabel) {
    if (!item) {
      return '<li class="personalization-panel__empty">' + emptyLabel + "</li>";
    }

    var safeType = formatTypeLabel(item.type);
    return (
      '<li class="personalization-panel__item">' +
        '<a href="' + escapeHtml(item.url) + '">' + escapeHtml(item.title) + "</a>" +
        '<span class="personalization-panel__meta">' + escapeHtml(safeType) + "</span>" +
      "</li>"
    );
  }

  function syncSavedPagesLink() {
    if (!savedPagesLink) {
      return;
    }

    var savedCount = getSavedPages().length;
    var countNode = savedPagesLink.querySelector("[data-saved-pages-count]");
    if (countNode) {
      countNode.textContent = String(savedCount);
      countNode.hidden = savedCount === 0;
    }
  }

  function syncSaveButtonState() {
    if (!saveButton || !currentPageMeta) {
      return;
    }

    var saved = isPageSaved(currentPageMeta.url);
    saveButton.classList.toggle("is-saved", saved);
    saveButton.setAttribute("aria-pressed", saved ? "true" : "false");
    saveButton.textContent = saved ? "Saved" : "Save page";
  }

  function toggleSavedPage(pageMeta) {
    var savedPages = getSavedPages();
    var existingIndex = findPageIndex(savedPages, pageMeta.url);

    if (existingIndex !== -1) {
      savedPages.splice(existingIndex, 1);
    } else {
      savedPages.unshift({
        title: pageMeta.title,
        url: pageMeta.url,
        type: pageMeta.type,
        savedAt: new Date().toISOString()
      });
    }

    persistSavedPages(savedPages);
    syncSaveButtonState();
    syncSavedPagesLink();
    renderSavedOverviewPage();
  }

  function clearSavedPages() {
    persistSavedPages([]);
    persistRecentPages([]);
    syncSaveButtonState();
    syncSavedPagesLink();
    renderSavedOverviewPage();
  }

  function recordRecentPage(pageMeta) {
    var recentPages = getRecentPages();
    var existingIndex = findPageIndex(recentPages, pageMeta.url);

    if (existingIndex !== -1) {
      recentPages.splice(existingIndex, 1);
    }

    recentPages.unshift({
      title: pageMeta.title,
      url: pageMeta.url,
      type: pageMeta.type,
      viewedAt: new Date().toISOString()
    });

    persistRecentPages(recentPages);
  }

  function renderSavedOverviewPage() {
    var overview = document.querySelector("[data-saved-overview]");
    if (!overview) {
      return;
    }

    var savedPages = getSavedPages();
    var recentPages = getRecentPages();
    var savedMarkup = savedPages.length
      ? savedPages.map(function (item) { return createItemMarkup(item); }).join("")
      : createItemMarkup(null, "No saved pages yet. Save any article, podcast, or wiki page to keep it here.");
    var recentMarkup = recentPages.length
      ? recentPages.map(function (item) { return createItemMarkup(item); }).join("")
      : createItemMarkup(null, "No recent pages yet. Visit a page and it will appear here.");

    overview.querySelector("[data-saved-overview-count]").textContent = String(savedPages.length);
    overview.querySelector("[data-saved-overview-saved]").innerHTML = savedMarkup;
    overview.querySelector("[data-saved-overview-recent]").innerHTML = recentMarkup;

    var clearButton = overview.querySelector("[data-clear-saved-pages]");
    if (clearButton) {
      clearButton.disabled = savedPages.length === 0 && recentPages.length === 0;
    }
  }

  function ensureSaveButton(pageMeta) {
    var heading = getPageHeading();
    if (!heading || heading.querySelector("[data-save-page-button]")) {
      return;
    }

    var actions = document.createElement("span");
    actions.className = "page-actions";

    saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.className = "page-save-button";
    saveButton.setAttribute("data-save-page-button", "true");
    saveButton.addEventListener("click", function () {
      toggleSavedPage(pageMeta);
    });

    actions.appendChild(saveButton);
    heading.appendChild(document.createTextNode(" "));
    heading.appendChild(actions);
    syncSaveButtonState();
  }

  function updateThemeMeta(theme) {
    var themeColor = theme === "dark" ? "#070b13" : "#f5f7fb";
    var metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute("content", themeColor);
    }
    var metaTile = document.querySelector('meta[name="msapplication-TileColor"]');
    if (metaTile) {
      metaTile.setAttribute("content", themeColor);
    }
  }

  function applyTheme(theme, persist) {
    var nextTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", nextTheme);
    updateThemeMeta(nextTheme);

    if (themeToggle) {
      var isDark = nextTheme === "dark";
      themeToggle.setAttribute("aria-pressed", isDark ? "true" : "false");
      themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
      themeToggle.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
    }

    if (persist !== false) {
      persistTheme(nextTheme);
    }
  }

  function selectTarget(trigger, attributeName) {
    var selector = trigger.getAttribute(attributeName || "data-target") || trigger.getAttribute("href");
    if (!selector || selector === "#") {
      return null;
    }
    try {
      return document.querySelector(selector);
    } catch (error) {
      return null;
    }
  }

  function isMobileNavViewport() {
    return MOBILE_NAV_MEDIA.matches;
  }

  function setExpanded(toggle, expanded) {
    toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
  }

  function setHidden(target, hidden) {
    target.setAttribute("aria-hidden", hidden ? "true" : "false");
  }

  function updateFixedNavbarOffset() {
    var navbar = document.querySelector(".navbar-fixed-top");
    if (!navbar) {
      document.documentElement.style.removeProperty("--site-nav-offset");
      return;
    }

    var offsetSource = navbar;
    if (isMobileNavViewport()) {
      var mobileBar = navbar.querySelector(".site-nav__bar") || navbar.querySelector(".navbar-header");
      if (mobileBar) {
        offsetSource = mobileBar;
      }
    }

    document.documentElement.style.setProperty(
      "--site-nav-offset",
      Math.ceil(offsetSource.getBoundingClientRect().height) + "px"
    );
  }

  function scheduleNavbarOffsetUpdate() {
    if (resizeFrame) {
      window.cancelAnimationFrame(resizeFrame);
    }
    resizeFrame = window.requestAnimationFrame(function () {
      resizeFrame = 0;
      updateFixedNavbarOffset();
    });
  }

  function loadExternalScript(src, onDone) {
    if (!src) {
      if (typeof onDone === "function") {
        onDone(false);
      }
      return;
    }

    var existing = document.querySelector('script[data-external-src="' + src + '"]');
    if (existing) {
      if (existing.dataset.loaded === "true") {
        if (typeof onDone === "function") {
          onDone(true);
        }
        return;
      }

      if (typeof onDone === "function") {
        existing.addEventListener("load", function () { onDone(true); }, { once: true });
        existing.addEventListener("error", function () { onDone(false); }, { once: true });
      }
      return;
    }

    var script = document.createElement("script");
    script.async = true;
    script.src = src;
    script.dataset.externalSrc = src;
    script.addEventListener("load", function () {
      script.dataset.loaded = "true";
      if (typeof onDone === "function") {
        onDone(true);
      }
    }, { once: true });
    script.addEventListener("error", function () {
      script.dataset.loaded = "false";
      if (typeof onDone === "function") {
        onDone(false);
      }
    }, { once: true });
    document.body.appendChild(script);
  }

  function bootAssistantWidget() {
    if (assistantLoadStarted || !assistantScriptSrc) {
      return;
    }

    assistantLoadStarted = true;
    loadExternalScript(assistantScriptSrc, function () {});
  }

  function scheduleAssistantBoot() {
    if (!assistantScriptSrc) {
      return;
    }

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(bootAssistantWidget, { timeout: 2500 });
    } else {
      window.setTimeout(bootAssistantWidget, 1500);
    }
  }

  function setMobileNavOpen(open) {
    if (!mobileNavToggle || !mobileNavPanel || !mobileNavBackdrop) {
      return;
    }

    mobileNavPanel.classList.toggle("in", open);
    mobileNavPanel.classList.toggle("site-nav__panel--open", open);
    mobileNavToggle.classList.toggle("is-open", open);
    document.documentElement.classList.toggle("mobile-nav-open", open);
    document.body.classList.toggle("mobile-nav-open", open);
    mobileNavBackdrop.hidden = !open;
    setExpanded(mobileNavToggle, open);
    setHidden(mobileNavPanel, !open);
    setHidden(mobileNavBackdrop, !open);
    updateFixedNavbarOffset();
  }

  function closeMobileNav() {
    setMobileNavOpen(false);
    closeAllDropdowns();
  }

  function closeDropdown(dropdown) {
    if (!dropdown) {
      return;
    }

    dropdown.classList.remove("open");
    var toggle = dropdown.querySelector(".dropdown-toggle");
    if (toggle) {
      setExpanded(toggle, false);
    }
  }

  function closeAllDropdowns(except) {
    document.querySelectorAll(".dropdown.open").forEach(function (dropdown) {
      if (dropdown !== except) {
        closeDropdown(dropdown);
      }
    });
  }

  function toggleDropdown(toggle) {
    var dropdown = toggle.closest(".dropdown");
    if (!dropdown) {
      return;
    }

    var isOpen = dropdown.classList.contains("open");
    closeAllDropdowns(dropdown);
    dropdown.classList.toggle("open", !isOpen);
    setExpanded(toggle, !isOpen);
  }

  function setDisclosureOpen(toggle, panel, open) {
    toggle.classList.toggle("is-open", open);
    panel.classList.toggle("is-open", open);
    setExpanded(toggle, open);
    setHidden(panel, !open);
  }

  function syncDisclosure(toggle) {
    var panel = selectTarget(toggle, "data-disclosure-target");
    if (!panel) {
      return;
    }

    if (window.matchMedia("(min-width: 992px)").matches) {
      setDisclosureOpen(toggle, panel, true);
      return;
    }

    var expanded = toggle.getAttribute("aria-expanded") === "true";
    setDisclosureOpen(toggle, panel, expanded);
  }

  document.addEventListener("click", function (event) {
    var disclosureToggle = event.target.closest("[data-disclosure-toggle]");
    if (disclosureToggle) {
      var disclosurePanel = selectTarget(disclosureToggle, "data-disclosure-target");
      if (!disclosurePanel) {
        return;
      }

      event.preventDefault();
      var nextDisclosureState = disclosureToggle.getAttribute("aria-expanded") !== "true";
      setDisclosureOpen(disclosureToggle, disclosurePanel, nextDisclosureState);
      return;
    }

    var themeButton = event.target.closest("[data-theme-toggle]");
    if (themeButton) {
      event.preventDefault();
      applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
      return;
    }

    var dropdownToggle = event.target.closest(".dropdown-toggle");
    if (dropdownToggle) {
      var isNavDropdown = mobileNavPanel && mobileNavPanel.contains(dropdownToggle);
      if (isNavDropdown || dropdownToggle.closest(".dropdown")) {
        event.preventDefault();
        toggleDropdown(dropdownToggle);
      }
      return;
    }

    var collapseToggle = event.target.closest('[data-toggle="collapse"]');
    if (collapseToggle) {
      var target = selectTarget(collapseToggle);
      if (!target) {
        return;
      }

      event.preventDefault();
      if (collapseToggle === mobileNavToggle && isMobileNavViewport()) {
        setMobileNavOpen(!target.classList.contains("in"));
        return;
      }

      var nextState = !target.classList.contains("in");
      target.classList.toggle("in", nextState);
      setExpanded(collapseToggle, nextState);
      setHidden(target, !nextState);
      updateFixedNavbarOffset();
      return;
    }

    if (event.target.closest("[data-nav-backdrop]")) {
      closeMobileNav();
      return;
    }

    if (
      isMobileNavViewport() &&
      mobileNavPanel &&
      mobileNavPanel.classList.contains("in") &&
      !event.target.closest(".site-nav__panel") &&
      !event.target.closest(".site-nav__toggle")
    ) {
      closeMobileNav();
    }

    if (event.target.closest(".site-nav__panel a") && isMobileNavViewport()) {
      closeMobileNav();
    }

    if (!event.target.closest(".dropdown")) {
      closeAllDropdowns();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeAllDropdowns();
      closeMobileNav();
    }
  });

  document.querySelectorAll(".dropdown-toggle").forEach(function (toggle) {
    if (!toggle.hasAttribute("aria-expanded")) {
      setExpanded(toggle, false);
    }
  });

  document.querySelectorAll('[data-toggle="collapse"]').forEach(function (toggle) {
    var target = selectTarget(toggle);
    if (!target) {
      return;
    }

    setExpanded(toggle, target.classList.contains("in"));
    setHidden(target, !target.classList.contains("in"));
  });

  document.querySelectorAll("[data-disclosure-toggle]").forEach(function (toggle) {
    if (!toggle.hasAttribute("aria-expanded")) {
      setExpanded(toggle, false);
    }
    syncDisclosure(toggle);
  });

  function handleViewportChange() {
    if (!isMobileNavViewport()) {
      if (mobileNavBackdrop) {
        mobileNavBackdrop.hidden = true;
        setHidden(mobileNavBackdrop, true);
      }
      if (mobileNavPanel) {
        mobileNavPanel.classList.remove("site-nav__panel--open");
        mobileNavPanel.classList.add("in");
        setHidden(mobileNavPanel, false);
      }
      if (mobileNavToggle) {
        mobileNavToggle.classList.remove("is-open");
        setExpanded(mobileNavToggle, false);
      }
      document.documentElement.classList.remove("mobile-nav-open");
      document.body.classList.remove("mobile-nav-open");
      closeAllDropdowns();
    } else if (mobileNavPanel && mobileNavToggle && !mobileNavToggle.classList.contains("is-open")) {
      mobileNavPanel.classList.remove("in");
      setHidden(mobileNavPanel, true);
    }

    document.querySelectorAll("[data-disclosure-toggle]").forEach(syncDisclosure);
    updateFixedNavbarOffset();
  }

  if (typeof MOBILE_NAV_MEDIA.addEventListener === "function") {
    MOBILE_NAV_MEDIA.addEventListener("change", handleViewportChange);
  } else if (typeof MOBILE_NAV_MEDIA.addListener === "function") {
    MOBILE_NAV_MEDIA.addListener(handleViewportChange);
  }

  window.addEventListener("resize", scheduleNavbarOffsetUpdate, { passive: true });
  window.addEventListener("orientationchange", scheduleNavbarOffsetUpdate, { passive: true });

  if (typeof ResizeObserver !== "undefined") {
    var navbar = document.querySelector(".navbar-fixed-top");
    if (navbar) {
      new ResizeObserver(scheduleNavbarOffsetUpdate).observe(navbar);
    }
  }

  ["pointerdown", "focusin", "keydown", "touchstart"].forEach(function (eventName) {
    window.addEventListener(eventName, bootAssistantWidget, { once: true, passive: true });
  });

  currentPageMeta = getCurrentPageMeta();
  syncSavedPagesLink();
  renderSavedOverviewPage();
  if (shouldEnablePersonalization(currentPageMeta)) {
    ensureSaveButton(currentPageMeta);
    recordRecentPage(currentPageMeta);
    renderSavedOverviewPage();
  }

  document.addEventListener("click", function (event) {
    var clearSavedButton = event.target.closest("[data-clear-saved-pages]");
    if (clearSavedButton) {
      event.preventDefault();
      clearSavedPages();
    }
  });

  applyTheme(getStoredTheme() || document.documentElement.getAttribute("data-theme") || "light", false);
  handleViewportChange();
  scheduleAssistantBoot();
})();
