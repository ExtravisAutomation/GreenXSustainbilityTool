from dependency_injector.wiring import Provide, inject
from fastapi import APIRouter, Depends, Response, status, HTTPException
from fastapi.responses import JSONResponse
from app.core.container import Container
from app.core.dependencies import get_current_active_user
from app.model.user import User
from app.schema.auth_schema import SignIn, SignUp, SignInResponse
from app.schema.user_schema import User as UserSchema
from app.services.auth_service import AuthService
# from fastapi.status import HTTP_204_NO_CONTENT

from app.core.security import JWTBearer

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)


@router.post("/sign-in", response_model=SignInResponse)
@inject
async def sign_in(user_info: SignIn, service: AuthService = Depends(Provide[Container.auth_service])):
    return service.sign_in(user_info)


@router.post("/sign-up", response_model=UserSchema)
@inject
async def sign_up(user_info: SignUp, service: AuthService = Depends(Provide[Container.auth_service])):
    return service.sign_up(user_info)


@router.get("/me", response_model=UserSchema)
@inject
async def get_me(current_user: User = Depends(get_current_active_user)):
    user = UserSchema()
    user.name = current_user.name
    user.email = current_user.email
    user.created_at = current_user.created_at
    return user



@router.post("/sign-out")
@inject
async def sign_out(
        current_user: User = Depends(get_current_active_user),
        service: AuthService = Depends(Provide[Container.auth_service]),
        token: str = Depends(JWTBearer())):
    try:
        service.blacklist_token(current_user.email, token)

        return JSONResponse(status_code=status.HTTP_200_OK, content={"message": "Logout successful"})
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
