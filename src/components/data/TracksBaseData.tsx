import TracksData from "./TracksData"
import { apiCall } from "helpers"

class TracksBaseData extends TracksData {
  playlist: any

  constructor(accessToken: string, playlist: any) {
    super(accessToken)
    this.playlist = playlist
  }

  dataLabels() {
    return [
      "Artist Name(s)",
      "Track Name"
    ]
  }

  async trackItems() {
    await this.getPlaylistItems()

    return this.playlistItems
  }

  async data() {
    await this.getPlaylistItems()

    return new Map(this.playlistItems.map(item => {
      // I added an if statement here to ask whether the titles and artists have certain conditions, and then replace them with favourable values
      
      if (item.track.name.includes('(feat.' && 'Remix')) {
        return [
          item.track.uri,
          [
            // The below line is where I do the artist and title formatting
            item.track.artists.map((a: any) => { return String(a.name).replace(/,/g, "\\,") }).join(', ').split(',')[0],
            item.track.name.replace(/ - /g, ' (') + ')'
          ]
        ]
      } 


      if (item.track.name.includes("Mix)")) {
        return [
          item.track.uri,
          [
            // The below line is where I do the artist and title formatting
            item.track.artists.map((a: any) => { return String(a.name).replace(/,/g, "\\,") }).join(', ').split(',')[0],
            item.track.name.replace(/ - /g, ' (')
          ]
        ]
      } 

      if (item.track.name.includes('Mix')) {
        return [
          item.track.uri,
          [
            // The below line is where I do the artist and title formatting
            item.track.artists.map((a: any) => { return String(a.name).replace(/,/g, "\\,") }).join(', ').split(',')[0],
            item.track.name.replace(/ - /g, ' (') + ')'
          ]
        ]
      } 

      if (item.track.name.includes('feat.')) {
        return [
          item.track.uri,
          [
            // The below line is where I do the artist and title formatting
            item.track.artists.map((a: any) => { return String(a.name).replace(/,/g, "\\,") }).join(', ').split(',')[0],
            item.track.name.replace(/ - /g, ' (')
          ]
        ]
      } 

      if (item.track.name.includes("Remix)")) {
        return [
          item.track.uri,
          [
            // The below line is where I do the artist and title formatting
            item.track.artists.map((a: any) => { return String(a.name).replace(/,/g, "\\,") }).join(', ').split(',')[0],
            item.track.name.replace(/ - /g, ' (')
          ]
        ]
      } 

      if (item.track.name.includes("Remix")) {
        return [
          item.track.uri,
          [
            // The below line is where I do the artist and title formatting
            item.track.artists.map((a: any) => { return String(a.name).replace(/,/g, "\\,") }).join(', ').split(',')[0],
            item.track.name.replace(/ - /g, ' (') + ')'
          ]
        ]
      } 
      
      else if (item.track.name.includes(' - ')) {
        return [
          item.track.uri,
          [
            // The below line is where I do the artist and title formatting
            item.track.artists.map((a: any) => { return String(a.name).replace(/,/g, "\\,") }).join(', ').replace(/, /g, ' and '),
            item.track.name.replace(/ - /g, ' (') + ')'
          ]
        ]
      } 
      
      else return [
        item.track.uri,
        [
          item.track.artists.map((a: any) => { return String(a.name).replace(/,/g, "\\,") }).join(', ').replace(/, /g, ' and '),
          item.track.name
        ]
      ]
    }))
  }
  


  // Memoization supporting multiple calls
  private playlistItems: any[] = []
  private async getPlaylistItems() {
    if (this.playlistItems.length > 0) {
      return this.playlistItems
    }

    var requests = []
    var limit = this.playlist.tracks.limit || 100

    for (var offset = 0; offset < this.playlist.tracks.total; offset = offset + limit) {
      requests.push(`${this.playlist.tracks.href.split('?')[0]}?offset=${offset}&limit=${limit}`)
    }

    const trackPromises = requests.map(request => { return apiCall(request, this.accessToken) })
    const trackResponses = await Promise.all(trackPromises)

    this.playlistItems = trackResponses.flatMap(response => {
      return response.data.items.filter((i: any) => i.track) // Exclude null track attributes
    })
  }

}

export default TracksBaseData
