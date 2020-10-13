from . import auth
from flask import json, request, redirect, render_template, url_for
from ..models import User

import random
from config import Config

from tencentcloud.common import credential
from tencentcloud.common.exception.tencent_cloud_sdk_exception import TencentCloudSDKException
from tencentcloud.sms.v20190711 import sms_client, models
from tencentcloud.common.profile.client_profile import ClientProfile

from flask import flash
from .forms import RegistrationForm, LoginForm
from ..import db

@auth.route('/check', methods=['POST'])
def check_data():
    data=json.loads(request.get_data())
    if User.query.filter_by(**data).first():
        return 'false'
    else:
        return 'true'

@auth.route('/sms', methods=['POST'])
def send_message():
    data = json.loads(request.get_data())
    mobile=data['mobile']
    receiver="+86"+mobile
    # 生成随机验证码
    def make_code(len):
        code = ""
        for i in range(len):
            code += str(random.randint(0, 9))
        return code
    try:
        # 需注册腾讯云账户，获取账户密钥对SecretId和SecretKey
        cred = credential.Credential(Config.SMS_SECRET_ID, Config.SMS_SECRET_KEY)
        clientProfile = ClientProfile()
        client = sms_client.SmsClient(cred, "ap-guangzhou", clientProfile)
        req = models.SendSmsRequest()
        # 需在腾讯云中添加短信应用，生成短信API接口的SDKAppID
        req.SmsSdkAppid = "1400400789"
        req.Sign = "Qvault"
        req.PhoneNumberSet = [receiver]
        # 需在短信应用中设置并申请短信模板，获取短信模板ID（审核通过后才可用）
        req.TemplateID = "664214"
        req.TemplateParamSet = [make_code(6)]
        resp = client.SendSms(req)
        verify_data={'mobile':mobile,'code':req.TemplateParamSet[0],'msg':'注册验证码已发送。'}
        return verify_data, 200
    except TencentCloudSDKException as err:
        print('error', err)
        return "error", 400

@auth.route('/register', methods=['GET', 'POST'])
def register():
    form=RegistrationForm()
    if request.method=='POST':
        user=User(username=form.username.data,
                  mobile=form.mobile.data,
                  email=form.email.data,
                  password=form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('您已注册成功！')
        return redirect(url_for('main.index'))
    return render_template('auth/register.html',form=form)

@auth.route('/login', methods=['GET','POST'])
def login():
    form = LoginForm()
    return render_template('auth/login.html', form=form)