(function () {
  function selectTarget(trigger) {
    var selector = trigger.getAttribute("data-target") || trigger.getAttribute("href");
    if (!selector || selector === "#") {
      return null;
    }
    try {
      return document.querySelector(selector);
    } catch (error) {
      return null;
    }
  }

  function setExpanded(toggle, expanded) {
    toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
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

  document.addEventListener("click", function (event) {
    var dropdownToggle = event.target.closest(".dropdown-toggle");
    if (dropdownToggle) {
      var dropdown = dropdownToggle.closest(".dropdown");
      if (!dropdown) {
        return;
      }
      event.preventDefault();
      var isOpen = dropdown.classList.contains("open");
      closeAllDropdowns(dropdown);
      dropdown.classList.toggle("open", !isOpen);
      setExpanded(dropdownToggle, !isOpen);
      return;
    }

    var collapseToggle = event.target.closest('[data-toggle="collapse"]');
    if (collapseToggle) {
      var target = selectTarget(collapseToggle);
      if (!target) {
        return;
      }
      event.preventDefault();
      var nextState = !target.classList.contains("in");
      target.classList.toggle("in", nextState);
      setExpanded(collapseToggle, nextState);
      return;
    }

    if (!event.target.closest(".dropdown")) {
      closeAllDropdowns();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeAllDropdowns();
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
  });
})();
