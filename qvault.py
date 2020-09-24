import os
from app import create_app, db
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand

# 调用app\__init__.py中的初始化函数创建应用
app=create_app(os.getenv('FLASK_CONFIG') or 'development')

manager=Manager(app)
migrate=Migrate(app, db)
manager.add_command('db', MigrateCommand)

if __name__=="__main__":
    manager.run()