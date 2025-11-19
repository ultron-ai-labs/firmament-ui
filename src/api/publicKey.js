import request from '@/utils/request'

export function getPublicKey() {
  return request({
    url: '/api/account/publicKey',
    method: 'post',
  })
}
