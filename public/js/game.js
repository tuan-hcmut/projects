import axios from 'axios';

exports.sudokuGame = async () => {
  console.log('ytee');
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/games/sudoku',
    });
    if (res.data.status === 'success') window.location.assign('/games/sudoku');
    else if (res.data.status === 'fail') window.location.assign('/users/login');
  } catch (err) {
    console.log('dgd');
    window.location.assign('/users/login');
  }
};
