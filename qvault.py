import os
from app import create_app

# 调用app\__init__.py中的初始化函数创建应用
app=create_app(os.getenv('FLASK_CONFIG') or 'development')

if __name__=="__main__":
    app.run()