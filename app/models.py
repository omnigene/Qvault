from . import db
from werkzeug.security import generate_password_hash, check_password_hash


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    # 将手机号字段的数据格式定义为String，便于设置正则表达式验证规则
    mobile = db.Column(db.String(64), unique=True, index=True)
    email = db.Column(db.String(64), unique=True, index=True)
    username = db.Column(db.String(64), unique=True, index=True)
    password_hash = db.Column(db.String(128))

    # 禁止通过用户模型的密码属性来读取用户密码
    @property
    def password(self):
        raise AttributeError('密码属性不可读取！')

    # 对用户输入的密码进行哈希加密后再写入数据库
    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    # 对用户输入的密码进行哈希验证（即与数据库中存储的哈希密码进行校验）
    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)