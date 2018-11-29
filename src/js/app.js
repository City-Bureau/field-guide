function expandCollapse() {
  document.querySelectorAll(".toggle").forEach(function(el) {
    el.addEventListener("click", function() {
      if (el.classList.contains("active")) {
        el.classList.remove("active");
      } else {
        document.querySelectorAll(".active").forEach(function(el) {
          el.classList.remove("active");
        });
        el.classList.add("active");
      }
    });
  });
}

function activateCheckboxes() {
  document.querySelectorAll("input[type='checkbox'][disabled]").forEach(function(el) {
    el.disabled = false;
  });
}

document.addEventListener("DOMContentLoaded", function() {
  expandCollapse();
  activateCheckboxes();

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
      navigator.serviceWorker.register("/service-worker.js");
    });
  }
});
