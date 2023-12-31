import serverConfig from "./constants";

class Authentication {
  constructor({ url, headers }) {
    this._generalUrl = url;
    this._headers = headers;
    this._token = null;
  }

  _checkResponse(response) {
    if (!response.ok) {
      console.error(`Error response from ${response.url}: ${response.status}`);
      if (response.status === 401) {
        return Promise.reject('Токен недействителен или отсутствует');
      }
      return Promise.reject(`Ошибка: ${response.status}`);
    }
    return response.json();
  }

  _request(endpoint, headers, options) {
    return fetch(`${this._generalUrl}${endpoint}`, options).then(this._checkResponse);
  }

  pushRegistration(data) {
    return this._request('/signup', this._headers, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        password: data.password,
        email: data.email
      })
    });
  }

  pushLogin(data) {
    return this._request('/signin', this._headers, {
      method: 'POST',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify({
        password: data.password,
        email: data.email
      })
    })
    .then(res => {
      return res;
    });
  }

  pullDataAuth() {
    return this._request('/users/me', this._headers, {
      headers: this._headers,
      credentials: 'include'
    });
  }

  pushLogout() {
    return this._request('/signout', this._headers, {
      method: 'POST',
      headers: this._headers,
      credentials: 'include'
    });
  }
}

const authenticationApi = new Authentication(serverConfig);

export default authenticationApi;
