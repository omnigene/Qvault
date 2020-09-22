from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import config

# 实例化数据库操作对象
db = SQLAlchemy()

# 定义初始化应用的函数
def create_app(config_name):
    app = Flask(__name__)
    # 从config.py中导入对Flask实例的配置
    app.config.from_object(config[config_name])
    # 将数据库实例对象与Flask实例对象绑定
    db.init_app(app)

    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app