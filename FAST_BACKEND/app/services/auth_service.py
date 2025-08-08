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
        print("finre")
        super().__init__(user_repository)
        self.blacklisted_token_repository = blacklisted_token_repository

    def sign_in(self, sign_in_info: SignInNew):
        find_user = FindUser()
        find_user.user_name = sign_in_info.user_name
        print(f"Attempting to find user with username: {find_user.user_name}", file=sys.stderr)

        user: User = self.user_repository.read_by_options(find_user)["found"]
        print(f"User found: {user.username}", file=sys.stderr)

        if user is None:
            print("Authentication error: Incorrect username or password", file=sys.stderr)
            raise AuthError(detail="Incorrect username or password")

        if not user.is_active:
            print(f"Account activity error: Account for {user.username} is not active", file=sys.stderr)
            raise AuthError(detail="Account is not active")

        if not verify_password(sign_in_info.password, user.password):
            print("Authentication error: Password does not match", file=sys.stderr)
            raise AuthError(detail="Incorrect username or password")

        print("Password verified successfully", file=sys.stderr)
        delattr(user, "password")
        role_name,module=self.user_repository.get_data_modules(user.id, user.role_id)
        print(role_name)
        print(module)
        #
        payload = Payload(
            id=user.id,
            email=user.email,
            user_token=user.user_token,
            username=user.username,
            name=user.name  if user.name else "",
            is_active=user.is_active,
            is_superuser=user.is_superuser,
            user_role=role_name,
            accessible_modules=module

        )
        print(f"Payload prepared for user {user.id}: {payload}", file=sys.stderr)

        token_lifespan = timedelta(minutes=configs.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token, expiration_datetime = create_access_token(payload.dict(), token_lifespan)
        print(f"Access token created: {access_token}", file=sys.stderr)

        sign_in_result = {
            "access_token": access_token,
            "expiration": expiration_datetime,
            "user_info": payload.dict(),
        }
        print(f"Sign-in result prepared: {sign_in_result}", file=sys.stderr)

        return sign_in_result



    def sign_up(self, user_info: SignUp):
        user_token = get_rand_hash()
        user_data = user_info.dict(exclude_none=True)
        # role = user_data.pop('role', 'user')
        role=user_data.pop('role', 'user')
        is_superuser = True if user_info.role_id != 1 else False

        user = User(
            **user_data,
            is_active=True,
            is_superuser=is_superuser,  
            user_token=user_token,
        )
        print("USERRRRRR", user)
        user.password = get_password_hash(user_info.password)
        print("PASS")

        created_user = self.user_repository.create(user)

        delattr(created_user, "password")

        return created_user


    def blacklist_token(self, email: str, token: str):
        blacklisted_token = BlacklistedToken(email=email, token=token)
        self.blacklisted_token_repository.create(blacklisted_token)
