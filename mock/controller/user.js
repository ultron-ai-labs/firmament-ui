const accessTokens = {
  admin: 'admin-accessToken',
  editor: 'editor-accessToken',
  test: 'test-accessToken',
}

module.exports = [
  // {
  //   url: '/api/account/publicKey',
  //   type: 'post',
  //   response() {
  //     return {
  //       code: 200,
  //       msg: 'success',
  //       data: {
  //         mockServer: true,
  //         publicKey:
  //           'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDBT2vr+dhZElF73FJ6xiP181txKWUSNLPQQlid6DUJhGAOZblluafIdLmnUyKE8mMHhT3R+Ib3ssZcJku6Hn72yHYj/qPkCGFv0eFo7G+GJfDIUeDyalBN0QsuiE/XzPHJBuJDfRArOiWvH0BXOv5kpeXSXM8yTt5Na1jAYSiQ/wIDAQAB',
  //       },
  //     }
  //   },
  // },
  // {
  //   url: '/api/account/login',
  //   type: 'post',
  //   response(config) {
  //     const { username } = config.body
  //     const accessToken = accessTokens[username]
  //     if (!accessToken) {
  //       return {
  //         code: 500,
  //         msg: '帐户或密码不正确。',
  //       }
  //     }
  //     return {
  //       code: 200,
  //       msg: 'success',
  //       data: { accessToken },
  //     }
  //   },
  // },
  // {
  //   url: '/api/account/register',
  //   type: 'post',
  //   response() {
  //     return {
  //       code: 200,
  //       msg: '模拟注册成功',
  //     }
  //   },
  // },
  // {
  //   url: '/api/account/userInfo',
  //   type: 'post',
  //   response(config) {
  //     const { accessToken } = config.body
  //     let permissions = ['admin']
  //     let username = 'admin'
  //     if ('admin-accessToken' === accessToken) {
  //       permissions = ['admin']
  //       username = 'admin'
  //     }
  //     if ('editor-accessToken' === accessToken) {
  //       permissions = ['editor']
  //       username = 'editor'
  //     }
  //     if ('test-accessToken' === accessToken) {
  //       permissions = ['admin', 'editor']
  //       username = 'test'
  //     }
  //     return {
  //       code: 200,
  //       msg: 'success',
  //       data: {
  //         permissions,
  //         username,
  //         'avatar|1': ['https://gcore.jsdelivr.net/gh/zxwk1998/image/avatar/avatar_1.png'],
  //       },
  //     }
  //   },
  // },
  // {
  //   url: '/api/account/logout',
  //   type: 'post',
  //   response() {
  //     return {
  //       code: 200,
  //       msg: 'success',
  //     }
  //   },
  // },
]
