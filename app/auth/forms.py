from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, BooleanField
from wtforms.validators import InputRequired

class RegistrationForm(FlaskForm):
    # onfocus、onblur事件与placeholer属性配合使用，实现input框获得焦点时清除placeholder值的效果
    username=StringField('',render_kw={'placeholder':'用户名','onfocus':'this.placeholder=""','onblur':'this.placeholder="用户名"'})
    mobile=StringField('',render_kw={'placeholder':'手机号','onfocus':'this.placeholder=""','onblur':'this.placeholder="手机号"'})
    email=StringField('',render_kw={'placeholder':'邮箱','type':'email','onfocus':'this.placeholder=""','onblur':'this.placeholder="邮箱"'})
    password=PasswordField('',render_kw={'placeholder':'设置密码','type':'password','onfocus':'this.placeholder=""','onblur':'this.placeholder="设置密码"'})
    password1=PasswordField('',render_kw={'placeholder':'密码确认','type':'password','onfocus':'this.placeholder=""','onblur':'this.placeholder="密码确认"'})
    submit=SubmitField('注  册')

class LoginForm(FlaskForm):
    account=StringField('',validators=[InputRequired()],render_kw={'placeholder':'手机号/邮箱/用户名','onfocus':'this.placeholder=""','onblur':'this.placeholder="手机号/邮箱/用户名"'})
    input_password=PasswordField('',validators=[InputRequired()],render_kw={'placeholder':'输入密码','onfocus':'this.placeholder=""','onblur':'this.placeholder="输入密码"'})
    remember_me=BooleanField('记住我')
    submit=SubmitField('登  录')