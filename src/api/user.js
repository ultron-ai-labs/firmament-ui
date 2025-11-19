import request from '@/utils/request'
import { encryptedData } from '@/utils/encrypt'
import { loginRSA, tokenName } from '@/config'

export async function login(data) {
  
  debugger
  // if (loginRSA) {
  //   data = await encryptedData(data)
  // }
  return request({
    url: '/api/account/login',
    method: 'post',
    data:data
  })
}

export function getUserInfo(accessToken) {
  return request({
    url: '/api/account/userInfo',
    method: 'post',
    data: {
      [tokenName]: accessToken,
    },
  })
}

export function logout() {
  return request({
    url: '/api/account/logout',
    method: 'post',
  })
}

export function register(data) {
  return request({
    url: '/api/account/register',
    method: 'post',
    data:data
  })
}
