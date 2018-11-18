function expandCollapse() {
  document.querySelectorAll(".toggle").forEach((el) => {
    el.addEventListener("click", () => el.classList.toggle("active"));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM ready");
  expandCollapse();
});
