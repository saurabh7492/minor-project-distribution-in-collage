

async  function checkAuthentication(req, res, next){
  if(req.isAuthenticated){
    return next();
  }
  return res.json(msg: 'Unauthorizzed');
}
Export checkAuthentication
