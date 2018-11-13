import PostTemplate from "./components/PostTemplate";

document.addEventListener("DOMContentLoaded", () => {
  console.log("CMS");
  window.CMS.registerPreviewTemplate("post", PostTemplate);
  window.CMS.registerPreviewTemplate("page", PostTemplate);
  window.CMS.registerPreviewTemplate("main", PostTemplate);
});
