import '@/envConfig';

export async function fetchSpell() {
    process.cwd()
    try {
        let data = await fetch(process.env.API_URL!+'/spells?size=20')
        const spells = await data.json()
        return spells
    } catch (error){
        console.error('API Error: ', error)
    }

}