const BASE_URL = "https://api.open-meteo.com/v1"

export async function getApi(path: string, baseUrl: string = BASE_URL) {
    const res = await fetch(`${baseUrl}/${path}`)
    if (!res.ok) {
        const err = await res.text()
        throw new Error('error blawg, ' + err)
    }
    return res.json()
}