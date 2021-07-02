/*eslint-disable*/
import '@babel/polyfill';
import { login, signup, logout } from './login';

//DOM ELEMENTS
const loginForm = document.querySelector('.form');
const signupForm = document.querySelector('.signup');
const logOutBtn = document.querySelector('a.logout');
const logOutLg = document.querySelector('a.signout');

if (signupForm)
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    signup(name, email, password, confirmPassword);
  });

if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (logOutLg) logOutLg.addEventListener('click', logout);
