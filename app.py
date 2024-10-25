from flask import Flask, jsonify, render_template
import geocoder

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/get-location')
def get_location():
    # Get current location using geocoder
    location = geocoder.ip('me')
    if location.latlng:
        latitude = location.latlng[0]
        longitude = location.latlng[1]
        return jsonify({'latitude': latitude, 'longitude': longitude})
    else:
        return jsonify({'error': 'Unable to retrieve location'}), 500

if __name__ == '__main__':
    app.run(debug=True)
