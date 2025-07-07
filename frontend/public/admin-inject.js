// Script d'injection du widget d'administration
(function() {
    // Load the admin widget HTML
    fetch('/admin-widget.html')
        .then(response => response.text())
        .then(html => {
            // Create a container div
            const container = document.createElement('div');
            container.innerHTML = html;
            
            // Append to body
            document.body.appendChild(container);
            
            // Add a discrete admin button to the existing navigation
            addAdminButton();
        })
        .catch(error => {
            console.log('Admin widget not available');
        });

    function addAdminButton() {
        // Wait for the page to load
        setTimeout(() => {
            // Look for the navigation menu
            const nav = document.querySelector('nav') || document.querySelector('.navbar') || document.querySelector('header');
            
            if (nav) {
                // Create admin button
                const adminBtn = document.createElement('button');
                adminBtn.innerHTML = '⚙️';
                adminBtn.style.cssText = `
                    background: transparent;
                    border: none;
                    font-size: 18px;
                    cursor: pointer;
                    padding: 5px;
                    margin-left: 10px;
                    opacity: 0.5;
                    transition: opacity 0.3s;
                `;
                adminBtn.title = 'Administration';
                adminBtn.onclick = function() {
                    if (window.showAdminModal) {
                        window.showAdminModal();
                    }
                };
                
                // Add hover effect
                adminBtn.onmouseover = () => adminBtn.style.opacity = '1';
                adminBtn.onmouseout = () => adminBtn.style.opacity = '0.5';
                
                // Try to add to the right side of navigation
                const rightNav = nav.querySelector('.navbar-nav:last-child') || 
                                nav.querySelector('.nav-right') || 
                                nav.lastElementChild || 
                                nav;
                
                rightNav.appendChild(adminBtn);
            } else {
                // If no nav found, add a floating button
                const floatingBtn = document.createElement('div');
                floatingBtn.innerHTML = '⚙️';
                floatingBtn.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 50px;
                    height: 50px;
                    background: rgba(0,0,0,0.7);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: 20px;
                    z-index: 9999;
                    transition: all 0.3s;
                    opacity: 0.3;
                `;
                floatingBtn.title = 'Administration';
                floatingBtn.onclick = function() {
                    if (window.showAdminModal) {
                        window.showAdminModal();
                    }
                };
                
                // Add hover effect
                floatingBtn.onmouseover = () => {
                    floatingBtn.style.opacity = '1';
                    floatingBtn.style.transform = 'scale(1.1)';
                };
                floatingBtn.onmouseout = () => {
                    floatingBtn.style.opacity = '0.3';
                    floatingBtn.style.transform = 'scale(1)';
                };
                
                document.body.appendChild(floatingBtn);
            }
        }, 3000); // Wait for the page to fully load
    }
})();