// from https://stackoverflow.com/questions/6108819/javascript-timestamp-to-relative-time
export const timeDiff = (current, previous) => {
    var sPerMinute = 60;
    var sPerHour = sPerMinute * 60;
    var sPerDay = sPerHour * 24;
    var sPerMonth = sPerDay * 30;
    var sPerYear = sPerDay * 365;

    var elapsed = parseInt(current.toString().split("").splice(0, 10).join("")) - previous;

    if (elapsed < sPerMinute) {
        const secondsDiff = Math.round(elapsed/1000);
        return secondsDiff + ((secondsDiff > 1) ? ' seconds ago' : ' second ago');
    }

    else if (elapsed < sPerHour) {
        const minutesDiff = Math.round(elapsed/sPerMinute);
        return minutesDiff + ((minutesDiff > 1) ? ' minutes ago' : ' minute ago');   
    }

    else if (elapsed < sPerDay ) {
        const hoursDiff = Math.round(elapsed/sPerHour);
        return hoursDiff + ((hoursDiff > 1) ? ' hours ago' : ' hour ago');   
    }

    else if (elapsed < sPerMonth) {
        const daysDiff = Math.round(elapsed/sPerDay);
        return 'approximately ' + daysDiff + ((daysDiff > 1) ? ' days ago' : ' day ago');   
    }

    else if (elapsed < sPerYear) {
        const monthsDiff =  Math.round(elapsed/sPerMonth);
        return 'approximately ' + monthsDiff + ((monthsDiff > 1) ? ' months ago' : ' month ago');   
    }

    else {
        const yearsDiff = Math.round(elapsed/sPerYear);
        return 'approximately ' + yearsDiff + ((yearsDiff > 1) ? ' years ago' : ' year ago');   
    }
}