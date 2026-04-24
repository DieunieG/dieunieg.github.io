const body = document.body;
const currentPage = body.dataset.page;
const navToggle = document.getElementById("nav-toggle");
const siteNav = document.getElementById("site-nav");
const introOverlay = document.getElementById("intro-overlay");
const typedName = document.getElementById("typed-name");
const resumeHref = "assets/resume/Dieunie_Gousse_Resume.pdf";

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

function buildResumeModal() {
  const modal = document.createElement("dialog");
  modal.className = "resume-modal";
  modal.innerHTML = `
    <div class="resume-modal__shell">
      <div class="resume-modal__header">
        <div>
          <p class="section-label">Resume</p>
          <h2>Dieunie Gousse</h2>
        </div>
        <button class="resume-modal__close" type="button" aria-label="Close resume viewer">Close</button>
      </div>
      <div class="resume-modal__body">
        <div class="resume-modal__message">
          <div class="resume-modal__preview-card">
            <p class="section-label">Resume Ready</p>
            <h3>Dieunie Gousse Resume</h3>
            <p>
              This browser is not rendering the PDF preview correctly here, so use one of the working options below to open or download it cleanly.
            </p>
          </div>
        </div>
      </div>
      <div class="resume-modal__footer">
        <a class="btn btn--secondary" href="${resumeHref}" target="_blank" rel="noopener noreferrer">Open in New Tab</a>
        <a class="btn btn--primary" href="${resumeHref}" download>Download Resume</a>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const closeButton = modal.querySelector(".resume-modal__close");
  closeButton.addEventListener("click", () => modal.close());
  modal.addEventListener("click", (event) => {
    const rect = modal.querySelector(".resume-modal__shell").getBoundingClientRect();
    const isInside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;
    if (!isInside) modal.close();
  });

  return modal;
}

const resumeLinks = document.querySelectorAll("[data-resume-link]");
let resumeModal = null;

resumeLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    if (!resumeModal) resumeModal = buildResumeModal();
    resumeModal.showModal();
  });
});

if (currentPage === "resume") {
  window.setTimeout(() => {
    if (!resumeModal) resumeModal = buildResumeModal();
    if (!resumeModal.open) resumeModal.showModal();
  }, 250);
}

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
