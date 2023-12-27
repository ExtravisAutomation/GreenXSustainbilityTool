from dependency_injector import containers, providers
from app.core.config import configs
from app.core.database import Database
from app.services.auth_service import AuthService
from app.services.user_service import UserService
from app.repository.user_repository import UserRepository
from app.repository.site_repository import SiteRepository
from app.services.rack_service import RackService
from app.repository.rack_repository import RackRepository
from app.services.site_service import SiteService


class Container(containers.DeclarativeContainer):
    wiring_config = containers.WiringConfiguration(
        modules=[
            #"app.api.v1.endpoints.auth",
            #"app.api.v1.endpoints.post",
            #"app.api.v1.endpoints.tag",
            "app.api.v1.endpoints.user",
            "app.api.v2.endpoints.auth",
            "app.api.v2.endpoints.site",
            "app.api.v2.endpoints.rack",

            "app.core.dependencies",
        ]
    )

    db = providers.Singleton(Database, db_url=configs.DATABASE_URI)

    #post_repository = providers.Factory(PostRepository, session_factory=db.provided.session)
    #tag_repository = providers.Factory(TagRepository, session_factory=db.provided.session)
    site_repo = providers.Factory(SiteRepository, session_factory=db.provided.session)
    user_repository = providers.Factory(UserRepository, session_factory=db.provided.session)
    rack_repository = providers.Factory(RackRepository, session_factory=db.provided.session)



    auth_service = providers.Factory(AuthService, user_repository=user_repository)
    site_service = providers.Factory(SiteService, site_repository=site_repo)
    #post_service = providers.Factory(PostService, post_repository=post_repository, tag_repository=tag_repository)
    #tag_service = providers.Factory(TagService, tag_repository=tag_repository)
    user_service = providers.Factory(UserService, user_repository=user_repository)
    rack_service = providers.Factory(RackService, rack_repository=rack_repository)
