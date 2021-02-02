from flask import render_template, request, redirect, url_for, flash
from . import user
from .forms import ProfileForm
from flask_login import login_required, current_user
from ..import db
from ..models import User

@user.route('/user/<username>')
# 函数不能与蓝图名称相同
def user_page(username):
    user=User.query.filter_by(username=username).first_or_404()
    return render_template('user/user.html',user=user)

@user.route('/profile', methods=['GET','POST'])
@login_required
def edit_profile():
    form=ProfileForm()
    if request.method=='POST':
        current_user.name=form.name.data or None
        current_user.birth=form.birth.data or None
        print(form.birth.data)
        print(form.name.data)
        current_user.about_me=form.about_me.data or None
        current_user.location=form.location.data or None
        current_user.link=form.link.data or None
        db.session.add(current_user._get_current_object())
        db.session.commit()
        flash("您的个人资料已更新！")
        return redirect(url_for('user.user_page',username=current_user.username))
    form.name.data=current_user.name
    form.birth.data=current_user.birth
    form.about_me.data=current_user.about_me
    form.location.data=current_user.location
    form.link.data=current_user.link
    return render_template('user/profile.html', form=form)