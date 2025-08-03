from privy import PrivyAPI
from privy.lib.users import AccessTokenClaims
from oto.environment import get_settings
from functools import lru_cache


@lru_cache
def get_auth_service() -> "AuthService":
    return AuthService()


class AuthService:
    def __init__(self):
        self.client = PrivyAPI(
            app_id=get_settings().privy_app_id,
            app_secret=get_settings().privy_secret,
        )

    def verify_token(self, token: str, user_id: str) -> bool:
        try:
            user: AccessTokenClaims = self.client.users.verify_access_token(
                auth_token=token
            )
            if user["user_id"] != user_id:
                print(f"User ID mismatch: {user['user_id']} != {user_id}")
                return False
            return True
        except Exception as e:
            import traceback

            traceback.print_exc()
            return False
