import '@babel/polyfill';
import { login, signup, logout } from './login';
import { updateData } from './updateSetting';
import { check } from './sudoku';
import { sudokuGame } from './game';

const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logOut = document.querySelector('.logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const sudokuGame = document.querySelector('.newgame-btn');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    document.querySelector('.btn--green').textContent = 'LOGGING...';
    await login(email, password);
    document.querySelector('.btn--green').textContent = 'LOG IN';
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    document.querySelector('.btn--green').textContent = 'CREATING...';

    await signup(name, email, password, passwordConfirm);
    document.querySelector('.btn--green').textContent = 'SIGN IN';
  });
}

if (logOut) {
  logOut.addEventListener('click', logout);
}

if (userDataForm)
  userDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    // const email = document.getElementById('email').value;
    // const name = document.getElementById('name').value;
    document.querySelector('.btn--green').textContent = 'SAVING...';
    await updateData(form, 'data');
    document.querySelector('.btn--green').textContent = 'SAVE SETTINGS';
  });

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    /// passwordCurrent .... will be get from html a then these date will be send to the link url in axios along with req.body
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateData(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'SAVE PASSWORD';

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (sudokuGame) {
  let idCount = 0;
  for (let i = 0; i < 81; i++) {
    let tile = document.createElement('p');
    tile.textContent = '';
    tile.id = idCount;
    idCount++;
    tile.classList.add('tile');
    if ((tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id < 54)) {
      tile.classList.add('bottomBorder');
    }
    if ((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6) {
      tile.classList.add('rightBorder');
    }
    const board = document.getElementById('board').appendChild(tile);
  }
  sudokuGame.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.assign('/games/sudoku');
  });
  check();
}
