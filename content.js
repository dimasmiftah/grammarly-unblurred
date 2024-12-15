// Function to apply styles to element
function applyStyles(element) {
    element.style.setProperty('filter', 'none', 'important');
    element.style.setProperty('-webkit-filter', 'none', 'important');
}

// Function to process elements
function processElements() {
    const popups = document.querySelector('grammarly-popups');
    if (!popups) return;

    // Access shadow root
    const shadowRoot = popups.shadowRoot;
    if (!shadowRoot) return;

    const elements = shadowRoot.querySelectorAll('.overlayContainer > .obscuredContent > div');
    elements.forEach(applyStyles);
}

// Create an observer to watch for changes in grammarly-popups
const observer = new MutationObserver(() => {
    processElements();
});

// Start observing when grammarly-popups appears
function startObserving() {
    const popups = document.querySelector('grammarly-popups');
    if (popups) {
        // Observe both the element and its shadow root
        observer.observe(popups, {
            childList: true,
            subtree: true,
            attributes: true
        });
        
        if (popups.shadowRoot) {
            observer.observe(popups.shadowRoot, {
                childList: true,
                subtree: true,
                attributes: true
            });
        }
        
        processElements();
        clearInterval(checkInterval);
    } else {
        console.log('Waiting for grammarly-popups to appear...');
    }
}

// Check for grammarly-popups periodically
const checkInterval = setInterval(startObserving, 1000);

// Add mouseover event listener to reapply styles
document.addEventListener('mouseover', (e) => {
    if (e.target.closest('grammarly-popups')) {
        processElements();
    }
});

// Start when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserving);
} else {
    startObserving();
}