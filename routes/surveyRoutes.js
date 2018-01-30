const _ = require('lodash');
const Path = require('path-parser');
const { URL } = require('url');
const requireAuth = require('../middlewares/requireAuth');
const requireCredits = require('../middlewares/requireCredits');
const mongoose = require('mongoose');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplates');

const Survey = mongoose.model('surveys');

module.exports = (app) => {
    app.get('/api/surveys', requireAuth, async (req, res) => {
        const surveys = await Survey.find({ _user: req.user.id }).select({
          recipients: false
        });
    
        res.send(surveys);
    });

    app.get('/api/surveys/:surveyId/:choice', (req, res) => {
        res.send('Thanks for voting!');
    });

    app.post('/api/survey/webhooks', (req, res) => {
        // const events = _.map(req.body, ({email, url})=>{
        //     const pathname = new URL(url).pathname;
        //     const p = new Path('/api/surveys/:surveyId/:choice');
        //     const match = p.test(pathname);  // {surveyId: dd, choice: dd}
        //     if(match){
        //         return {
        //             email: email,
        //             surveyId: match.surveyId,
        //             choice: match.choice };
        //     }
        // })

        // const compactEvents = _.compact(events); // remove undefined
        // const uniqueEvents = _.uniqBy(compactEvents, 'email', 'surveyId');

        const p = new Path('/api/surveys/:surveyId/:choice');        
        _.chain(req.body)
        .filter(value => !!value.url)
        .map(({url, email})=>{
            const match = p.test(new URL(url).pathname);  // {surveyId: dd, choice: dd}
            if(match){
                return {
                    email: email,
                    surveyId: match.surveyId,
                    choice: match.choice };
            }
        })
        .compact()
        .uniqBy('email', 'surveyId')
        .each( ({surveyId, email, choice}) =>{
            Survey.updateOne({
                _id: surveyId,
                recipients: {
                    $elemMatch: { email: email, responded: false}
                }
            }, {
                $inc: { [choice]: 1},
                $set: { 'recipients.$.responded': true},
                lastResponded: new Date()
            }).exec();
        })
        .value();
        
        res.send({});
    });

    app.post('/api/surveys', requireAuth, requireCredits, async (req, res) => {
        const { title, subject, body, recipients } = req.body;
        const survey = new Survey({
            title,
            subject,
            body,
            recipients: recipients.split(',').map(email => ({ email: email.trim() })),
            _user: req.user.id,
            dateSent: Date.now()
        });
        
        const mailer = new Mailer(survey, surveyTemplate(survey));

        try {
            await mailer.send();
            await survey.save();
            req.user.credits -= 1;
            const user = await req.user.save();
      
            res.send(user);
        } catch (err) {
            res.status(422).send(err);
        }
    });
};