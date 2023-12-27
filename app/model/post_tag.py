# from sqlalchemy import Column, Integer, ForeignKey
# from .base_model import BaseModel
#
# class PostTag(BaseModel):
#     __tablename__ = "post_tag"
#
#     post_id = Column(Integer, ForeignKey("post.id"), primary_key=True, index=True, nullable=False)
#     tag_id = Column(Integer, ForeignKey("tag.id"), primary_key=True, index=True, nullable=False)
