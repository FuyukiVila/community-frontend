import request from '@/utils/request'

export function fetchCommentsByTopicId(topicId) {
    return request({
        url: '/comment/get_comments',
        method: 'get',
        params: {
            topicid: topicId
        }
    })
}

export function pushComment(data) {
    return request({
        url: '/comment/add_comment',
        method: 'post',
        data: data
    })
}