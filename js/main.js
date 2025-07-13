function includeHTML(callback) {
  const elements = document.querySelectorAll('[data-include]');
  let remaining = elements.length;

  if (remaining === 0) {
    if (typeof callback === 'function') callback();
    return;
  }

  elements.forEach((el) => {
    const file = el.getAttribute('data-include');
    fetch(file)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${file}`);
        return res.text();
      })
      .then((html) => {
        el.outerHTML = html;
        remaining--;
        if (remaining === 0 && typeof callback === 'function') callback();
        else includeHTML(callback); // handle nested includes
      })
      .catch((err) => {
        console.error('Include failed:', file, err);
        el.outerHTML = `<div style="color:red;">Could not load ${file}</div>`;
        remaining--;
        if (remaining === 0 && typeof callback === 'function') callback();
      });
  });
}

// Your app bootstrap function — runs only after all includes done
function bootUkubona() {
  console.log("All includes loaded, booting app logic.");

  // Bind dark mode toggle
  const toggle = document.getElementById("darkmode-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
    });
  } else {
    console.warn("darkmode-toggle button not found!");
  }

  // Add other bindings, e.g., logo effects, wiki-controls, etc.
  const logo = document.getElementById("logo");
  if (logo) {
    // Example: maybe swap src on hover or something
    logo.addEventListener("mouseenter", () => {
      logo.src = "https://abikesa.github.io/logos/assets/ukubona-dark.png";
    });
    logo.addEventListener("mouseleave", () => {
      logo.src = "https://abikesa.github.io/logos/assets/ukubona-light.png";
    });
  } else {
    console.warn("Logo not found!");
  }

  // Your wiki-controls JS init here...
}

// Start everything after DOM loaded
document.addEventListener("DOMContentLoaded", () => {
  includeHTML(bootUkubona);
});
