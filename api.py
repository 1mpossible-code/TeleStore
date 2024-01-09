from flask import Flask, flash, request, redirect, url_for, render_template
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from App import App
import os


load_dotenv()



app = Flask(__name__)

bot = App()


UPLOAD_FOLDER = os.getcwd()
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SECRET_KEY'] = str(os.urandom(12))


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/",methods=['GET','POST'])
def home():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            upload_file(filename)
            print("passed")
            flash(filename + " was uploaded!")
            return redirect(url_for('home', name=filename))
    return render_template("home.html")

async def upload_file(file_name):
    await bot.upload_file(file_name)
    
async def del_file(file_id):
    await bot.delete_file(file_id)

async def read_file(file_id):
    await bot.delete_file(file_id)

if __name__ == "__main__":
        app.run(debug=True,port=3000)
    


    
    
