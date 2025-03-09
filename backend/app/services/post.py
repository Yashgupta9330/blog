from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import Optional, List, Tuple
from sqlalchemy import or_
from app.models.post import Post
from app.models.user import User
from app.schemas.post import PostCreate, PostUpdate
from app.config import settings

def create_blog_post(db: Session, blog_post: PostCreate, current_user: any):
    db_blog_post = Post(
        title=blog_post.title,
        content=blog_post.content,
        image_url=blog_post.image_url,
        user_id=current_user.id
    )
    
    db.add(db_blog_post)
    db.commit()
    db.refresh(db_blog_post)
    return {
        "id": db_blog_post.id,
        "title": db_blog_post.title,
        "content": db_blog_post.content,
        "image_url": db_blog_post.image_url,
        "user_id": db_blog_post.user_id,
        "created_at": db_blog_post.created_at,
        "updated_at": db_blog_post.updated_at,
        "author_username": current_user.username 
    }

def get_blog_post(db: Session, post_id:int,current_user:any):
    db_blog_post=db.query(Post).filter(Post.id == post_id).first()
    return {
        "id": db_blog_post.id,
        "title": db_blog_post.title,
        "content": db_blog_post.content,
        "image_url": db_blog_post.image_url,
        "user_id": db_blog_post.user_id,
        "created_at": db_blog_post.created_at,
        "updated_at": db_blog_post.updated_at,
        "author_username": current_user.username 
    }
def get_blog_posts(
    db: Session, 
    skip: int = 0, 
    limit: int = settings.DEFAULT_PAGE_SIZE,
    search: Optional[str] = None
) -> Tuple[List[dict], int, int, int, int]:
    query = db.query(
        Post.id,
        Post.title,
        Post.content,
        Post.image_url,
        Post.user_id,
        Post.created_at,
        Post.updated_at,
        User.username.label("author_username")
    ).join(User, Post.user_id == User.id)
    
    # Apply search if provided
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Post.title.ilike(search_term),
                Post.content.ilike(search_term)
            )
        )
    
    # Count total matching posts for pagination
    total = query.count()
    
    # Order by most recent first
    query = query.order_by(Post.created_at.desc())
    
    # Apply pagination
    posts = query.offset(skip).limit(limit).all()
    
    # Calculate pagination metadata
    page = skip // limit + 1 if limit > 0 else 1
    pages = (total + limit - 1) // limit if limit > 0 else 1
    
    # Convert the raw query results to dictionaries
    result = []
    for post in posts:
        # Create a dictionary with all attributes
        post_dict = {
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "image_url": post.image_url,
            "user_id": post.user_id,
            "created_at": post.created_at,
            "updated_at": post.updated_at,
            "author_username": post.author_username
        }
        result.append(post_dict)
    
    # Return both the items and total for pagination
    return result, total, page, limit, pages

def update_blog_post(db: Session, post_id: int, blog_update: PostUpdate, current_user:any):
    blog_post = get_blog_post(db, post_id,current_user)
    
    if not blog_post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )
    
    if blog_post["user_id"] != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this blog post"
        )
    
    # Update only provided fields
    update_data = blog_update.model_dump(exclude_unset=True)
    db.query(Post).filter(Post.id == post_id).update(update_data)
    db.commit()
    
    updated_post = get_blog_post(db, post_id, current_user)
    return {
        "id": updated_post["id"],
        "title": updated_post["title"],
        "content": updated_post["content"],
        "image_url": updated_post["image_url"],
        "user_id": updated_post["user_id"],
        "created_at": updated_post["created_at"],
        "updated_at": updated_post["updated_at"],
        "author_username": updated_post["author_username"]
    }


def delete_blog_post(db: Session, post_id: int, current_user:any):
    blog_post = db.query(Post).filter(Post.id == post_id).first()
    
    if not blog_post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )
    
    if blog_post["user_id"] != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this blog post"
        )
    
    db.delete(blog_post)
    db.commit()
    return {"message": "Blog post deleted successfully"}