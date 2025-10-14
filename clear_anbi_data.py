#!/usr/bin/env python3
"""
Clear ANBI data for fresh testing
"""

import os
import sys
import shutil
from pymongo import MongoClient

def clear_anbi_data():
    """Clear ANBI documents from MongoDB and file system"""
    try:
        # Connect to MongoDB
        mongo_url = os.getenv('MONGO_URL', 'mongodb://localhost:27017')
        db_name = os.getenv('DB_NAME', 'stichting_atlas')
        
        client = MongoClient(mongo_url)
        db = client[db_name]
        
        # Clear anbi_documents collection
        result = db.anbi_documents.delete_many({})
        print(f"Cleared {result.deleted_count} documents from MongoDB")
        
        # Clear upload directory
        upload_dir = '/app/public/uploads/anbi'
        if os.path.exists(upload_dir):
            shutil.rmtree(upload_dir)
            print(f"Cleared upload directory: {upload_dir}")
        else:
            print(f"Upload directory does not exist: {upload_dir}")
        
        client.close()
        print("✅ ANBI data cleared successfully")
        return True
        
    except Exception as e:
        print(f"❌ Error clearing ANBI data: {str(e)}")
        return False

if __name__ == "__main__":
    success = clear_anbi_data()
    sys.exit(0 if success else 1)