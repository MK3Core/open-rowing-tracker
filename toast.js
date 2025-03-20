// Simple toast notification system (without Bootstrap dependency)
function showToast(message, type = 'success') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        toastContainer.style.position = 'fixed';
        toastContainer.style.top = '20px';
        toastContainer.style.right = '20px';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toastEl = document.createElement('div');
    toastEl.className = 'toast';
    toastEl.style.backgroundColor = type === 'success' ? '#28a745' : 
                                    type === 'warning' ? '#ffc107' : '#dc3545';
    toastEl.style.color = type === 'warning' ? '#212529' : '#fff';
    toastEl.style.padding = '10px 15px';
    toastEl.style.borderRadius = '4px';
    toastEl.style.marginBottom = '10px';
    toastEl.style.boxShadow = '0 0.5rem 1rem rgba(0, 0, 0, 0.15)';
    toastEl.style.opacity = '0';
    toastEl.style.transition = 'opacity 0.3s ease-in-out';
    
    // Add message content
    toastEl.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>${message}</div>
            <button style="background: transparent; border: none; color: inherit; cursor: pointer; font-size: 1.2em; margin-left: 10px; font-weight: bold;" 
                    onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add to container
    toastContainer.appendChild(toastEl);
    
    // Trigger reflow and animate in
    setTimeout(() => {
        toastEl.style.opacity = '1';
    }, 10);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toastEl.style.opacity = '0';
        setTimeout(() => {
            toastEl.remove();
        }, 300);
    }, 3000);
}