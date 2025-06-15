from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from fast_api_server.db.mongo_config import settings
import logging
from bson import ObjectId


logger = logging.getLogger(__name__)

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, *args, **kwargs):
        if not ObjectId.is_valid(v):
            raise ValueError('Invalid objectid')
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, core_schema, handler):
        json_schema = handler(core_schema)
        json_schema.update(type='string')
        return json_schema

class MongoDB:
    client: AsyncIOMotorClient = None
    database: AsyncIOMotorDatabase = None

mongodb = MongoDB()

async def connect_to_mongo():
    """Create database connection"""
    try:
        mongodb.client = AsyncIOMotorClient(settings.MONGODB_URL)
        mongodb.database = mongodb.client[settings.MONGO_DATABASE_NAME]
        
        # Test connection
        await mongodb.client.admin.command('ping')
        logger.info("Successfully connected to MongoDB")
        
        # Create indexes
        await create_indexes()
        
    except Exception as e:
        logger.error(f"Error connecting to MongoDB: {e}")
        raise e

async def close_mongo_connection():
    """Close database connection"""
    if mongodb.client:
        mongodb.client.close()
        logger.info("Disconnected from MongoDB")

async def create_indexes():
    """Create database indexes"""
    try:
        # Create unique index on email for users collection
        await mongodb.database[settings.USER_DEMO_COLLECTION_NAME].create_index("email", unique=True)
        logger.info("Database indexes created successfully")
    except Exception as e:
        logger.error(f"Error creating indexes: {e}")

def get_database() -> AsyncIOMotorDatabase:
    """Get database instance"""
    return mongodb.database