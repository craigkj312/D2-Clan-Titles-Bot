import { getProfile, getActivities } from './api';

export let checkDates = (date1, date2) => {
    return date1.getMonth() === date2.getMonth() && date1.getYear() === date2.getYear()
}

export let getDate = (m, y) => {
    let monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ]

    return new Date(monthNames[m] + ' ' + y)
} 

export let formatDate = (date) => {
    let monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ]
  
    let monthIndex = date.getMonth();
    let year = date.getFullYear();
  
    return monthNames[monthIndex] + ' ' + year;
}

export let getRaidCount = (name, membershipId, atDate) => new Promise((resolve, reject) => {

    let raidCount = 0

    getProfile(4, membershipId, [200])
    .then(profileResponse => {
        if (profileResponse) { 
            let raidMap = Object.keys(profileResponse.characters.data).map((characterId, i) => {
                const character = profileResponse.characters.data[characterId]
                return getActivities(character, 250, 4, 0, atDate)
            })
            let results = Promise.all(raidMap)
            results.then(activitiesResponse => {
                // if (name === 'liquidangel') { console.log(activitiesResponse) }
                let allActivites = activitiesResponse.flat(1)
                if (allActivites.length > 0) {
                    allActivites.forEach((activity) => {
                        if (activity) {
                            const activityDate = new Date(activity.period)
                            if (checkDates(activityDate, atDate) &&
                                activity.values.completed.basic.value === 1 &&
                                activity.values.completionReason.basic.displayValue !== 'Failed') {
                                raidCount = raidCount + 1
                            }
                        }
                    })
                }
                resolve({name, raidCount})
            })  
        } else { resolve({name, raidCount}) }
    })
})

export let getCrucibleWins = (name, membershipId, atDate) => new Promise((resolve, reject) => {

    let crucibleWins = 0

    getProfile(4, membershipId, [200])
    .then(profileResponse => {
        if (profileResponse) { 
            let pvpMap = Object.keys(profileResponse.characters.data).map((characterId, i) => {
                const character = profileResponse.characters.data[characterId]
                return getActivities(character, 250, 5, 0, atDate)
            })
            let results = Promise.all(pvpMap)
            results.then(activitiesResponse => {
                let allActivites = activitiesResponse.flat(1)
                if (allActivites.length > 0) {
                    allActivites.forEach((activity) => {
                        if (activity) {
                            const activityDate = new Date(activity.period)
                            if (checkDates(activityDate, atDate) &&
                                activity.values.completed.basic.value === 1 &&
                                activity.values.standing.basic.value === 0 &&
                                activity.values.efficiency.basic.value !== 0) {
                                crucibleWins = crucibleWins + 1
                            }
                        }
                    })
                }
                resolve({name, crucibleWins})
            })
        } else { resolve({name, crucibleWins}) }
    })
})

export let getGambitWins = (name, membershipId, atDate) => new Promise((resolve, reject) => {

    let gambitWins = 0

    getProfile(4, membershipId, [200])
    .then(profileResponse => {
        if (profileResponse) { 
            let gambitMap = Object.keys(profileResponse.characters.data).map((characterId, i) => {
                const character = profileResponse.characters.data[characterId]
                return getActivities(character, 250, 64, 0, atDate)
            })
            let results = Promise.all(gambitMap)
            results.then(activitiesResponse => {
                let allActivites = activitiesResponse.flat(1)
                if (allActivites.length > 0) {
                    allActivites.forEach((activity) => {
                        if (activity) {
                            const activityDate = new Date(activity.period)
                            if (checkDates(activityDate, atDate) &&
                                activity.values.completed.basic.value === 1 &&
                                activity.values.standing.basic.value === 0 &&
                                activity.values.efficiency.basic.value !== 0) {
                                    gambitWins = gambitWins + 1
                            }
                        }
                    })
                }
                resolve({name, gambitWins})
            })
        } else { resolve({name, gambitWins}) }
    })
})

export let getStrikeCount = (name, membershipId, atDate) => new Promise((resolve, reject) => {

    let strikeCount = 0

    getProfile(4, membershipId, [200])
    .then(profileResponse => {
        if (profileResponse) { 
            let strikeMap = Object.keys(profileResponse.characters.data).map((characterId, i) => {
                const character = profileResponse.characters.data[characterId]
                return getActivities(character, 250, 18, 0, atDate)
            })
            let results = Promise.all(strikeMap)
            results.then(activitiesResponse => {
                let allActivites = activitiesResponse.flat(1)
                if (allActivites.length > 0) {
                    allActivites.forEach((activity) => {
                        if (activity) {
                            const activityDate = new Date(activity.period)
                            if (checkDates(activityDate, atDate) &&
                                activity.values.completed.basic.value === 1) {
                                strikeCount = strikeCount + 1
                            }
                        }
                    })
                }
                resolve({name, strikeCount})
            })  
        } else { resolve({name, strikeCount}) }
    })
})