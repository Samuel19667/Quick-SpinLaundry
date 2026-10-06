const overlay = document.getElementById("modalOverlay");
const modal = overlay.querySelector(".modal");
const form = document.getElementById("bookingForm");
const errorEl = document.getElementById("formError");
const dateInput = document.getElementById("date");
const sendBtn = form.querySelector(".send-btn");
const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");
const navbar = document.getElementById("navbar");

const BOOKING_EMAIL = "booking@quickspin.com";

/* Footer year */
document.getElementById("year").textContent = new Date().getFullYear();

/* Disable past dates */
function setMinDate() {
  const t = new Date();
  t.setMinutes(t.getMinutes() - t.getTimezoneOffset());
  dateInput.min = t.toISOString().split("T")[0];
}
setMinDate();

/* Modal open / close */
function openModal() {
  setMinDate();
  overlay.classList.add("active");
  overlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  setTimeout(() => document.getElementById("name").focus(), 350);
}

function closeModal() {
  overlay.classList.remove("active");
  overlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
  // reset after fade-out
  setTimeout(() => {
    modal.classList.remove("sent");
    form.reset();
    errorEl.textContent = "";
    sendBtn.classList.remove("sending");
    form.querySelectorAll(".field").forEach(f => f.classList.remove("invalid"));
  }, 350);
}

document.querySelectorAll(".open-modal").forEach(btn =>
  btn.addEventListener("click", () => {
    navLinks.classList.remove("open");
    burger.classList.remove("open");
    openModal();
  })
);

document.getElementById("closeModal").addEventListener("click", closeModal);
document.getElementById("doneBtn").addEventListener("click", closeModal);
overlay.addEventListener("click", e => { if (e.target === overlay) closeModal(); });
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && overlay.classList.contains("active")) closeModal();
});

/* Form submit */
form.addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("name");
  const details = document.getElementById("details");
  let valid = true;

  [name, dateInput, details].forEach(input => {
    const empty = !input.value.trim();
    input.closest(".field").classList.toggle("invalid", empty);
    if (empty) valid = false;
  });

  if (!valid) {
    errorEl.textContent = "Please fill in all fields.";
    return;
  }
  errorEl.textContent = "";

  const prettyDate = new Date(dateInput.value + "T00:00:00").toLocaleDateString(undefined, {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  const subject = `Laundry Booking: ${prettyDate}`;
  const body =
`Hello Quick Spin,

Name: ${name.value.trim()}
Service date: ${prettyDate}ss

Service details:
${details.value.trim()}

Thank you!`;

  const mailto = `mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  // Plane fly-away animation, then success screen, then open email app
  sendBtn.classList.add("sending");
  setTimeout(() => {
    modal.classList.add("sent");
    window.location.href = mailto;
  }, 700);
});

/* Mobile menu */
burger.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  burger.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open);
});
navLinks.querySelectorAll("a").forEach(a =>
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    burger.classList.remove("open");
  })
);

/* Navbar shadow on scroll */
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 10);
});