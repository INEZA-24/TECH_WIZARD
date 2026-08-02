(function () {
  const SUPABASE_URL = "https://znqjiafbqsrugzvjpsfy.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpucWppYWZicXNydWd6dmpwc2Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2NzMxMTYsImV4cCI6MjA5OTI0OTExNn0.GHEFNhbrvE-IJpUW709irr36xdBHcCqCgNbU4PL0e3k";

  function normalizeProject(item) {
    return {
      ...item,
      tags: Array.isArray(item.tags) ? item.tags : [],
      github: item.github || "",
      demo: item.demo || "",
      icon: item.icon || "fa-code",
      published: item.published !== false,
      sortOrder: item.sortOrder ?? item.sort_order ?? 0
    };
  }

  function normalizeCertification(item) {
    const certificateFile =
      item.certificateFile ||
      item.certificate_file ||
      item.image ||
      "";

    return {
      ...item,
      issuedAt: item.issuedAt || item.issued_at || "",
      issuedAtLabel:
        item.issuedAtLabel ||
        item.issued_at_label ||
        "",
      skills: Array.isArray(item.skills) ? item.skills : [],
      certificateFile,
      image: resolveCertificateImage(certificateFile),
      icon: item.icon || "fa-certificate",
      published: item.published !== false,
      sortOrder: item.sortOrder ?? item.sort_order ?? 0
    };
  }

  function resolveCertificateImage(value) {
    if (!value) return "";

    if (
      /^https?:\/\//i.test(value) ||
      value.startsWith("/") ||
      value.startsWith("images/") ||
      value.startsWith("portfolio-admin-starter/")
    ) {
      return value;
    }

    const basePath =
      window.CERTIFICATE_ASSET_BASE_URL ||
      "portfolio-admin-starter/public/certificates";

    const filename = value.replace(/^certificates\//, "");

    return (
      basePath.replace(/\/$/, "") +
      "/" +
      encodeURIComponent(filename)
    );
  }

  async function fetchSupabaseTable(table) {
    const endpoint =
      SUPABASE_URL +
      "/rest/v1/" +
      table +
      "?select=*&published=eq.true&order=sort_order.asc,created_at.desc";

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: "Bearer " + SUPABASE_ANON_KEY
      },
      cache: "no-store"
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(
        "Supabase request failed for " +
        table +
        ": " +
        response.status +
        " " +
        message
      );
    }

    return response.json();
  }

  async function fetchJson(path) {
    const response = await fetch(path, { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Failed to load " + path);
    }

    return response.json();
  }

  async function loadProjects() {
    try {
      const rows = await fetchSupabaseTable("projects");
      return rows.map(normalizeProject);
    } catch (error) {
      console.warn(
        "Supabase projects unavailable. Using local JSON fallback.",
        error
      );

      const data = await fetchJson("data/projects.json");

      return (data.projects || [])
        .filter(item => item.published !== false)
        .map(normalizeProject);
    }
  }

  async function loadCertifications() {
    try {
      const rows = await fetchSupabaseTable("certifications");
      return rows.map(normalizeCertification);
    } catch (error) {
      console.warn(
        "Supabase certifications unavailable. Using local JSON fallback.",
        error
      );

      const data = await fetchJson("data/certifications.json");

      return (data.certifications || [])
        .filter(item => item.published !== false)
        .map(normalizeCertification);
    }
  }

  window.PortfolioContentStore = {
    loadProjects,
    loadCertifications
  };
})();
