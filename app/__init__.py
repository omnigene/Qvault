from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from config import config

# 实例化数据库和电子邮件对象
db = SQLAlchemy()
mail=Mail()

# 定义初始化应用的函数
def create_app(config_name):
    app = Flask(__name__)
    # 从config.py中导入对Flask实例的配置
    app.config.from_object(config[config_name])
    # 将数据库、电子邮件实例对象与主程序（Flask实例对象）绑定
    db.init_app(app)
    mail.init_app(app)

    # 在主程序上注册蓝图
    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)
    from .auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint) 

    return app