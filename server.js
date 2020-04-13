const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const request = require('superagent');
require('dotenv').config();


var profile = require('./profile');

const PORT = process.env.PORT || 8080;
const app = express()

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/public', express.static('public'))

// defines the route that will use your custom router
app.use('/profile', profile)

// Here we're setting the view directory to be ./views
// thereby letting the app know where to find the template files
app.set('views', './views');


// Here we're settting the default engine to be ejs
// note we don't need to require it, express will do that for us
app.set('view engine', 'ejs');


// Now instead of using res.send we can use
// res.render to send the output of the template by filename 
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/projects', (req, res) => {
    res.render('projects');
});


const mailchimpInstance = 'us19';
const listUniqueId = 'ccf4ca277f';
const mailchimpApiKey = process.env.MC_API_KEY

app.post('/thanks', (req, res) => {

    request
        .post(`https://${mailchimpInstance}.api.mailchimp.com/3.0/lists/${listUniqueId}/members/`)
        .set('Content-Type', 'application/json;charset=utf-8')
        .set('Authorization', 'Basic ' + new Buffer('anystring:' + mailchimpApiKey).toString('base64'))
        .send({
            'email_address': req.body.email,
            'status': 'subscribed',
            'merge_fields': {
                'FNAME': req.body.firstName,
                'LNAME': req.body.lastName
            }
        })
        .end(function (err, response) {
            if (response.status < 300 || (response.status === 400)) {
                res.render('thanks', { contact: req.body });
                console.log('Success!', {contact: req.body})
            } else {
                res.send('Sign Up Failed :(');
            }
        });
});

app.listen(PORT, () => {
    console.log(`listening at http://localhost:${PORT}`);
});