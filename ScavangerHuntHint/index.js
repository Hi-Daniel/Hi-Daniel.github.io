async function sha256(message) {
	const msgBuffer = new TextEncoder().encode(message);
	const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
	return hashHex;
}

const correctHash = "e7866fdc6672f827c76f6124ca3eeaff44aff8b7caf4ee1469b2ab887e7e7875"
const answer_input = document.getElementById("answer");

async function checkAnswer() {
    let input = answer_input.value;
    answer_input.value = "";
    input = input.trim();
    if (input === "") {
        return;
    }
    if (input.length > 10) {
        return;
    }
    let hash = await sha256(input);
    if (hash === correctHash) {
        alert("Correct! Say to Edgar in a menacing voice: `What have you done Edgar?` 😡");
    }
    else {
        alert("Incorrect, try again.");
    }
    console.log(input, hash);
}

document.getElementById("submit").addEventListener("click", checkAnswer);
answer_input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        checkAnswer();
    }
});