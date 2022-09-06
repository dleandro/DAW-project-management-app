/**
 * Function used to obtain the service associated to the home resource
 */
export function getHomeService(homeUrl) {
    return {
        getHomeInfo: async () => {
            console.log(`HomeService.getHomeInfo()`)
            const response = await fetch(homeUrl)
            return await response.json()
        }
    }
}
