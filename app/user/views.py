from flask import render_template
from . import user
from .forms import ProfileForm
from flask_login import login_required

@user.route('/user')
# 函数不能与蓝图名称相同
def user_page():
    return render_template('user/user.html')

@user.route('/profile', methods=['GET','POST'])
# @login_required
def edit_profile():
    form=ProfileForm()
    return render_template('user/profile.html', form=form)