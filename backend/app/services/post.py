from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import Optional, List, Tuple
from sqlalchemy import or_
from app.models.post import Post
from app.models.user import User
from app.schemas.post import PostCreate, PostUpdate
from app.config import settings

def create_blog_post(db: Session, blog_post: PostCreate, current_user: User):
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

def get_blog_post(db: Session, post_id: int, current_user: User):
    db_blog_post = db.query(Post).filter(Post.id == post_id).first()
    
    if not db_blog_post:
        return None
        
    # Get the author's username
    author = db.query(User).filter(User.id == db_blog_post.user_id).first()
    author_username = author.username if author else "Unknown"
    
    return {
        "id": db_blog_post.id,
        "title": db_blog_post.title,
        "content": db_blog_post.content,
        "image_url": db_blog_post.image_url,
        "user_id": db_blog_post.user_id,
        "created_at": db_blog_post.created_at,
        "updated_at": db_blog_post.updated_at,
        "author_username": author_username
    }

def _process_posts_query_results(posts) -> List[dict]:
    """Helper function to process query results into dictionaries"""
    result = []
    for post in posts:
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
    return result

def _calculate_pagination(total: int, skip: int, limit: int) -> Tuple[int, int, int]:
    """Helper function to calculate pagination metadata"""
    page = skip // limit + 1 if limit > 0 else 1
    pages = (total + limit - 1) // limit if limit > 0 else 1
    return page, limit, pages

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
    page, limit, pages = _calculate_pagination(total, skip, limit)
    
    # Process results
    result = _process_posts_query_results(posts)
    
    # Return both the items and total for pagination
    return result, total, page, limit, pages

def update_blog_post(db: Session, post_id: int, blog_update: PostUpdate, current_user: User):
    # Check if post exists
    db_blog_post = db.query(Post).filter(Post.id == post_id).first()
    
    if not db_blog_post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )
    
    if db_blog_post.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this blog post"
        )
    
    # Update only provided fields
    update_data = blog_update.model_dump(exclude_unset=True)
    db.query(Post).filter(Post.id == post_id).update(update_data)
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

def delete_blog_post(db: Session, post_id: int, current_user: User):
    blog_post = db.query(Post).filter(Post.id == post_id).first()
    
    if not blog_post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )
    
    if blog_post.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this blog post"
        )
    
    db.delete(blog_post)
    db.commit()
    return {"message": "Blog post deleted successfully"}

def get_user_posts(
    db: Session, 
    user_id: int,
    skip: int = 0, 
    limit: int = settings.DEFAULT_PAGE_SIZE,
    search: Optional[str] = None
) -> Tuple[List[dict], int, int, int, int]:
    # First verify the user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    query = db.query(
        Post.id,
        Post.title,
        Post.content,
        Post.image_url,
        Post.user_id,
        Post.created_at,
        Post.updated_at,
        User.username.label("author_username")
    ).join(User, Post.user_id == User.id).filter(Post.user_id == user_id)
    
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
    page, limit, pages = _calculate_pagination(total, skip, limit)
    
    # Process results
    result = _process_posts_query_results(posts)
    
    # Return both the items and total for pagination
    return result, total, page, limit, pages