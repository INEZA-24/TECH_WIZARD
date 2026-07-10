(function () {
  function normalizeProject(item) {
    return {
      ...item,
      tags: Array.isArray(item.tags) ? item.tags : [],
      github: item.github || "",
      demo: item.demo || "",
      icon: item.icon || "fa-code",
      published: item.published !== false
    };
  }

  function normalizeCertification(item) {
    const certificateFile = item.certificateFile || item.certificate_file || item.image || "";
    return {
      ...item,
      issuedAt: item.issuedAt || item.issued_at || "",
      skills: Array.isArray(item.skills) ? item.skills : [],
      certificateFile,
      image: resolveCertificateImage(certificateFile),
      icon: item.icon || "fa-certificate"
    };
  }

  function resolveCertificateImage(value) {
    if (!value) return "";
    if (/^https?:\/\//i.test(value) || value.startsWith("/") || value.startsWith("images/")) {
      return value;
    }

    const basePath = window.CERTIFICATE_ASSET_BASE_URL || "portfolio-admin-starter/public/certificates";
    return basePath.replace(/\/$/, "") + "/" + encodeURIComponent(value.replace(/^certificates\//, ""));
  }

  async function fetchJson(path) {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to load " + path);
    }

    return response.json();
  }

  async function loadProjects() {
    const data = await fetchJson("data/projects.json");
    return (data.projects || [])
      .filter((item) => item.published !== false)
      .map(normalizeProject);
  }

  async function loadCertifications() {
    const data = await fetchJson("data/certifications.json");
    return (data.certifications || [])
      .filter((item) => item.published !== false)
      .map(normalizeCertification);
  }

  window.PortfolioContentStore = {
    loadProjects,
    loadCertifications
  };
})();
