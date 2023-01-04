import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'This is ChatGPT Ai App'
    })
})

// OPENAI API INTREGRATION
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


app.post('/', async (req, res) => {
    try{
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: req.body.input,
            temperature: 0, // how much accurate ans
            max_tokens: 4000, // how much length of ans 
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        // console.log('Passed: ', req.body.input);

        res.status(200).send({
            bot: response.data.choices[0].text
        });

    }catch(err) {
        // console.log('Failed: ', req.body.input);
        console.log(err);
        res.status(500).json({message: err});
    }
})

app.listen(4000, () => console.log('Server is running on port 4000'));
