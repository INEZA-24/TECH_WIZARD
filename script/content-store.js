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
    return {
      ...item,
      issuedAt: item.issuedAt || item.issued_at || "",
      skills: Array.isArray(item.skills) ? item.skills : [],
      icon: item.icon || "fa-certificate"
    };
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
    return (data.certifications || []).map(normalizeCertification);
  }

  window.PortfolioContentStore = {
    loadProjects,
    loadCertifications
  };
})();
