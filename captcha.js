document.addEventListener('DOMContentLoaded', function() {
    var captchaBox = document.getElementById('captcha-box');

    var questionBox = document.createElement('p');
    questionBox.id = 'question';
    questionBox.textContent = 'Loading CAPTCHA...'; 

    var answerInput = document.createElement('input');
    answerInput.type = 'text';
    answerInput.id = 'answer';
    answerInput.placeholder = 'Your answer';

    var submitButton = document.createElement('button');
    submitButton.id = 'submit-answer';
    submitButton.textContent = 'Submit Answer';

    var kiwiGIF = document.createElement('img');
    kiwiGIF.src = "https://kiwicaptcha.web.app/vibingBird.gif"
    kiwiGIF.id = "gif"

    var loadingTitle = document.createElement('p');
    loadingTitle.id = 'loadingTitle';
    loadingTitle.textContent = 'Checking you are human...'; // This will be replaced with the actual question

    var honeyPot = document.createElement('input');
    honeyPot.type = 'text';
    honeyPot.id = 'name';
    honeyPot.placeholder = 'Your name';

    var captchaBox = document.getElementById('captcha-box');

    captchaBox.appendChild(loadingTitle);
    captchaBox.appendChild(honeyPot);
    captchaBox.appendChild(kiwiGIF);
    captchaBox.appendChild(questionBox);
    captchaBox.appendChild(answerInput);
    captchaBox.appendChild(submitButton);
    loadingTitle.hidden = true
    kiwiGIF.hidden = true

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
      body {
        font-family: Arial, sans-serif;
      }
      
      #name{
        display: none;
      }

      #captcha-box {
        width: 300px;
        margin: 20px auto;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 7px;
        text-align: center;
      }
      
      #answer {
        margin-top: 10px;
        padding: 8px;
        width: calc(100% - 16px);
        border: 1px solid #ccc;
        border-radius: 4px;
      }
      
      #submit-answer {
        margin-top: 10px;
        padding: 8px 16px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      
      #gif{
        width: 100px;
      }

      #tick{
        width: 100px;
      }

      #submit-answer:hover {
        background-color: #0056b3;
      }
    `;
    document.head.appendChild(style);
  
// ----------------------------------------LOGIC STARTS HERE----------------------------------------//

    let sessionId = '';

    function startCaptchaSession() {
        fetch('https://us-central1-kiwicaptcha.cloudfunctions.net/startSession')
            .then(response => response.json())
            .then(data => {
                var questionBox = document.getElementById('question');

                sessionId = data.sessionId;
                questionBox.textContent = data.question;
            })
            .catch(error => {
                questionBox.textContent = 'Failed to load CAPTCHA.';
                console.error('Error:', error);
            });
    }

    function checkCaptchaAnswer() {

        questionBox.hidden = true
        submitButton.hidden = true
        answerInput.hidden = true
        loadingTitle.hidden = false
        kiwiGIF.hidden = false
        
        if(answerInput.value == ""){
          console.log("empty input")
          answerInput.value = " "
        }

        fetch('https://us-central1-kiwicaptcha.cloudfunctions.net/checkAnswer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionId, clientAnswer: answerInput.value})
        })
        .then(response => response.json())
        .then(data => {
            answerInput.value = ""
            if (data.correct && honeyPot.value == "") {
                // alert('CAPTCHA answer is correct!');
                window.parent.postMessage({
                    type: 'CAPTCHA_VERIFIED',
                    verified: true
                }, '*'); 

                questionBox.hidden = true
                submitButton.hidden = true
                answerInput.hidden = true

                var loadingTitle = document.getElementById('loadingTitle');
                loadingTitle.textContent = 'Verified!'; 
        
                var tick = document.createElement('img');
                tick.src = "https://kiwicaptcha.web.app/tick.gif"
                tick.id = "tick"
                
                captchaBox.appendChild(tick);

                var kiwiGIF = document.getElementById('gif');

                kiwiGIF.hidden = true

            } else {
                
                questionBox.hidden = false
                submitButton.hidden = false
                answerInput.hidden = false

                var loadingTitle = document.getElementById('loadingTitle');
                var kiwiGIF = document.getElementById('gif');

                loadingTitle.hidden = true
                kiwiGIF.hidden = true

                startCaptchaSession();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    submitButton.addEventListener('click', function() {
        checkCaptchaAnswer();
    });

    startCaptchaSession();
});
