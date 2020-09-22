from flask import Blueprint
# 创建主功能模块蓝图
main=Blueprint('main', __name__)
# 将主功能模块目录下的视图文件view.py与主功能蓝图绑定
from . import views