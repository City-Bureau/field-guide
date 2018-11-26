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

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM ready");
  expandCollapse();
});
