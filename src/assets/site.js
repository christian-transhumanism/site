(function () {
  var MOBILE_NAV_MEDIA = window.matchMedia("(max-width: 991px)");
  var THEME_STORAGE_KEY = "cta-theme";
  var mobileNavToggle = document.querySelector(".site-nav__toggle");
  var mobileNavPanel = document.querySelector("#site-primary-nav");
  var mobileNavBackdrop = document.querySelector("[data-nav-backdrop]");
  var themeToggle = document.querySelector("[data-theme-toggle]");

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

  window.addEventListener("resize", updateFixedNavbarOffset);
  window.addEventListener("orientationchange", updateFixedNavbarOffset);

  if (typeof ResizeObserver !== "undefined") {
    var navbar = document.querySelector(".navbar-fixed-top");
    if (navbar) {
      new ResizeObserver(updateFixedNavbarOffset).observe(navbar);
    }
  }

  applyTheme(getStoredTheme() || document.documentElement.getAttribute("data-theme") || "light", false);
  handleViewportChange();
})();
