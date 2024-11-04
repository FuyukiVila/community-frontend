import request from '@/utils/request'

export function getBillboard(){
    return request({
        method: "GET",
        url: "/billboard/show",
    })
}