const title = 'A simple community'

export default function getPageTitle(pageTitle) {
    if (pageTitle) {
        return `${pageTitle} - ${title}`
    }
    return `${title}`
}