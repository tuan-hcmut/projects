module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (err.status === 'fail') {
    return res.status(err.statusCode).render('loginForm', {
      title: 'Login',
    });
  }
  return res.status(err.statusCode).render('overview', {
    title: 'My Website',
  });
};
