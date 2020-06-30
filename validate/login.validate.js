const db = require('../db.js')
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');
const userCol = require('../models/users.model')

module.exports.validateLogin = async (req, res, next) => {
    let errors = [];

    if(!req.body.email){
        errors.push('Bạn chưa nhập tài khoản')
    }
    if(!req.body.password){
        errors.push('Bạn chưa nhập mật khẩu')
    }
    if(errors.length){
        res.render('authentication/login',{
            errors: errors,
            values: req.body
        })
        return;
    }

    const user = await userCol.findOne({email: req.body.email})

    if(!user){
        errors.push('Tài khoản không đúng')
        res.render('authentication/login',{
            errors: errors,
            values: req.body
        })
        return;
    }

    await bcrypt.compare(req.body.password, user.password, async function(err, result) {
        
        if(user.wrongLoginCount > 2){
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const msg = {
                to: user.email,
                from: '"Quety-Glitch" <quyetnxm04120@arena.edu.vn>',
                subject: 'Sai mật khẩu đăng nhập',
                text: 'Sai mật khẩu đăng nhập',
                html: `
                    <h3>Bạn đã đăng nhập sai mật khẩu</h3>
                    <div>Thử lại <a href="https://glitch.com/~environment-variables-email-api-sendgrid">click</a></div>
                `,
            };
            sgMail
            .send(msg)
            .then(() => {}, error => {
                console.error(error);

                if (error.response) {
                console.error(error.response.body)
                }
            });

            errors.push('Lượn đê, quá 3 lần rồi, đừng để anh cáu')
            res.render('authentication/login',{
                errors: errors,
                values: req.body
            })
            return;
        }
        if(result == false){
            // db.get("users")
            // .find({email: req.body.email})
            // .assign({ 
            //     wrongLoginCount:  user.wrongLoginCount + 1
            // })
            await userCol.update({"email": req.body.email}, {"wrongLoginCount": user.wrongLoginCount + 1})
            errors.push('Mật khẩu không đúng')
            res.render('authentication/login',{
                errors: errors,
                values: req.body
            })
            return;
        }
        res.cookie('userId', user.id, {
            signed: true
        })
        res.redirect('/transection')
        
    });
    
}