import PostTemplate from "./components/PostTemplate";

document.addEventListener("DOMContentLoaded", () => {
  window.CMS.registerPreviewTemplate("post", PostTemplate);
  window.CMS.registerPreviewTemplate("page", PostTemplate);
  window.CMS.registerPreviewTemplate("main", PostTemplate);
  window.CMS.registerPreviewTemplate("attendance", PostTemplate);
  window.CMS.registerPreviewTemplate("before-you-begin", PostTemplate);
  window.CMS.registerPreviewTemplate("on-assignment", PostTemplate);
  window.CMS.registerPreviewTemplate("legal-research", PostTemplate);
  window.CMS.registerPreviewTemplate("going-public", PostTemplate);
});
