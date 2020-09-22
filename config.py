import os

import os

class Config:
    # 设置密钥
    SECRET_KEY=os.urandom(24)
    # 设置数据库连接配置
    MYSQL_PASSWORD=os.environ.get('MYSQL_PASSWORD')
    URI='mysql+mysqlconnector://root:{}@127.0.0.1:3306/{}?charset=utf8mb4'
    # 关闭SQLAlchemy警告提示
    SQLALCHEMY_TRACK_MODIFICATIONS=False

# 开发模式配置
class DevelopmentConfig(Config):
    DEBUG=True
    DATABASE='db_qvault_dev'
    SQLALCHEMY_DATABASE_URI=Config.URI.format(Config.MYSQL_PASSWORD,DATABASE)

# 生产模式配置
class ProductionConfig(Config):
    DATABASE='db_qvault'
    SQLALCHEMY_DATABASE_URI=Config.URI.format(Config.MYSQL_PASSWORD,DATABASE)

config={
    'development':DevelopmentConfig,
    'production':ProductionConfig,
    'default':DevelopmentConfig
}