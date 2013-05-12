function padZero(s, max) {
    str = s.toString() // just in case
    // Taken from
    // http://stackoverflow.com/questions/6466135/adding-extra-zeros-in-front-of-a-number-using-jquery
    return str.length < max ? padZero("0" + str, max) : str;
}
function padSpace(s, max) {
    str = s.toString() // just in case
    return str.length < max ? padSpace(" " + str, max) : str;
}
