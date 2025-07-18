document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("newsletterForm");
  const container = document.getElementById("toast-container");

  if (!form || !container) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      const msg = res.ok
        ? "Dziękujemy! E-mail zapisany. Gdy ruszymy, otrzymasz wiadomość ze zniżką."
        : (await res.json())?.errors?.map((e) => e.message).join(", ") ||
          "Ups! Coś poszło nie tak.";

      showToast(msg, res.ok ? "success" : "error");
      if (res.ok) form.reset();
    } catch {
      showToast("Ups! Nie udało się wysłać formularza.", "error");
    }
  });

  function showToast(msg, type = "success", duration = 6000) {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span>${msg}</span>
      <button class="close-btn" aria-label="Zamknij">&times;</button>
      <div class="timeline" style="animation: shrink ${duration}ms linear forwards;"></div>
    `;

    toast.querySelector(".close-btn").onclick = () => removeToast(toast);
    container.appendChild(toast);
    setTimeout(() => removeToast(toast), duration);
  }

  const removeToast = (toast) => {
    toast.style.animation = "toastOut 0.4s ease-in forwards";
    setTimeout(() => toast.remove(), 400);
  };
});
