from flask import render_template
from . import main

@main.route('/')
def index():
    # 引用index.html模板渲染
    return render_template('index.html')