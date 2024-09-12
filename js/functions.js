/**
 *for drawing rotated image
 */
function drawRotatedImage(img, sx, sy, sW, sH, dx, dy, dW, dH, rotation) {
    ctx.save();
    
    ctx.translate(dx, dy);
    ctx.rotate(rotation);
    
    ctx.drawImage(img, sx, sy, sW, sH, -(dW / 2), -(dH / 2), dW, dH);
    
    ctx.restore();
}

/**
 * for playing sfx
 */
function playSFX(sfxType) {
    if (sfxType === "Hit") {
        if (sfxHitNum === 1) {
            sfxHit1.pause();
            sfxHit1.currentTime = 0;
            
            sfxHit1.play();
        } else if (sfxHitNum === 2) {
            sfxHit2.pause();
            sfxHit2.currentTime = 0;
            
            sfxHit2.play();
        }
    } else if (sfxType === "End") {
        if (sfxEndNum === 1) {
            sfxEnd1.pause();
            sfxEnd1.currentTime = 0;

            sfxEnd1.play();
        }
    }
}

/**
 *for showing title screen
 */
function titleScreen() {
    if (explainTextLanguage === "Kr") {
        explainText.innerHTML = `
        <b>
            소나기를 피해 정자에 들어가듯이<br>
            호흡명상을 통해 괴로움의 비를 피한다.<br>
            <br>
            정자에 서서 내리는 비를 바라보는 것처럼<br>
            괴로움 밖에서 고요히 괴로움을 관찰하라.<br>
            <br>
            그대는 곧 자유가 될 것이다!
        </b>
        `;
    } else if (explainTextLanguage === "En") {
        explainText.innerHTML = `
        <b>
            Like going into the pavilion to escape the rain, <br>
            avoid the rain of distress through breathing meditation.<br>
            <br>
            Like standing in the pavilion watching the rain, <br>
            observe the suffering silently outside the suffering.<br>
            <br>
            You will soon be free!
        </b>
        `;
    }

    inhaleTimeInput.onchange = () => {
        /* check if inhaleTimeInput's value is bigger than 0 */
        if (parseFloat(inhaleTimeInput.value) > 0) {
            /* set the inhaleTime as inhaleTimeInput's value */
            inhaleTime = parseFloat(inhaleTimeInput.value) * 1000;
        }
        
        /* reset the inhaleTimeInput's value as inhaleTime */
        inhaleTimeInput.value = inhaleTime / 1000;
    }

    exhaleTimeInput.onchange = () => {
        /* check if exhaleTimeInput's value is bigger than 0 */
        if (parseFloat(exhaleTimeInput.value) > 0) {
            /* set the exhaleTime as exhaleTimeInput's value */
            exhaleTime = parseFloat(exhaleTimeInput.value) * 1000;
        }
        
        /* reset the exhaleTimeInput's value as exhaleTime */
        exhaleTimeInput.value = exhaleTime / 1000;
    }

    startButton.onclick = () => {
        timeDifference = 0;
        mainScreenState = "start";
        sfxCircleDirection = "down";

        circleObj.push(new circle);

        isStarted = true;

        sfxHit1.volume = parseFloat(volumeInput.value) / 100;
        sfxHit1.volume = parseFloat(volumeInput.value) / 100;
        sfxEnd1.volume = parseFloat(volumeInput.value) / 100;
    }
}

/**
 *for showing main screen
 */
function mainScreen() {
    resumeButton.onclick = () => {
        startTime = timeStamp - timeDifference;

        if (mainScreenState === "end") {
            startTime = timeStamp;

            doneSets = 0;
            doneReps = 0;
        }

        mainScreenState = "resume";
    }
    
    setsInput.onchange = () => {
        /* check if setsInput's value (INT) is bigger than doneSets */
        if (parseInt(setsInput.value) > doneSets) {
            /* set the setSets as setsInput's value (INT) */
            setSets = parseInt(setsInput.value);
        }

        /* reset the setsInput's value as setSets */
        setsInput.value = setSets;
    }

    repsInput.onchange = () => {
        /* check if repsInput's value (INT) is bigger than doneReps */
        if (parseInt(repsInput.value) > doneReps) {
            /* set the setReps as repsInput's value (INT) */
            setReps = parseInt(repsInput.value);
        }

        /* reset the repsInput's value as setReps */
        repsInput.value = setReps;
    }

    /* play sfx */
    if (doneSets >= setSets) {
        if (mainScreenState !== "end") {
            playSFX("End");
        }

        mainScreenState = "end";

        sfxCircleDirection = "down"
    } else if (mainScreenState === "resume") {
        if (sfxCircleDirection === "down" && elapsed <= inhaleTime - 250) {
            playSFX("Hit");
    
            sfxCircleDirection = "up";
        } else if (sfxCircleDirection === "up" && 
                   inhaleTime - 100 < elapsed && elapsed <= inhaleTime + exhaleTime - 250) {
            playSFX("Hit");
    
            sfxCircleDirection = "down";
        }
    }    

    /* draw board */
    boardWidth = unit * 2.5;
    boardHeight = unit * 0.25;
    boardHight = unit;

    if (!isSVG) {
        ctx.fillStyle = "#76CBE5";
    
        ctx.fillRect(canvas.width / 2 - boardWidth / 2, boardHight, boardWidth, boardHeight);
        ctx.fillRect(canvas.width / 2 - boardWidth / 2, canvas.height - boardHight - boardHeight, boardWidth, boardHeight);
    } else {
        drawRotatedImage(boardImg, 0, 0, boardImg_X_Size, boardImg_Y_Size,
                         canvas.width / 2, boardHight + boardHeight / 2,
                         boardWidth, boardHeight,
                         0);

        drawRotatedImage(boardImg, 0, 0, boardImg_X_Size, boardImg_Y_Size,
                         canvas.width / 2, canvas.height - boardHight - boardHeight / 2,
                         boardWidth, boardHeight,
                         Math.PI);
    }

    // TODO : fix circle rotation bug when it pauses
    //        add korean version of explain with button
    //        add 'mainScreenState' and 'timeDifference' to Debug Text

    /* update circle */
    for (let i = 0; i < circleObj.length; i++) {
        ctx.globalAlpha = circleObj[i].alpha;

        circleObj[i].draw();
        
        /* check if sets are NOT done */
        circleObj[i].x = canvas.width / 2;

        circleObj[i].radius = unit / 4;

        if (mainScreenState === "resume") {
            circleObj[i].move();
        } else if (mainScreenState === "start" || mainScreenState === "end") {
            startTime = timeStamp;

            circleObj[i].y = canvas.height - boardHight - boardHeight - circleObj[i].radius;
        }

        if (circleObj[i].alpha <= 0) {
            circleObj.splice(i, 1);
        }
    }

    ctx.globalAlpha = 1;

    /* set SetsAndRepsText's text as "'doneSets' Sets | Enter | 'doneReps' Reps" */
    SetsAndRepsText.innerText = `${doneSets} Sets\n${doneReps} Reps`;

    pauseButton.onclick = () => {
        timeDifference = timeStamp - startTime;

        mainScreenState = "pause";
    }

    backButton.onclick = () => {
        circleObj = [];

        isStarted = false;
    
        doneSets = 0;
        doneReps = 0;
    }
}

/**
 *for setting UI
 */
function setUI() {
    /* move UI */
    if (canvas.width < canvas.height) {
        /* for phone */
        /* title screen */
        titleText.style.fontSize = "8vw";
        titleTextSub.style.fontSize = "4vw";

        if (explainTextLanguage === "Kr") {
            explainText.style.transform = "translate(-40%, -50%)";
            explainText.style.width = "60vw";
        } else if (explainTextLanguage == "En") {
            explainText.style.transform = "translate(-50%, -50%)";
            explainText.style.width = "82.5vw";
        }
        
        explainText.style.fontSize = "3vw";

        inhaleTimeText.style.top = "calc(55vh - 4vw)";
        inhaleTimeText.style.fontSize = "4vw";

        exhaleTimeText.style.top = "calc(55vh - 4vw)";
        exhaleTimeText.style.fontSize = "4vw";

        inhaleTimeInput.style.top = "calc(55vh + 4vw)";
        inhaleTimeInput.style.fontSize = "4vw";
        inhaleTimeInput.style.width = "16vw";
        inhaleTimeInput.style.height = "8vw";
        inhaleTimeInput.style.borderRadius = "4vw";

        exhaleTimeInput.style.top = "calc(55vh + 4vw)";
        exhaleTimeInput.style.fontSize = "4vw";
        exhaleTimeInput.style.width = "16vw";
        exhaleTimeInput.style.height = "8vw";
        exhaleTimeInput.style.borderRadius = "4vw";

        volumeText.style.top = "calc(70vh - 2vw)";
        volumeText.style.fontSize = "4vw";

        volumeInput.style.top = "calc(70vh + 2vw)";
        volumeInput.style.fontSize = "4vw";
        volumeInput.style.borderRadius = "4vw";

        startButton.style.fontSize = "6vw";
        startButton.style.width = "24vw";
        startButton.style.height = "12vw";
        startButton.style.borderRadius = "4vw";

        /* main screen */
        setsText.style.top = `calc(${boardHight * 0.5}px - 3vw)`;
        setsText.style.left = `calc(50vw - ${boardWidth / 2 * 0.75}px)`;
        setsText.style.fontSize = "3vw";

        repsText.style.top = `calc(${boardHight * 0.5}px - 3vw)`;
        repsText.style.fontSize = "3vw";

        setsInput.style.top = `calc(${boardHight * 0.5}px + 3vw)`;
        setsInput.style.left = `calc(50vw - ${boardWidth / 2 * 0.75}px)`;
        setsInput.style.fontSize = "3vw";
        setsInput.style.width = "12vw";
        setsInput.style.height = "6vw";
        setsInput.style.borderRadius = "3vw";

        repsInput.style.top = `calc(${boardHight * 0.5}px + 3vw)`;
        repsInput.style.fontSize = "3vw";
        repsInput.style.width = "12vw";
        repsInput.style.height = "6vw";
        repsInput.style.borderRadius = "3vw";

        SetsAndRepsText.style.top = `${boardHight * 0.5}px`;
        SetsAndRepsText.style.left = `calc(50vw + ${boardWidth / 2 * 0.75}px)`;
        SetsAndRepsText.style.fontSize = "4vw";
        
        resumeButton.style.top = `${canvas.height - boardHight * 0.5}px`
        resumeButton.style.left = `calc(50vw - ${boardWidth / 2 * 0.5}px)`;
        resumeButton.style.fontSize = "3vw";
        resumeButton.style.width = "12vw";
        resumeButton.style.height = "6vw";
        resumeButton.style.borderRadius = "1vw";
        
        pauseButton.style.top = `${canvas.height - boardHight * 0.5}px`
        pauseButton.style.left = `calc(50vw - ${boardWidth / 2 * 0.5}px)`;
        pauseButton.style.fontSize = "3vw";
        pauseButton.style.width = "12vw";
        pauseButton.style.height = "6vw";
        pauseButton.style.borderRadius = "1vw";

        backButton.style.top = `${canvas.height - boardHight * 0.5}px`
        backButton.style.left = `calc(50vw + ${boardWidth / 2 * 0.5}px)`;
        backButton.style.fontSize = "4.5vw";
        backButton.style.width = "12vw";
        backButton.style.height = "6vw";
        backButton.style.borderRadius = "1vw";
    } else {
        /* for not phone */
        /* title screen */
        titleText.style.fontSize = "3vw";
        titleTextSub.style.fontSize = "1.5vw";

        if (explainTextLanguage === "Kr") {
            explainText.style.transform = "translate(-40%, -50%)";
            explainText.style.fontSize = "1.125vw";
            explainText.style.width = "22.5vw"
        } else if (explainTextLanguage == "En") {
            explainText.style.transform = "translate(-50%, -50%)";
            explainText.style.fontSize = "1vw";
            explainText.style.width = "27.5vw";
        }

        inhaleTimeText.style.top = "calc(55vh - 1.5vw)";
        inhaleTimeText.style.fontSize = "1.5vw";

        exhaleTimeText.style.top = "calc(55vh - 1.5vw)";
        exhaleTimeText.style.fontSize = "1.5vw";

        inhaleTimeInput.style.top = "calc(55vh + 1.5vw)";
        inhaleTimeInput.style.fontSize = "1.5vw";
        inhaleTimeInput.style.width = "6vw";
        inhaleTimeInput.style.height = "3vw";
        inhaleTimeInput.style.borderRadius = "3vw";

        exhaleTimeInput.style.top = "calc(55vh + 1.5vw)";
        exhaleTimeInput.style.fontSize = "1.5vw";
        exhaleTimeInput.style.width = "6vw";
        exhaleTimeInput.style.height = "3vw";
        exhaleTimeInput.style.borderRadius = "1.5vw";

        volumeText.style.top = "calc(70vh - 0.75vw)";
        volumeText.style.fontSize = "1.5vw";

        volumeInput.style.top = "calc(70vh + 0.75vw)";
        volumeInput.style.fontSize = "1.5vw";
        volumeInput.style.borderRadius = "1.5vw";

        startButton.style.fontSize = "2.25vw";
        startButton.style.width = "9vw";
        startButton.style.height = "4.5vw";
        startButton.style.borderRadius = "1.5vw";

        /* main screen */
        setsText.style.top = `calc(${boardHight * 0.5}px - 1.125vw)`;
        setsText.style.left = `calc(50vw - ${boardWidth / 2 * 0.75}px)`;
        setsText.style.fontSize = "1.125vw";

        repsText.style.top = `calc(${boardHight * 0.5}px - 1.125vw)`;
        repsText.style.fontSize = "1.125vw";
        
        setsInput.style.top = `calc(${boardHight * 0.5}px + 1.125vw)`;
        setsInput.style.left = `calc(50vw - ${boardWidth / 2 * 0.75}px)`;
        setsInput.style.fontSize = "1.125vw";
        setsInput.style.width = "4.5vw";
        setsInput.style.height = "2.25vw";
        setsInput.style.borderRadius = "1.125vw";
        
        repsInput.style.top = `calc(${boardHight * 0.5}px + 1.125vw)`;
        repsInput.style.fontSize = "1.125vw";
        repsInput.style.width = "4.5vw";
        repsInput.style.height = "2.25vw";
        repsInput.style.borderRadius = "1.125vw";
        
        SetsAndRepsText.style.top = `${boardHight * 0.5}px`;
        SetsAndRepsText.style.left = `calc(50vw + ${boardWidth / 2 * 0.75}px)`;
        SetsAndRepsText.style.fontSize = "1.5vw";
        
        resumeButton.style.top = `${canvas.height - boardHight * 0.5}px`
        resumeButton.style.left = `calc(50vw - ${boardWidth / 2 * 0.5}px)`;
        resumeButton.style.fontSize = "1.125vw";
        resumeButton.style.width = "4.5vw";
        resumeButton.style.height = "2.25vw";
        resumeButton.style.borderRadius = "0.375vw";
        
        pauseButton.style.top = `${canvas.height - boardHight * 0.5}px`
        pauseButton.style.left = `calc(50vw - ${boardWidth / 2 * 0.5}px)`;
        pauseButton.style.fontSize = "1.125vw";
        pauseButton.style.width = "4.5vw";
        pauseButton.style.height = "2.25vw";
        pauseButton.style.borderRadius = "0.375vw";
        
        backButton.style.top = `${canvas.height - boardHight * 0.5}px`
        backButton.style.left = `calc(50vw + ${boardWidth / 2 * 0.5}px)`;
        backButton.style.fontSize = "1.6875vw";
        backButton.style.width = "4.5vw";
        backButton.style.height = "2.25vw";
        backButton.style.borderRadius = "0.375vw";
    }
    
    /* set visibility of UI */
    if (isStarted) {
        /* started */
        /* title screen */
        titleText.style.visibility = "hidden";
        titleTextSub.style.visibility = "hidden";

        explainText.style.visibility = "hidden";

        inhaleTimeText.style.visibility = "hidden";
        exhaleTimeText.style.visibility = "hidden";
        inhaleTimeInput.style.visibility = "hidden";
        exhaleTimeInput.style.visibility = "hidden";

        volumeText.style.visibility = "hidden";
        volumeInput.style.visibility = "hidden";

        startButton.style.visibility = "hidden";

        /* main screen */
        if (mainScreenState === "resume") {
            resumeButton.style.visibility = "hidden";
            pauseButton.style.visibility = "visible";
        } else {
            resumeButton.style.visibility = "visible";
            pauseButton.style.visibility = "hidden";
        }

        backButton.style.visibility = "visible";

        setsText.style.visibility = "visible";
        repsText.style.visibility = "visible";
        setsInput.style.visibility = "visible";
        repsInput.style.visibility = "visible";
        SetsAndRepsText.style.visibility = "visible";

        setsText.style.color = "black";
        repsText.style.color = "black";
    } else {
        /* stopped */
        /* title screen */
        titleText.style.visibility = "visible";
        titleTextSub.style.visibility = "visible";
        
        explainText.style.visibility = "visible";

        inhaleTimeText.style.visibility = "visible";
        exhaleTimeText.style.visibility = "visible";
        inhaleTimeInput.style.visibility = "visible";
        exhaleTimeInput.style.visibility = "visible";

        volumeText.style.visibility = "visible";
        volumeInput.style.visibility = "visible";
    
        startButton.style.visibility = "visible";
    
        /* main screen */
        resumeButton.style.visibility = "hidden";
        pauseButton.style.visibility = "hidden";
        backButton.style.visibility = "hidden";

        setsText.style.visibility = "hidden";
        repsText.style.visibility = "hidden";
        setsInput.style.visibility = "hidden";
        repsInput.style.visibility = "hidden";
        SetsAndRepsText.style.visibility = "hidden";

        titleText.style.color = "black";

        inhaleTimeText.style.color = "black";
        exhaleTimeText.style.color = "black";
    }
}

/**
*for showing debug text
*/
function showDebugText() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "start";

    /* show values */    
    ctx.fillText(`Canvas Width : ${canvas.width}`, 10, 200);
    ctx.fillText(`Canvas Height : ${canvas.height}`, 10, 220);

    ctx.fillText(`timeStamp : ${timeStamp}`, 10, 260);
    ctx.fillText(`startTime : ${startTime}`, 10, 280);
    ctx.fillText(`elapsed : ${elapsed}`, 10, 300);

    ctx.fillText(`isSVG : ${isSVG}`, 10, 340);

    ctx.fillText(`isStarted : ${isStarted}`, 10, 380);

    ctx.fillText(`inhaleTime : ${inhaleTime}`, 10, 420);
    ctx.fillText(`exhaleTime : ${exhaleTime}`, 10, 440);
    ctx.fillText(`setSets : ${setSets}`, 10, 460);
    ctx.fillText(`setReps : ${setReps}`, 10, 480);

    ctx.fillText(`doneSets : ${doneSets}`, 10, 520);
    ctx.fillText(`doneReps : ${doneReps}`, 10, 540);

    if (circleObj[0] !== undefined) {
        ctx.fillText(`circleObj[0].x : ${circleObj[0].x}`, 10, 580);
        ctx.fillText(`circleObj[0].y : ${circleObj[0].y}`, 10, 600);
        ctx.fillText(`circleObj[0].radius : ${circleObj[0].radius}`, 10, 620);
        ctx.fillText(`circleObj[0].alpha : ${circleObj[0].alpha}`, 10, 640);
    }

    ctx.fillText(`sfx1.volume : ${cirlce_sfx1.volume}`, 10, 680);

    ctx.fillText(`sfxCircleDirection : ${sfxCircleDirection}`, 10, 720);
}