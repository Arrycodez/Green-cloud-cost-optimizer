import datetime
from app.db import get_db

class ConfigService:
    def __init__(self):
        self.default_config = {
            "cloud_provider": "aws",
            "region": "us-east-1",
            "priority": 50, # 0 = Cost, 100 = Sustainability
            "api_key": "********************",
            "theme": "dark"
        }

    def get_config(self):
        db = get_db()
        config = db.user_config.find_one({"id": "current_config"})
        if not config:
            db.user_config.insert_one({"id": "current_config", **self.default_config})
            return self.default_config
        config.pop("_id", None)
        config.pop("id", None)
        return config

    def save_config(self, new_config):
        db = get_db()
        db.user_config.update_one(
            {"id": "current_config"},
            {"$set": new_config},
            upsert=True
        )
        return self.get_config()

config_service = ConfigService()
