function expandCollapse() {
  document.querySelectorAll(".toggle").forEach((el) => {
    el.addEventListener("click", () => {
      if (el.classList.contains("active")) {
        el.classList.remove("active");
      } else {
        document.querySelectorAll(".active").forEach((el) => el.classList.remove("active"));
        el.classList.add("active");
      }
    });
  });
}

function activateCheckboxes() {
  document.querySelectorAll('input[type="checkbox"][disabled]').forEach((el) => {
    el.disabled = false;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  expandCollapse();
  activateCheckboxes();
});
