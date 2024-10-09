import base64
from io import BytesIO
from diffusers import StableDiffusionPipeline
import matplotlib.pyplot as plt
import torch
from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
from models import db, User, Product , Artists
from flask_cors import CORS


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database2.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'  

db.init_app(app)

with app.app_context():
    db.create_all()

bcrypt = Bcrypt(app)
jwt = JWTManager(app)
CORS(app, resources={r"/*": {"origins": "*"}})

# Initialize the Stable Diffusion pipeline



@app.route('/register', methods=['POST'])
def registerPage():
    data = request.json
    username = data['username']
    password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(username=username, password=password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "user registered successfully"}), 201


@app.route("/login", methods=['POST'])
def loginPage():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if user and bcrypt.check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=user.id, additional_claims={})
        return jsonify(access_token=access_token)


# artists = {
#     'Vincent van Gogh': '0x947C1F94b46b6c76b31403a2f8A1EA801510Af21',
#     'Banksy': '0x947C1F94b46b6c76b31403a2f8A1EA801510ABCD',
#     'Alan Lee': '0x947C1F94b46b6c76b31403a2f8A1EA801510AEFG',
#     'Donato Giancola': '0x947C1F94b46b6c76b31403a2f8A1EA801510AHIJ',
#     'Greg Rutkowski': '0x947C1F94b46b6c76b31403a2f8A1EA801510AKLM',
#     'John Berkey': '0x947C1F94b46b6c76b31403a2f8A1EA801510ANOP',
#     'Ed Mell': '0x947C1F94b46b6c76b31403a2f8A1EA801510ANOQ',
# }

@app.route("/artist-register", methods=["POST"])
def artist_register():
    data = request.json
    username = data['username']
    password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    wallet_address = data['walletAddress']

    # Check if the username already exists
    existing_artist = Artists.query.filter_by(username=username).first()
    if existing_artist:
        return jsonify({"message": "Username already taken"}), 400

    # Create a new artist
    new_artist = Artists(username=username, password=password, walletAddress=wallet_address)

    db.session.add(new_artist)
    db.session.commit()

    return jsonify({"message": "Artist registered successfully"}), 201


@app.route("/artist-login", methods=["POST"])
def artist_login():
    data = request.json
    artist = Artists.query.filter_by(username=data['username']).first()
    if artist and bcrypt.check_password_hash(artist.password, data['password']):
        access_token = create_access_token(identity=artist.id)
        return jsonify(access_token=access_token), 200
    return jsonify({"message": "Invalid username or password"}), 401

@app.route("/artists-available", methods=["GET"])
def artistaAvailable():
    artists = Artists.query.all()
    artistlist = [artist.to_dict() for artist in artists]
    print(artistlist)
    return jsonify({"artists": artistlist}), 200


@app.route("/store", methods=["POST"])
def store():
    # Receive the prompt and artist ID from the frontend
    data = request.json
    prompt = data.get("prompt")
    artist_id = data.get("artist_id")

    # Fetch the selected artist's details from the database
    artist = Artists.query.get(artist_id)
    if not artist:
        return jsonify({"error": "Artist not found"}), 404

    full_prompt = f"{prompt} in the exact style of {artist.username}"

    # Generate image using Stable Diffusion
    model_id = "dreamlike-art/dreamlike-diffusion-1.0"
    pipe = StableDiffusionPipeline.from_pretrained(model_id, torch_dtype=torch.float16, use_safetensors=True)
    pipe = pipe.to("cuda")

    image = pipe(full_prompt).images[0]

    # Save image to a byte stream
    img_io = BytesIO()
    image.save(img_io, 'PNG')
    img_io.seek(0)

    # Convert to base64 for sending it over JSON
    img_base64 = base64.b64encode(img_io.getvalue()).decode('utf-8')

    return jsonify({"image": img_base64})



if __name__ == "__main__":
    app.run(debug=True)
