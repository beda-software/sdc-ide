export function getConfig() {
    const { username, password, baseUrl } = window.localStorage;
    return {
        username: username ?? 'root',
        password: password ?? 'secret',
        baseUrl: baseUrl ?? 'http://localhost:8080',
    };
}
