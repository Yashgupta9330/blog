from fastapi import APIRouter, Depends, Query, status, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from app.models.user import User
from app.database import get_db
from app.utils.auth import get_current_user
from app.schemas.post import PostList, PostCreate, PostResponse, PostUpdate
from app.services.post import create_blog_post, get_blog_post, get_blog_posts, update_blog_post, delete_blog_post
from app.config import settings

router = APIRouter(prefix="/api/blogs", tags=["Blog Posts"])

@router.post("/", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
def create_post(
    blog_post: PostCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_blog_post(db, blog_post, current_user)

@router.get("/{post_id}", response_model=PostResponse)
def get_post(post_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    post = get_blog_post(db, post_id,current_user)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )
    return post

@router.get("/", response_model=PostList)
def get_posts(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(settings.DEFAULT_PAGE_SIZE, ge=1, le=settings.MAX_PAGE_SIZE, description="Items per page"),
    search: Optional[str] = Query(None, description="Search term for title or content")
):
    skip = (page - 1) * size
    posts, total, current_page, limit, pages = get_blog_posts(db, skip, size, search)
    
    return {
        "items": posts,
        "total": total,
        "page": current_page,
        "size": limit,
        "pages": pages
    }

@router.put("/{post_id}", response_model=PostResponse)
def update_post(
    post_id: int,
    request: PostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return update_blog_post(db, post_id, request, current_user)

@router.delete("/{post_id}", status_code=status.HTTP_200_OK)
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return delete_blog_post(db, post_id, current_user.id)