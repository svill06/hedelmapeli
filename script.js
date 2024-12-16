const images = ["🍎", "🍐", "🍒", "🍉", "7️⃣"];
const payouts = {
    "7️⃣7️⃣7️⃣7️⃣": 10,
    "🍎🍎🍎🍎": 6,
    "🍉🍉🍉🍉": 5,
    "🍐🍐🍐🍐": 4,
    "🍒🍒🍒🍒": 3,
    "7️⃣7️⃣7️⃣": 5,
};

let balance = 100;
let reels = Array(4).fill(null);
let lockedReels = Array(4).fill(false);
let locksAllowed = true; 
let previousLocks = false; 

const balanceDisplay = document.getElementById("balance");
const playButton = document.getElementById("playButton");
const betInput = document.getElementById("bet");
const message = document.getElementById("message");
const reelElements = document.querySelectorAll(".reel");

function spinReels() {
    for (let i = 0; i < reels.length; i++) {
        if (!lockedReels[i]) {
            reels[i] = images[Math.floor(Math.random() * images.length)];
        }
        reelElements[i].textContent = reels[i];
    }
}

function checkWin(bet) {
    const result = reels.join("");
    for (const [pattern, multiplier] of Object.entries(payouts)) {
        if (result.includes(pattern)) {
            return bet * multiplier;
        }
    }
    return 0;
}

function resetLocks() {
    lockedReels.fill(false);
    reelElements.forEach((reel) => reel.classList.remove("locked"));
}

reelElements.forEach((reel) => {
    reel.addEventListener("click", () => {
        if (locksAllowed) {
            const index = parseInt(reel.getAttribute("data-index"));
            lockedReels[index] = !lockedReels[index];
            reel.classList.toggle("locked");
        }
    });
});

playButton.addEventListener("click", () => {
    const bet = parseInt(betInput.value);

    if (isNaN(bet) || bet < 1 || bet > 10) {
        message.textContent = "Aseta kelvollinen panos (1-10€).";
        return;
    }

    if (bet > balance) {
        message.textContent = "Ei tarpeeksi rahaa panokseen.";
        return;
    }

    balance -= bet;
    balanceDisplay.textContent = balance;

    spinReels();

    const winnings = checkWin(bet);
    if (winnings > 0) {
        balance += winnings;
        balanceDisplay.textContent = balance;
        message.textContent = `Voitit ${winnings}€!`;
    } else {
        message.textContent = ""; 
    }

    previousLocks = lockedReels.some((locked) => locked);

    if (previousLocks) {
        locksAllowed = false; 
        resetLocks(); 
    } else {
        locksAllowed = true; 
    }
});
