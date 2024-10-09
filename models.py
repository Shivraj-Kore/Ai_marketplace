from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer , primary_key = True)
    username = db.Column(db.String(80) , unique = True , nullable = False)
    password = db.Column(db.String(80) , nullable = False)

class Artists(db.Model):
    id = db.Column(db.Integer , primary_key = True)
    username = db.Column(db.String(80) , unique = True , nullable = False)
    password = db.Column(db.String(80) , nullable = False)
    walletAddress = db.Column(db.String(50) , unique = True , nullable = False)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "walletAddress": self.walletAddress,
        }

class Product(db.Model):
    id = db.Column(db.Integer , primary_key = True)
    prodname = db.Column(db.String(80) , unique = True , nullable = False)
    price = db.Column(db.Float , nullable = False)

    def __repr__(self):
        return f'id = {self.id} , product = {self.title}'

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "price": self.price
        }
