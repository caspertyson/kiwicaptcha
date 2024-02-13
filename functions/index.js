const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors')({origin: true});

admin.initializeApp();

const db = admin.firestore();

async function getRandomDocument() {
  const kiwiQuestionsRef = db.collection('kiwiQuestions');
  
  const snapshot = await kiwiQuestionsRef.get();
  const docCount = snapshot.size;

  const randomIndex = Math.floor(Math.random() * docCount);

  const randomDoc = await kiwiQuestionsRef.orderBy('__name__').offset(randomIndex).limit(1).get();

  if (!randomDoc.empty) {
    return randomDoc.docs[0].data();
  } else {
    throw new Error('No document found');
  }
}

exports.startSession = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
    let question
    let answer

    // Example usage:
    await getRandomDocument().then(doc => {
        console.log('Random document:', doc);
        question = doc.question
        answer = doc.answer
    }).catch(err => {
        console.error('Error getting random document:', err);
    });
  
    const sessionId = uuidv4();
    // const question = "What is 2 + 2?"; 
    // const answer = "4"; 

    try {
        await admin.firestore().collection('captchaSessions').doc(sessionId).set({
        answer: answer, 
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        response.set('Access-Control-Allow-Origin', '*'); 

        response.json({ sessionId, question });
    } catch (error) {
        console.error('Error starting new session:', error);
        response.status(500).send('Error starting new session');
    }
    });
});

exports.checkAnswer = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {

        const { sessionId, clientAnswer } = request.body;
    
        if (!sessionId || !clientAnswer) {
            return response.status(400).send('Session ID and answer are required');
        }
    
        try {
            const sessionRef = admin.firestore().collection('captchaSessions').doc(sessionId);
            const sessionDoc = await sessionRef.get();
    
            if (!sessionDoc.exists) {
                return response.status(404).send('Session not found.');
            }
            if(sessionDoc.used == true){
                return response.status(404).send('Session already used.');
            }

            // Check session not older than 60 seconds
            const createdAtDate = sessionDoc.data().createdAt.toDate();
            const now = new Date();            
            const differenceInMinutes = (now - createdAtDate) / 60000; 
            if (differenceInMinutes > 1) {
                return response.status(404).send('Session is too old.');
            }

            // check answer is correct and set used = true
            const sessionData = sessionDoc.data();
            const isCorrect = sessionData.answer.toLowerCase() === clientAnswer.toLowerCase(); 
            await sessionRef.update({ used: true });

            response.set('Access-Control-Allow-Origin', '*'); 
            response.json({ correct: isCorrect });
        } catch (error) {
            console.error('Error checking answer:', error);
            response.status(500).send('Error checking answer');
        }
    });
});