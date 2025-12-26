function copyDiscord(button) {
    navigator.clipboard.writeText("goribby");

    const originalHTML = button.innerHTML;

    button.innerHTML = "Copied to clipboard!";

    setTimeout(() => {
        button.innerHTML = originalHTML;
    }, 4000);
}