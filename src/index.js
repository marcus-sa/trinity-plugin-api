import superagent from 'superagent'

export default class ApiClient {

  formatUrl(path) {
    if (path.startsWith('//') || path.startsWith('http') || path.startsWith('www')) {
      return path
    } else {
      const adjustedPath = path[0] !== '/' ? `/${path}` : path

      return this.url + adjustedPath
    }
  }

  constructor(url = '', notation = null) {
    this.url = url

    return ({ store }) => {
      const methods = ['get', 'post', 'put', 'patch', 'del']

      methods.forEach(method => {
        this[method] = (path, { params, data, headers, files, fields } = {}) => {
          const csrfToken = notation ? store.get(notation) : window.__csrf_token

          return new Promise((resolve, reject) => {
            const request = superagent[method](this.formatUrl(path))

            if (params) {
              request.query(params)
            }

            if (csrfToken) {
              request.set('X-CSRF-Token', csrfToken)
            }

            if (headers) {
              request.set(headers)
            }

            if (this.token) {
              request.set('Authorization', `Bearer ${this.token}`)
            }

            if (files) {
              files.forEach(file => request.attach(file.key, file.value))
            }

            if (fields) {
              fields.forEach(item => request.field(item.key, item.value))
            }

            if (data) {
              request.send(data)
            }

            request.end((err, { body } = {}) => (err ? reject(body || err) : resolve(body)))
          })
        }
      })

      return this
    }
  }

  setJwtToken(token) {
    this.token = token
  }

}