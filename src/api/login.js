import request from "@/utils/request";

export function isinitialized() {
  return request({
    url: "/user/login",
    method: "get"
  });
}

export function login(username, password) {
  return request({
    url: "/user/login",
    method: "post",
    data: {
      username,
      password
    }
  });
}

export function getUserInfo(token) {
  return request({
    url: `/user/login/info`,
    method: "get",
    headers: {
      Authorization: token
    }
  });
}

export function changeAccount(data) {
  return request({
    url: `/user/login`,
    method: "put",
    data
  });
}
