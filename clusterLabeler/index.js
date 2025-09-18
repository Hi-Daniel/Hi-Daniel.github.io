// ======== SETTINGS ========

question_times = [ 7.0, 36.0, 45.0, 81.0, 118.0, 155.0, 167.0, 197.0, 205.0, 
    237.0, 257.0, 266.0,286.0,338.0, 380.0, 402.0, 410.0, 416.0,466.0,505.0,
    521.0, 542.0, 591.0, 596.0, 602.0, 671.0, 705.0,
];// Times in seconds where questions will be asked


mode_categories = [
["1) Orient & Navigate","The inspector is mainly moving to view a part of the bridge or positioning themselves for a better view (e.g., under a span, along a girder, toward a connection). Not trying to judge a specific spot yet."],
["2) Global Scan","The inspector is taking in a broad region (several girders, a bay, a pier, a deck area) to look for possible issues. Attention sweeps across parts. No single small spot holds attention for long."],
["3) Local Inspection","The inspector is looking closely at one specific place on the bridge (a crack on a girder web, corrosion at a connection, a spall near a bearing). Attention stays on that one spot to understand it."],
["4) Not inspecting/ Disengaged","No active bridge inspection. Examples: pausing without a clear target, handling menus, looking somewhere not relevant to the bridge."],
]


class QuestionContainer {
    constructor(question_container) {
        this.question_container = question_container;
        this._showing_question = false;
        this.message_queue = [];
    }

    get showing_question() {
        return this._showing_question;
    }

    OnUpdate() {
        if (this.message_queue.length > 0 && !this._showing_question) {
            this.show_next_message();
        }
    }

    add_message(msg) {
        this.message_queue.push(msg);
    }

    show_message(msg) {
        this._showing_question = true;
        this.question_container.innerHTML = '';
        this.question_container.style.display = 'block';
        this.question_container.style.width = video.clientWidth + 'px';
        this.question_container.style.height = video.clientHeight + 'px';
        this.question_container.appendChild(msg);
        return this._showing_question
    }
    hide_message() {
        this.question_container.innerHTML = '';
        this.question_container.style.display = 'none';
        this._showing_question = false;
    }
    show_next_message() {
        this.show_message(this.message_queue.shift());
    }
}

// ==========GLOBALS=========
const EPSILON = 0.08;
const ATTENTION_WAIT_TIME = 2.0; // Attention indicator turns on this many seconds before question
const BEFORE_PADDING = 8.0; // video is set to normal speed this many seconds before question
const AFTER_PADDING = 1.0; // seconds to wait after question before speeding up
answers = Array(question_times.length).fill(null);
save_filename = 'answers.json';
user_number = 1;
user_answers = {};
const current_question = { 
    _value: 0,
    set value(val) {
        this._value = val;
        question_num.innerHTML = `Question: ${this._value+1}/${question_times.length}`;
    },
    get value() {
        return this._value;
    }
};
_showing_question = false;

// ==========DOM Components=========
video = document.getElementById('video');
question_container = new QuestionContainer(document.getElementById('question_container'));
question_num = document.getElementById('question_num');

// Adding event listeners to the buttons
document.getElementById('user_number').addEventListener('change', (e) => {
    user_number = e.target.value;
});
document.getElementById('file_select').addEventListener('change', (e) => {
    video.src = URL.createObjectURL(e.target.files[0]);
});
document.getElementById('save_filename').addEventListener('change', (e) => {
    temp_save_filename = e.target.value;
    // Check if filename is valid
    if (/^[a-zA-Z0-9-_\.]+$/.test(temp_save_filename)) {
        save_filename = temp_save_filename;
        if (!save_filename.endsWith('.json')) {
            save_filename += '.json';
        }
    } else {
        console.error('Invalid filename. Using: ' + save_filename);
        save_filename = 'answers.json';
    }
    document.getElementById('save_filename').value = save_filename;
});
document.getElementById('save_file').addEventListener('click', () => {
    save_answers();
});
video.addEventListener('dragged', () => {
    get_current_question();
});
document.addEventListener('DOMContentLoaded', () => {
    timeline = [0, ...question_times, video.duration];
    current_question.value = 0;
});


function update() {
    next_question = current_question.value + 1;
    timeline = [0, ...question_times];

    // check if video falls within current question time range otherwise update current question
    if (video.currentTime < timeline[current_question.value] ||
        video.currentTime >= timeline[next_question] + EPSILON) {
            get_current_question();
    }

    // If video is within the wait time for the next question then speed up video
    if (video.currentTime >= timeline[current_question.value] && 
        video.currentTime < timeline[current_question.value] + EPSILON + AFTER_PADDING) {
            // video should be normal speed but indicator turned off
            show_attention_indicator(false);
            return;
        }
        else if (video.currentTime < timeline[next_question] - EPSILON - BEFORE_PADDING) {
                // video must now be sped up
                set_video_speed("fast");
                return;
            }
        else if (video.currentTime < timeline[next_question] - ATTENTION_WAIT_TIME) {
            // video should be normal speed
            set_video_speed("normal");
            return;
        }
        else if (video.currentTime < timeline[next_question] - EPSILON) {
            // turn on attention indicator
            show_attention_indicator(true);
            return;
        }
        else if (video.currentTime < timeline[next_question] + EPSILON) {
            video.pause();
            while (!video.paused) {
                wait(10);
            }
            if (question_container.showing_question) return;
            show_question();
        }
        else {
            get_current_question();
        }
}

function set_video_speed(speed) {
    fast_speed = 4.0;
    normal_speed = 1.0;
    function show_speed_up(speed, duration=750) {
        msg_container = document.createElement('div');
        msg_container.style = 'display: flex; flex-direction: row; align-items: center; justify-content: center; height: 100%;';
        msg_container.innerHTML = `<div class="speed_up">${speed}x</div>`;
        question_container.add_message(msg_container);
        new Promise(resolve => setTimeout(resolve, 750)).then(() => {
            question_container.hide_message();
        });
    }
    if (speed == "fast" && video.playbackRate != fast_speed) {
        video.playbackRate = fast_speed;
        show_speed_up(fast_speed, 500);        
    }
    else if (speed == "normal" && video.playbackRate != normal_speed) {
        video.playbackRate = normal_speed;
        show_speed_up(normal_speed, 750);
    }
}

function show_attention_indicator(show) {
    video.style.boxShadow = show 
        ? '0 0 40px 20px rgba(255,0,0,0.7), 0 0 10px 10px rgba(255,0,0,0.3)' 
        : 'none';
    return;
}

function select_answer(answer, confidence) {
    answers[current_question.value] = [answer, confidence];
    current_question.value = current_question.value + 1;
    question_container.hide_message();
    console.log("Selected answer: " + answer + " for question " + (current_question.value-1));
    video.currentTime = timeline[current_question.value] + EPSILON;
    video.play();
}

function get_current_question() {
    current_question.value = 0;
    while (timeline[current_question.value+1] < video.currentTime) {
        current_question.value += 1;
    }
}

function show_question() {
    msg_container = document.createElement('div');
    // add header
    question_header_container = document.createElement('div');
    question_header_container.className = 'question_header';
    question_header_container.innerHTML = '<h2>What was the primary behavior of the person in the last second</h2>';
    msg_container.appendChild(question_header_container);
    // add confidence selector
    confidence_container = document.createElement('div');
    confidence_container.style = 'display: flex; flex-direction: row; align-items: center; gap: 1rem; width: 100%;';
    confidence_slider = document.createElement('input');
    confidence_slider.type = 'range';
    confidence_slider.min = 0;
    confidence_slider.max = 100;
    confidence_slider.value = 50;
    confidence_slider.id = 'confidence_slider';
    label1 = document.createElement('div');
    label1.className = 'confidence_label';
    label1.innerHTML = 'Low Confidence';
    label2 = document.createElement('div');
    label2.className = 'confidence_label';
    label2.innerHTML = 'High Confidence';
    confidence_container.appendChild(label1);
    confidence_container.appendChild(confidence_slider);
    confidence_container.appendChild(label2);
    msg_container.appendChild(confidence_container);
    // add question buttons
    buttons_grid = document.createElement('div');
    buttons_grid.className = 'buttons_grid';
    for (const category of mode_categories) {
        const button = document.createElement('div');
        button.className = 'button';
        button.onclick = () => select_answer(category[0], parseFloat(confidence_slider.value)/100.0);
        button.innerHTML = `
            <h3>${category[0]}</h3>
            <p>${category[1]}</p>
        `;
        buttons_grid.appendChild(button);
    }
    // add other button
    other_button = document.createElement('div');
    other_button.className = 'button';
    other_button.onclick = () => {
        show_add_category();
        question_container.show_next_message();
    };
    other_button.innerHTML = '<h3>Other</h3>';
    buttons_grid.appendChild(other_button);
    // add go back button
    go_back_button = document.createElement('div');
    go_back_button.className = 'button';
    go_back_button.onclick = () => {
        question_container.hide_message();
        console.log("Going back to: " + timeline[current_question.value] + " and current question: " + current_question.value);
        video.currentTime = timeline[current_question.value];
        video.play();
    };
    go_back_button.innerHTML = '<h3>Go back</h3>';
    buttons_grid.appendChild(go_back_button);
    msg_container.appendChild(buttons_grid);
    question_container.add_message(msg_container);
}

function show_add_category() {
    msg_container = document.createElement('div');
    msg_container.style = 'display: flex; flex-direction: column; align-items: center; gap: 1rem;';
    question_header_container = document.createElement('div');
    question_header_container.className = 'question_header';
    question_header_container.innerHTML = '<h2>Add a new category</h2>';
    msg_container.appendChild(question_header_container);
    // add category name input
    name_input = document.createElement('input');
    name_input.type = 'text';
    name_input.placeholder = 'Category name';
    name_input.id = 'add_category_input';
    msg_container.appendChild(name_input);
    // add category description input
    description_input = document.createElement('textarea');
    description_input.rows = 4;
    description_input.placeholder = 'Category description';
    description_input.id = 'add_category_description_input';
    msg_container.appendChild(description_input);
    // add save button
    save_button = document.createElement('button');
    save_button.className = 'save_button';
    save_button.innerHTML = 'Save';
    save_button.onclick = () => {
        add_category(name_input.value, description_input.value);
        show_question();
        question_container.show_next_message();
    };
    msg_container.appendChild(save_button);
    question_container.add_message(msg_container);
}

function add_category(name, description) {
    if (name.trim() != '' || description.trim() != '') {
        mode_categories.push([name, description]);
    }
}


function save_answers() {
    console.log("Saving answers to... " + save_filename);
    user_answers = {};
    user_answers["user_number"] = user_number;
    user_answers["question_times"] = question_times;
    user_answers["mode_categories"] = mode_categories;
    user_answers["video_evaluated"] = video.currentSrc;
    user_answers["answers"] = answers;

    var blob = new Blob([JSON.stringify(user_answers)], {type: 'application/json'});
    console.log(blob);
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = save_filename;
    a.click();
    URL.revokeObjectURL(url);
}


setInterval(update, 100);
setInterval(() => question_container.OnUpdate(), 100);

// Save answers when closing or reloading the window -- a bit annoying when trying to debug
// window.addEventListener('beforeunload', (e) => {
//     e.preventDefault();
//     save_answers();
// });

// video.play();
