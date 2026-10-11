function setupPasswordToggle(fieldWrapper) {
    const input = fieldWrapper.querySelector('input');
    const toggleBtn = fieldWrapper.querySelector('.toggle-password');

    toggleBtn.addEventListener('click', () => {
        const isHidden = input.type === 'password';
        input.type = isHidden ? 'text' : 'password';
        toggleBtn.textContent = isHidden ? '🙈' : '👁️';
        toggleBtn.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
    });
}

export { setupPasswordToggle };
