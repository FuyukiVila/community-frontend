import request from '@/utils/request'

// 用户主页
export function getInfoByName(username, page, size) {
    return request({
        url: `/ums/user/${username}`,
        method: 'get',
        params: {
            pageNo: page,
            size: size
        }
    })
}

// 用户主页
export function getInfo() {
    return request({
        url: '/ums/user/info',
        method: 'get'
    })
}

// 更新
export function update(user) {
    return request({
        url: '/ums/user/update',
        method: 'post',
        data: user
    })
}

// 封禁
export function ban(username) {
    return request({
        url: `/ums/user/ban/${username}`,
        method: 'get',
    })
}

// 解封
export function unban(username) {
    return request({
        url: `/ums/user/unban/${username}`,
        method: 'get',
    })
}

// 删除头像
export function deleteAvatar(username) {
    return request({
        url: `/ums/user/delete_avatar/${username}`,
        method: 'delete'
    })
}