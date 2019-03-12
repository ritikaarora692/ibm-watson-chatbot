
var  nodemailer  =  require('nodemailer');
var  transporter  =  nodemailer.createTransport({
    service:  'gmail',
    auth:  {
        user:  'nagpchatbot@gmail.com',
        pass:  'nagpchatbot2017'
    }
});

var  emailSender  =  {
    sendEmailForTestBooking:  function  (name,  email,  testName,  date,  time) {
        var  mailOptions  =  {
            from:  'ritika.arora01@nagarro.com',
            to:  email,
            subject:  'Booking Confirmed - NAGP Care',
            text:  'Hi '  +  name  +  ',\n\nYour booking for the test: '  +  testName  +  ' has been confirmed. Please find the booking details below.\n\nTest: '  +  testName  +  '\nDate: '  +  date  +  '\nTime: '  +  time  +  '\nVenue: Nagarro Software, Sector-18, Gurgaon-122015.\n\n\nBest Regards,\n Ritika Arora \nNAGP Care'
        };

        transporter.sendMail(mailOptions,  function  (error,  info) {
            if  (error) {
                console.log(error);
            }  else  {
                console.log('Email sent: '  +  info.response);
            }
        });
    },
    sendEmailForFindDoctor:  function  (name,  email,  doctorName,  date,  time) {
        var  mailOptions  =  {
            from:  'ritika.arora01@nagarro.com',
            to:  email,
            subject:  'Appointment Confirmed - NAGP Care',
            text:  'Hi '  +  name  +  ',\n\nYour booking with the doctor: '  +  doctorName  +  ' has been confirmed. Please find the booking details below.\n\nDate: '  +  date  +  '\nTime: '  +  time  +  '\nVenue: Nagarro Software, Sector-18, Gurgaon-122015.\n\n\nBest Regards,\n Ritika Arora \nNAGP Care'
        };

        transporter.sendMail(mailOptions,  function  (error,  info) {
            if  (error) {
                console.log(error);
            }  else  {
                console.log('Email sent: '  +  info.response);
            }
        });
    }
}

module.exports  =  emailSender