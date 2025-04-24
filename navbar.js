// navbar.js

import { isLoggedIn, logout } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const authLinks = document.getElementById('authLinks');
  const guestLinks = document.getElementById('guestLinks');
  const logoutBtn = document.getElementById('logoutBtn');

  if (isLoggedIn()) {
    // User is logged in
    if (authLinks) authLinks.classList.remove('hidden');
    if (guestLinks) guestLinks.classList.add('hidden');
    if (logoutBtn) {
      logoutBtn.classList.remove('hidden');
      logoutBtn.addEventListener('click', logout);
    }
  } else {
    // User is not logged in
    if (authLinks) authLinks.classList.add('hidden');
    if (guestLinks) guestLinks.classList.remove('hidden');
    if (logoutBtn) logoutBtn.classList.add('hidden');
  }

  // Update active link
  const currentPage = window.location.pathname.split("/").pop();
  document.querySelectorAll(".nav-link").forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("border-b-2", "border-black", "pb-1");
    }
  });
});
