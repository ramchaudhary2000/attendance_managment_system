from flask import Flask, jsonify, request
from flask_cors import CORS
from train import TakeImagesRequest, TrainImagesRequest, TrackImagesRequest, ViewAttendanceRequest
import threading

app=Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/take-images')
def take_images():
    id = int(request.args.get('id', ''))
    name = request.args.get('name', '')
    classname = request.args.get('classname', '')

    try:
        res = TakeImagesRequest(id, name, classname)
        if res:
            return jsonify({'message': res}), 200
        else:
            return jsonify({'error': 'Some Error Occured'}), 501

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500


@app.route('/train')
def train_images():
    try:
        res = TrainImagesRequest()
        if res:
            return jsonify({'message': 'Images Successfully trained for the user'}), 200
        else:
            return jsonify({'error': 'Some Error Occured'}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/track')
def track_images():
    teacher = request.args.get('t', '')
    def run_TrackImagesRequest(teacher):
        try:
            TrackImagesRequest(teacher)
        except Exception as e:
            print(f'error: {e}')

    thread = threading.Thread(target=run_TrackImagesRequest, args=[teacher])
    thread.start()

    return jsonify({'message': 'Started Recording Attendance through camera'}), 200

@app.route('/get-attendance')
def get_Attendance():
    dateValue = request.args.get('date','')
    teacher = request.args.get('teacher','')
    try:
        data = ViewAttendanceRequest(dateValue, teacher)
        if data:
            return jsonify(data)
        else:
            return jsonify([])
    except Exception as e:
        return jsonify({'error': str(e)}), 500
        
            
