function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function shuffle(word) {
    return word.split('').sort(() => Math.random() - 0.5);
}
