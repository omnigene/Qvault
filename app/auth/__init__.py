from flask import Blueprint
# 实例化注册登录功能模块蓝本
auth=Blueprint('auth', __name__)
from . import views