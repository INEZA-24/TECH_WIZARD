// Simple auth check
if (sessionStorage.getItem('adminAuthenticated') !== 'true') {
    const password = prompt('Enter admin password:');
    if (password === 'techwizard2008fidele24') {
        sessionStorage.setItem('adminAuthenticated', 'true');
    } else {
        alert('Access denied');
        window.location.href = 'projects.html';
    }
}