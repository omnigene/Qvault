from flask_wtf import FlaskForm
from wtforms import StringField, DateField, TextAreaField

class ProfileForm(FlaskForm):
    name=StringField('昵称',render_kw={"maxlength":30})
    about_me=TextAreaField('简介',render_kw={"maxlength":180,"height":"75px"})
    birth=StringField('',render_kw={"style":"display:none"})
    location=StringField('位置',render_kw={"maxlength":30})
    link=StringField('链接',render_kw={"maxlength":80})
