// Set a cookie with a name (adminId or studentId)
export function setCookie(name, value, days = 7) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

// Get a cookie value by name
export function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        const [key, val] = cookie.split("=");
        if (key === name) return val;
    }
    return null;
}

// Delete a cookie by name
export function deleteCookie(name) {
    document.cookie = `${name}=; max-age=0; path=/`;
}

