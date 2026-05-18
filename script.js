const body = document.body;
const currentPage = body.dataset.page;
const navToggle = document.getElementById("nav-toggle");
const siteNav = document.getElementById("site-nav");
const introOverlay = document.getElementById("intro-overlay");
const typedName = document.getElementById("typed-name");
const resumePdfPath = "assets/resume/Dieunie_Gousse_Resume.pdf";

if (siteNav && currentPage) {
  const activeLink = siteNav.querySelector(`[data-nav="${currentPage}"]`);
  if (activeLink) activeLink.classList.add("is-active");
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    siteNav.classList.toggle("is-open");
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      siteNav.classList.remove("is-open");
    });
  });
}

if (introOverlay && !sessionStorage.getItem("intro-shown")) {
  introOverlay.classList.add("is-visible");
  sessionStorage.setItem("intro-shown", "true");
  window.setTimeout(() => {
    introOverlay.classList.add("is-hidden");
  }, 2100);
}

function typeName(element) {
  const text = element.dataset.text || element.textContent || "";
  element.dataset.text = text;
  element.textContent = "";
  let index = 0;

  const tick = () => {
    if (index < text.length) {
      element.textContent += text[index];
      index += 1;
      window.setTimeout(tick, 65);
    }
  };

  window.setTimeout(tick, 350);
}

if (typedName) {
  if (introOverlay && !sessionStorage.getItem("typed-name-done")) {
    window.setTimeout(() => {
      typeName(typedName);
      sessionStorage.setItem("typed-name-done", "true");
    }, 2400);
  } else {
    typedName.dataset.text = typedName.textContent;
  }
}

document.querySelectorAll("[data-download-resume]").forEach((link) => {
  link.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(resumePdfPath);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "Dieunie_Gousse_Resume.pdf";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      window.open(resumePdfPath, "_blank", "noopener");
    }
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
