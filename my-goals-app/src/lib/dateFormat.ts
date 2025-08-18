export function dateFormat(timestamp: number) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-EN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
}
