// auth.js

export function register(user) {
  const users = JSON.parse(localStorage.getItem('cineflix_users')) || [];
  if (users.find(u => u.username === user.username)) return false;
  users.push(user);
  localStorage.setItem('cineflix_users', JSON.stringify(users));
  return true;
}

export function login(username, password) {
  const users = JSON.parse(localStorage.getItem('cineflix_users')) || [];
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return false;
  sessionStorage.setItem('cineflix_session', JSON.stringify(user));
  return true;
}

export function currentUser() {
  return JSON.parse(sessionStorage.getItem('cineflix_session'));
}

export function logout() {
  sessionStorage.removeItem('cineflix_session');
  location.href = 'login.html';
}
