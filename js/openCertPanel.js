window.addEventListener("partialsLoaded", function () {
  // ========== CERTIFICATE DATA ==========
  const certs = {
    "azure-fundamentals": {
      name: "Microsoft Certified: Azure Fundamentals",
      issuer: "Dynamic DNA",
      status: "completed",
      date: "Aug 2024",
      description:
        "Validates foundational knowledge of cloud concepts and Azure services.",
      img: "/images/doc/azure-fundamentals.jpg",
    },
    "azure-developer": {
      name: "Microsoft Certified: Azure Developer Associate",
      issuer: "Dynamic DNA",
      status: "expired",
      date: "Nov 2024",
      description:
        "Demonstrates expertise in designing, building, testing, and maintaining cloud solutions on Azure.",
      img: "/images/doc/Developer-Associate.PNG",
    },
    "cyber-security": {
      name: "Introduction to Cybersecurity",
      issuer: "NetCampus Group",
      status: "completed",
      date: "Mar 2026",
      description:
        "Covers foundational cybersecurity concepts including threats, vulnerabilities, and best practices.",
      img: "/images/doc/Cyber-Security.PNG",
    },
    "intro-ai": {
      name: "Introduction to Artificial Intelligence",
      issuer: "NetCampus Group",
      status: "completed",
      date: "Mar 2026",
      description:
        "Explores core AI concepts including machine learning, neural networks, and real-world applications.",
      img: "/images/doc/Artificial-Intelligence.PNG",
    },
    "intro-data-analytics": {
      name: "Introduction to Data Analytics",
      issuer: "NetCampus Group",
      status: "completed",
      date: "Apr 2026",
      description:
        "Introduces data analytics principles, tools, and techniques for deriving insights from data.",
      img: "/images/doc/Data-Analytics.jpg",
    },
  };

  const certDrawer = document.getElementById("certDrawer");
  const certOverlay = document.getElementById("certOverlay");

  window.openCertPanel = function (id) {
    const cert = certs[id];
    if (!cert || !certDrawer) return;

    document.getElementById("drawerName").textContent = cert.name;
    document.getElementById("drawerCompany").textContent = cert.issuer;
    document.getElementById("drawerDate").textContent = `Issued: ${cert.date}`;
    document.getElementById("drawerDesc").textContent = cert.description;

    const badge = document.getElementById("drawerBadge");
    badge.textContent = cert.status === "expired" ? "Expired" : "Completed";
    badge.className = `cert-drawer-badge ${cert.status}`;

    // image
    const drawerImg = document.getElementById("drawerImg");
    if (cert.img) {
      drawerImg.src = cert.img;
      drawerImg.classList.add("visible");
    } else {
      drawerImg.src = "";
      drawerImg.classList.remove("visible");
    }
    certDrawer.classList.add("active");
    certOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  // on window — onclick can find it
  window.closeCertDrawer = function () {
    certDrawer?.classList.remove('active');
    certOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  };

  document
    .getElementById("certDrawerClose")
    ?.addEventListener("click", closeCertDrawer);
  certOverlay?.addEventListener("click", closeCertDrawer);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCertDrawer();
  });

});
