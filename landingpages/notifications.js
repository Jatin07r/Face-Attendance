function showToast(message, type = "primary") {
    const toastContainerId = "dynamicToastContainer";
  
    // Create toast container if not present
    let container = document.getElementById(toastContainerId);
    if (!container) {
      container = document.createElement("div");
      container.id = toastContainerId;
      container.className = "position-fixed bottom-0 end-0 p-3";
      container.style.zIndex = "1100";
      document.body.appendChild(container);
    }
  
    // Create toast element
    const toast = document.createElement("div");
    toast.className = `toast align-items-center text-bg-${type} border-0 mb-2`;
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
    toast.setAttribute("aria-atomic", "true");
  
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;
  
    container.appendChild(toast);
  
    // Show the toast
    const toastInstance = new bootstrap.Toast(toast, { delay: 5000 });
    toastInstance.show();
  
    // Remove the toast from DOM after it hides
    toast.addEventListener("hidden.bs.toast", () => {
      toast.remove();
    });
  }
  