document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            if (themeToggle) themeToggle.checked = true;
        } else {
            body.classList.remove('dark-mode');
            if (themeToggle) themeToggle.checked = false;
        }
    };

    const saveThemePreference = (theme) => {
        localStorage.setItem('theme', theme);
    };

    const loadThemePreference = () => {
        let preferredTheme = localStorage.getItem('theme');
        if (!preferredTheme) {
            // If no saved preference, check system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                preferredTheme = 'dark';
            } else {
                preferredTheme = 'light'; // Default to light if no system preference or system is light
            }
        }
        applyTheme(preferredTheme);
    };

    // Event listener for the toggle switch
    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            if (themeToggle.checked) {
                applyTheme('dark');
                saveThemePreference('dark');
            } else {
                applyTheme('light');
                saveThemePreference('light');
            }
        });
    }

    // Load theme preference on initial page load
    loadThemePreference();

    // Optional: Listen for changes in system preference (if user hasn't set a preference)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        const newColorScheme = e.matches ? 'dark' : 'light';
        // Only apply if no user preference is stored
        if (!localStorage.getItem('theme')) {
            applyTheme(newColorScheme);
        }
    });
});
