from passlib.context import CryptContext
import sys

try:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    # A password longer than 72 bytes
    long_password = "a" * 73
    print(f"Testing password of length {len(long_password)}")
    hashed = pwd_context.hash(long_password)
    print("Hash successful")
except Exception as e:
    print(f"Caught expected error: {e}")
    # print traceback
    import traceback
    traceback.print_exc()
