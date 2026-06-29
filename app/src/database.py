import uuid
import logging
from datetime import datetime, timezone
from app.src.config import SUPABASE_URL, SUPABASE_KEY

logger = logging.getLogger(__name__)

class MockResponse:
    def __init__(self, data):
        self.data = data

class MockQueryBuilder:
    def __init__(self, table_name, db_store):
        self.table_name = table_name
        self.db_store = db_store
        self.filters = []
        self.sort_col = None
        self.sort_desc = False
        self.limit_val = None
        self.is_single = False
        self.is_delete = False
        self.insert_data = None

    def insert(self, data):
        self.insert_data = data
        return self

    def select(self, projection="*"):
        return self

    def delete(self):
        self.is_delete = True
        return self

    def eq(self, column, value):
        self.filters.append((column, value))
        return self

    def order(self, column, desc=False):
        self.sort_col = column
        self.sort_desc = desc
        return self

    def limit(self, value):
        self.limit_val = value
        return self

    def single(self):
        self.is_single = True
        return self

    def execute(self):
        if self.table_name not in self.db_store:
            self.db_store[self.table_name] = []
        
        table = self.db_store[self.table_name]

        if self.insert_data is not None:
            records = self.insert_data if isinstance(self.insert_data, list) else [self.insert_data]
            inserted_records = []
            for r in records:
                new_record = dict(r)
                if "id" not in new_record:
                    new_record["id"] = str(uuid.uuid4())
                if "created_at" not in new_record:
                    new_record["created_at"] = datetime.now(timezone.utc).isoformat()
                table.append(new_record)
                inserted_records.append(new_record)
            return MockResponse(inserted_records)

        if self.is_delete:
            remaining = []
            deleted = []
            for r in table:
                match = True
                for col, val in self.filters:
                    if r.get(col) != val:
                        match = False
                        break
                if match:
                    deleted.append(r)
                else:
                    remaining.append(r)
            self.db_store[self.table_name] = remaining
            return MockResponse(deleted)

        results = list(table)
        for col, val in self.filters:
            results = [r for r in results if r.get(col) == val]
        
        if self.sort_col:
            results.sort(key=lambda x: x.get(self.sort_col, ""), reverse=self.sort_desc)
        
        if self.limit_val:
            results = results[:self.limit_val]

        if self.is_single:
            if not results:
                class SupabaseError(Exception):
                    def __init__(self):
                        self.code = "PGRST116"
                        self.message = "JSON object requested, multiple rows or no rows returned"
                raise SupabaseError()
            return MockResponse(results[0])

        return MockResponse(results)

class MockSupabaseClient:
    def __init__(self):
        self.db_store = {}

    def table(self, table_name):
        return MockQueryBuilder(table_name, self.db_store)

# Global database client instance
supabase = None

# Attempt to create real Supabase client, fallback to mock if unreachable/invalid
try:
    if not SUPABASE_URL or "example.com" in SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("Invalid credentials")
    
    from supabase import create_client
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Test connection quickly
    supabase.table("logs").select("id").limit(1).execute()
    logger.info("Successfully connected to live Supabase database.")
except Exception as e:
    logger.warning(f"Could not connect to live Supabase database ({e}). Falling back to MockSupabaseClient.")
    supabase = MockSupabaseClient()
