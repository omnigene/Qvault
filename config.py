import os
from dotenv import load_dotenv

# 从.env文件导入环境变量
load_dotenv()

class Config:
    # 设置密钥
    SMS_SECRET_ID = os.environ.get('SMS_SECRET_ID')
    SMS_SECRET_KEY = os.environ.get('SMS_SECRET_KEY')
    SECRET_KEY=os.urandom(24)
    # 设置数据库连接配置
    MYSQL_PASSWORD=os.environ.get('MYSQL_PASSWORD')
    # 使用mysqlconnector在upgrade时会重新创建表而不是更新字段，因而会报错表已存在
    # 改用pymysql作为驱动解决该问题（需先安装pymysql包）
    URI='mysql+pymysql://root:{}@127.0.0.1:3306/{}?charset=utf8mb4'
    # 关闭SQLAlchemy警告提示
    SQLALCHEMY_TRACK_MODIFICATIONS=False
    # 配置电子邮件参数
    MAIL_SERVER=os.environ.get('MAIL_SERVER','smtp.163.com')
    MAIL_PORT=int(os.environ.get('MAIL_PORT','25'))
    MAIL_USE_TLS=os.environ.get('MAIL_USE_TLS','true')
    MAIL_USERNAME=os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD=os.environ.get('MAIL_PASSWORD')

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