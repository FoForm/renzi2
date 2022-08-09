import Cookies from 'js-cookie'

const TokenKey = 'hrsaas-token'
const timekey = 'timekey-key'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
// 获取时间戳
export function getTime(){
  return Cookies.get(timekey)
}
// 设置时间戳
export function setTime(){
  Cookies.set(timekey,Date.now())
}