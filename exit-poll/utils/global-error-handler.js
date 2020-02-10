const ValidationErrorHandler = error => {
    const errors = Object.values(error.errors).map(el => el.message);
    const message = `Invalid Input Data :  ${errors.join('. ')}`;
    return new AppError(message, 400);
  };


const Errdev = function(err,res){
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
      });

};

const ErrProd = (err, res) => {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } else {
      console.log('ERROR:  ', err);
      res.status(500).json({
        status: 'error',
        message: 'something went wrong!!!'
      });
    }
  }; 


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    // console.log(err.message);
    // console.log(err);
    if(process.env.NODE_ENV === 'development'){
        Errdev(err,res);
    }else if(process.env.NODE_ENV === 'production'){
        if (err.name === 'ValidationError') err = ValidationErrorHandler(err);
        ErrProd(err, res);
    }
};
