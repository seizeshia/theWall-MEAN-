var controller = require('./../controllers/controller')

module.exports = (app) =>{
  app.get('/', controller.index)
  app.get('/refresh', controller.refresh)
  app.post('/logreg', controller.logreg)
  app.post('/posting', controller.posting)
  app.post('/commenting', controller.commenting)
  app.post('/liking', controller.liking)
  app.get('/logout', controller.logout)
  app.get('/checker',controller.checker)
  app.post('/commentliking', controller.commentliking)
  app.post('/grabmessage', controller.grabmessage)
  app.get('/getusername', controller.getusername)
}
