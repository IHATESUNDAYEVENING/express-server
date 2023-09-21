import {resultConverter} from "../utils/converter.js";

export const pageSize = 10

export class pageObject {
    isLast = false
    content = []
    pageNum = null

    constructor(content, pageNum) {
        this.isLast = content.length < pageSize
        this.content = resultConverter(content)
        this.pageNum = pageNum
    }

    getLast = () => this.isLast

    getContent = () => this.content

    getCurrentPage = () => this.pageNum

}
