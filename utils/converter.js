import dayjs from 'dayjs'


export const dateConverter = (date, format = 'YYYY-MM-DD hh:mm:ss') => {
    if (!date) return ''
    else return dayjs(date).format(format)
}

export const resultConverter = (result) =>
    result.map((item, index) => {
        if (item['created_at']) {
            item['created_at'] = dateConverter(item['created_at'])
        }
        return item
    })
