import request from '@/utils/request';

export async function getNews(params) {
    return request(`/app/GetNews`,{
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function MarketPrice() {
    return request(`/app/MarketPrice`,{
        method: 'POST'
    });
}
