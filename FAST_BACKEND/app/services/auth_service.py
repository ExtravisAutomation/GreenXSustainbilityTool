import sys
from datetime import timedelta
from typing import List

from app.core.config import configs
from app.core.exceptions import AuthError
from app.core.security import create_access_token, get_password_hash, verify_password
from app.model.user import User
from app.repository.user_repository import UserRepository
from app.schema.auth_schema import Payload, SignIn, SignUp
from app.schema.user_schema import FindUser
from app.services.base_service import BaseService
from app.util.hash import get_rand_hash

from app.model.blacklisted_token import BlacklistedToken

from app.repository import blacklisted_token_repository

from app.repository.blacklisted_token_repository import BlacklistedTokenRepository

from app.schema.auth_schema import SignInNew


class AuthService(BaseService):
    def __init__(self, user_repository: UserRepository, blacklisted_token_repository: BlacklistedTokenRepository):
        self.user_repository = user_repository
        super().__init__(user_repository)
        self.blacklisted_token_repository = blacklisted_token_repository

    def sign_in(self, sign_in_info: SignInNew):
        find_user = FindUser()
        find_user.user_name = sign_in_info.user_name
        users: List[User] = self.user_repository.read_by_options(find_user)["founds"]
        print("USERS FOUND", users, file=sys.stderr)

        if not users:
            raise AuthError(detail="Incorrect username or password")

        found_user = None
        for user in users:
            if user.is_active and user.username == sign_in_info.user_name and verify_password(sign_in_info.password, user.password):
                found_user = user
                break

        if not found_user:
            raise AuthError(detail="Incorrect username or password")

        print("FOUND_USER", found_user.name, file=sys.stderr)

        delattr(found_user, "password")
        payload = Payload(
            id=found_user.id,
            email=found_user.email,
            name=found_user.name,
            is_superuser=found_user.is_superuser,
        )
        token_lifespan = timedelta(minutes=configs.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token, expiration_datetime = create_access_token(payload.dict(), token_lifespan)
        sign_in_result = {
            "access_token": access_token,
            "expiration": expiration_datetime,
            "user_info": found_user,
        }
        return sign_in_result

    def sign_up(self, user_info: SignUp):
        user_token = get_rand_hash()
        user_data = user_info.dict(exclude_none=True)
        role = user_data.pop('role', 'user')
        user = User(
            **user_data,
            is_active=True,
            is_superuser=False,
            user_token=user_token,
            role=role
        )
        print("USERRRRRR", user)
        user.password = get_password_hash(user_info.password)

        created_user = self.user_repository.create(user)

        delattr(created_user, "password")

        return created_user

    def blacklist_token(self, email: str, token: str):
        blacklisted_token = BlacklistedToken(email=email, token=token)
        self.blacklisted_token_repository.create(blacklisted_token)
