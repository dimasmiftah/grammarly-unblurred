// Function to apply styles to element
function applyStyles(element) {
    element.style.setProperty('filter', 'none', 'important');
    element.style.setProperty('-webkit-filter', 'none', 'important');
    element.style.setProperty('cursor', 'pointer', 'important');
}

// Function to get text content excluding strikethrough elements
function getTextWithoutStrikethrough(element) {
    const texts = [];
    element.querySelectorAll('*').forEach(el => {
        // Skip elements with strikethrough class
        if (el.classList.contains('strikeoutHorizontal_f1hzeoet')) {
            return;
        }
        // Get only direct text nodes that are not empty
        for (const node of el.childNodes) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                texts.push(node.textContent);
            }
        }
    });
    return texts.join('').trim();
}

// Function to process elements
function processElements() {
    const popups = document.querySelector('grammarly-popups');
    if (!popups) return;

    // Access shadow root
    const shadowRoot = popups.shadowRoot;
    if (!shadowRoot) return;

    // Remove blur from content
    const elements = shadowRoot.querySelectorAll('.overlayContainer > .obscuredContent > div');
    elements.forEach(element => {
        applyStyles(element);

        // Add click handler
        element.onclick = (e) => {
            const text = getTextWithoutStrikethrough(element);
            if (text) {
                navigator.clipboard.writeText(text).then(() => {
                    // Add visual feedback
                    const originalCursor = element.style.cursor;
                    element.style.cursor = 'copy';
                    setTimeout(() => {
                        element.style.cursor = originalCursor;
                    }, 200);
                });
            }
            e.stopPropagation();
        };
    });

    // Hide overlay
    const overlays = shadowRoot.querySelectorAll('.overlayContainer > .obscuredContent > .overlay');
    overlays.forEach(overlay => {
        overlay.style.setProperty('display', 'none', 'important');
    });

    // Hide visible content
    const visibleContents = shadowRoot.querySelectorAll('.visibleContent');
    visibleContents.forEach(content => {
        content.style.setProperty('display', 'none', 'important');
    });
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