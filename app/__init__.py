from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from flask_login import LoginManager
from config import config

# 实例化数据库、电子邮件、登录管理对象
db = SQLAlchemy()
mail=Mail()
login_manager=LoginManager()
# 绑定登录视图函数
login_manager.login_view='auth.login'

# 定义初始化应用的函数
def create_app(config_name):
    app = Flask(__name__)
    # 从config.py中导入对Flask实例的配置
    app.config.from_object(config[config_name])
    # 将数据库、电子邮件、登录管理实例对象与主程序（Flask实例对象）绑定
    db.init_app(app)
    mail.init_app(app)
    login_manager.init_app(app)

    # 在主程序上注册蓝图
    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)
    from .auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)
    from .user import user as user_blueprint
    app.register_blueprint(user_blueprint)

    return app