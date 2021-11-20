import axios from 'axios';

export const updateData = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:3000/users/updateMyPassword'
        : 'http://127.0.0.1:3000/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url: url,
      data: data,
    });

    if (res.data.status === 'success') location.assign('/me');
  } catch (err) {
    alert(err.response.data.message);
  }
};
