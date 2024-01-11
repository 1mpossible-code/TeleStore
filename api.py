import asyncio
from flask import Flask, request, jsonify, send_from_directory
from App import App
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
bot = App()

@app.route('/')
def home():
    return '🏠'
    
@app.route('/request',methods=['GET'])
def handle_Get():
    if request.method == 'GET':
        data = asyncio.run(bot.get_all_files_info())
        data_dict = [{'id': item[0], 'name': item[1], 'message_ids':item[2],'file_ids':item[3],'size':item[4],} for item in data]
        return jsonify(data_dict)
        
@app.route('/request',methods=['POST'])
def handle_Post():
    None

@app.route('/request',methods=['DELETE'])
def handle_Delete():
    None


"""
TODO:
    - CREATE:
        - upload_file: Saves a file by either sending it directly or handling it as a large file.

    - READ:
        - get_all_files_info: Gets information about all files.
        - READ by ID
    - DELETE:
        - delete_file: Deletes a file based on its unique identifier.
"""

if __name__ == "__main__":
    asyncio.run(app.run(debug=True, port=3000))
 
 
 # from flask import Flask, flash, request, redirect, url_for, render_template
# from werkzeug.utils import secure_filename
# from dotenv import load_dotenv
# from App import App
# import os
# from quart import Quart 


# load_dotenv()

# app = Quart(__name__)
# bot = App()

# UPLOAD_FOLDER = os.getcwd()
# ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# app.config['SECRET_KEY'] = str(os.urandom(12))


# def allowed_file(filename):
#     return '.' in filename and \
#            filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
# async def upload_file(file_name):
#     await bot.upload_file(file_name)
    
# async def del_file(file_id):
#     await bot.delete_file(file_id)

# async def read_file(file_id):
#     await bot.download_file(file_id)


# @app.route("/",methods=['GET','POST','DELETE'])
# async def home():
#     if request.method == 'POST':
#         # check if the post request has the file part
#         if 'file' not in request.files:
#             flash('No file part')
#             return redirect(request.url)
#         file = request.files['file']
#         # If the user does not select a file, the browser submits an
#         # empty file without a filename.
#         if file.filename == '':
#             flash('No selected file')
#             return redirect(request.url)
#         if file and allowed_file(file.filename):
#             filename = secure_filename(file.filename)
#             file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
#             if filename:
#                 await upload_file(filename)
#                 print("PASSED THE FILE")
#             flash(filename + " was uploaded!")
#             return redirect(url_for('home', name=filename))
#     if request.method == 'GET':

#     if request.method == 'DELETE':
        

#     return render_template("home.html")



# if __name__ == "__main__":
#         app.run(debug=True,port=3000)
    


    
    
